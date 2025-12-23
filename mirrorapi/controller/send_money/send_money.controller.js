const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const env = config.env;
const notificationUtility = require('../../utility/fcm_notification.utitlity');
const whatsappUtility = require('../../utility/whatsapp.utility');

class SendMoney {
  db = {};

  constructor() {
    this.db = connect();
  }

  async sendMoney(req, res, ipAddress) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { to_user, amount, message, user_id, wallet } = decryptedObject;

    const requiredKeys = Object.keys({ to_user, amount, message, user_id});
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    let t;
    try {
        
        const userId = user_id;
        const getData = await this.db.wallet_transfer.getData(['created_on'], {from_user_id:userId});
        let timeDifferenceSeconds = 61;
        const walletType = wallet?wallet:'Main';
        
        
        if(getData){
            const previousDate = getData.created_on;
            const currentTime = new Date();
            const timeDifferenceMilliseconds = currentTime - previousDate;
            timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
        }
        t = await this.db.sequelize.transaction();
        if (timeDifferenceSeconds > 60) {
            const getTouserDetails = await this.db.user.getData(['id', 'first_name', 'last_name' ,'mobile'], {id: to_user});
           
            let walletbalance = 0;
            if(walletType == 'Main')
            {
                walletbalance = await this.db.wallet.getWalletAmount(userId);
            }

            if(walletType == 'Epin')
            {
                walletbalance = await this.db.epinWallet.getWalletAmount(userId);
            }
            
            if(getTouserDetails)
            {
                if(getTouserDetails.id != userId)
                {   
                    if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
                    { 
                        const transferData = { 
                            from_user_id: userId, 
                            to_user_id: getTouserDetails.id,  
                            amount,
                            message,
                            env,
                            created_by:userId,
                            wallet: walletType
                        };
                        const walletTransafer = await this.db.wallet_transfer.insertData(transferData, { transaction: t });

                        if(walletTransafer)
                        {   
                            const walletTransafer_id = walletTransafer.id;
                            let results = await this.main_wallet(ipAddress, userId, 'Debit', amount, walletTransafer_id, walletType, getTouserDetails.id);
                            results = await this.main_wallet(ipAddress, getTouserDetails.id, 'Credit', amount, walletTransafer_id, walletType, userId);
                            
                            if (results) {
                                
                                const transaferData = await this.db.wallet_transfer.findByPk(walletTransafer_id);
                                transaferData.dataValues.first_name = getTouserDetails.first_name;
                                transaferData.dataValues.last_name = getTouserDetails.last_name;
                                
                             
                               return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Amount successfully transferred to '+getTouserDetails.first_name+' '+getTouserDetails.last_name, data: transaferData })));
                            } else {
                                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to insert data', data: [] })));
                            }
                        }
                    }else{
                        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You do not sufficient wallet balance', data: [] })));
                    }
                }else{
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You can not transfer money to yourself', data: [] })));
                }

            }else{
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Receiver user does not exists', data: [] })));
            }

        }else{
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Duplicate transaction plz wait for 1 minutes to process next transfer', data: [] })));
        }
    } catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
        //   const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.' })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  
  
  

async shoot_Notification(to_user, user_id, amount){
    
    const getTouserDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: to_user});
    const getFromuserDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user_id});

    const to_user_token=await this.db.fcm_notification.getFcmToken(to_user);
    const to_fcmTokens = to_user_token ? to_user_token.token : '';

    const from_user_token=await this.db.fcm_notification.getFcmToken(user_id);
    const from_fcmTokens = from_user_token ? from_user_token.token : '';
    
        if(to_user_token!=null){
            

                if (to_fcmTokens.length > 0) {
                    const message=`Dear ${getTouserDetails.first_name} ${getTouserDetails.last_name}, You have received ${amount} in your wallet.`
                    const notification = await notificationUtility.messageShootNotification(to_fcmTokens,message,getTouserDetails.id,1);
                    await this.db.log_app_notification.insertData(notification);
                }

                if (from_fcmTokens.length > 0) {
                    const message=`Dear ${getFromuserDetails.first_name} ${getFromuserDetails.last_name}, Amount ${amount} successfully transferred to ${getTouserDetails.first_name} ${getTouserDetails.last_name}.`
                    const notification = await notificationUtility.messageShootNotification(from_fcmTokens,message,getFromuserDetails.id,1);
                    await this.db.log_app_notification.insertData(notification);
                }
            return "success";
        }else{
            return "not found";
        }
}
  
  

async check_Notification(req,res){
    
    const {  user_id, toUserId } = req;
    let amount =20;
    const getTouserDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: toUserId});
    const getFromuserDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user_id});

    const to_user_token=await this.db.fcm_notification.getFcmToken(toUserId);
    const to_fcmTokens = to_user_token ? to_user_token.token : '';

    const from_user_token=await this.db.fcm_notification.getFcmToken(user_id);
    const from_fcmTokens = from_user_token ? from_user_token.token : '';
    
        if(to_user_token!=null){
            
                const whatsapp_receiver = await whatsappUtility.sendMoneyMessagetoUser(getTouserDetails.first_name,getTouserDetails.last_name,getTouserDetails.mobile,getFromuserDetails.first_name,getFromuserDetails.last_name,amount);
                await this.db.whatsapp_notification.insertData(whatsapp_receiver);

                const whatsapp_sender = await whatsappUtility.sendMoneyMessageSender(getTouserDetails.first_name,getTouserDetails.last_name,getFromuserDetails.mobile,getFromuserDetails.first_name,getFromuserDetails.last_name,amount);
                await this.db.whatsapp_notification.insertData(whatsapp_sender);

                if (to_fcmTokens.length > 0) {
                    const message=`Dear ${getTouserDetails.first_name} ${getTouserDetails.last_name}, You have received ${amount} in your wallet.`
                    const notification = await notificationUtility.messageShootNotification(to_fcmTokens,message,getTouserDetails.id,1);
                    await this.db.log_app_notification.insertData(notification);
                }

                if (from_fcmTokens.length > 0) {
                    const message=`Dear ${getFromuserDetails.first_name} ${getFromuserDetails.last_name}, Amount ${amount} successfully transferred to ${getTouserDetails.first_name} ${getTouserDetails.last_name}.`
                    const notification = await notificationUtility.messageShootNotification(from_fcmTokens,message,getFromuserDetails.id,1);
                    await this.db.log_app_notification.insertData(notification);
                }
            return "success";
        }else{
            return "not found";
        }
}

  async main_wallet(ipAddress, user_id, type, amount, walletTransafer_id, walletType, user) {
    let tran_for = 'Send Money';
    if(type == 'Credit')
    {
        tran_for = 'Receive Money';
    }
    const order_id=utility.generateUniqueNumeric(7);
    const transaction_id = order_id;
    // Order Generate
        const orderData = {
        user_id:user_id,
        env:config.env, 
        tran_type:type,
        tran_sub_type:tran_for,
        tran_for:tran_for,
        trans_amount:amount,
        currency:'INR',
        order_id,
        order_status:'PENDING',
        created_on:Date.now(),
        created_by:user_id,
        ip_address:ipAddress
    };

    const generateorder = await this.db.upi_order.insertData(orderData); 
    if(generateorder && generateorder.id)
    {
        let wallet = [];
        if(walletType == 'Main')
        {
            const transactionData={
                transaction_id:transaction_id,
                user_id:user_id,
                env:env,
                type:type,
                amount:amount,
                sub_type:tran_for,
                tran_for:'main'
            };
            
            wallet = await this.db.wallet.insert_wallet(transactionData);
        }
        
        if(walletType == 'Epin')
        {
            const etransactionData={
                transaction_id:transaction_id,
                user_id:user_id,
                env:env,
                type:type,
                amount:amount,
                sub_type:tran_for,
                tran_for:'epin'
            };
            
            wallet = await this.db.epinWallet.insert_wallet(etransactionData);
        }

        if(wallet && wallet.error !== undefined && wallet.error === 0){
            const passbookData={
                transaction_id:transaction_id,
                user_id:user_id,
                env:env,
                type:type,
                amount:amount,
                tran_for:tran_for,
                ref_tbl_id:walletTransafer_id
            };
            
            await this.db.passbook.insert_passbook(passbookData);

            await this.db.upi_order.update(
                {order_status:'SUCCESS' },
                { where: { user_id:user_id,order_id:transaction_id,order_status:'PENDING' } }
            );
            
            const updateField = (type === 'Credit') ? { to_transaction_id: transaction_id } : { from_transaction_id: transaction_id };

            await this.db.wallet_transfer.update(
                updateField,
                { where: { id: walletTransafer_id } }
            );
            
            const userDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user_id});
            const user1Details = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user});
            
            let messages = {
                user_id: userDetails.id,
                service: tran_for, 
                message_id: `M${utility.generateUniqueNumeric(7)}`,
                msg_notification: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} transfer successfully to ${user1Details.first_name} ${user1Details.last_name}`,
                msg_whatsup: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} transfer successfully to ${user1Details.first_name} ${user1Details.last_name}`,
                msg_email: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} transfer successfully to ${user1Details.first_name} ${user1Details.last_name}`,
                msg_sms: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} transfer successfully to ${user1Details.first_name} ${user1Details.last_name}`,
            }
            
            if(type == 'Credit')
            {
                messages = {
                    user_id: userDetails.id,
                    service: tran_for, 
                    message_id: `M${utility.generateUniqueNumeric(7)}`,
                    msg_notification: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} received successfully from ${user1Details.first_name} ${user1Details.last_name}`,
                    msg_whatsup: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} received successfully from ${user1Details.first_name} ${user1Details.last_name}`,
                    msg_email: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} received successfully from ${user1Details.first_name} ${user1Details.last_name}`,
                    msg_sms: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} received successfully from ${user1Details.first_name} ${user1Details.last_name}`,
                }
            }
            await this.db.messagingService.insertData(messages);
        }

        return wallet;
    }
  } 
  
  
  
  
  
  
  async sendMoneyList(req, res) {
      
      const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, wallet } = decryptedObject;
    
        const requiredKeys = Object.keys({ user_id});
                
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
   
    try {
        

        const userId = user_id;
        const walletType = wallet?wallet:'Main';
        
        const getSendMoneyData = await this.db.send_money_view.getList(
            ['first_name','last_name','mobile','amount','created_on'],
             {from_user_id:userId, wallet:walletType});

        if (getSendMoneyData) {
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success',data:getSendMoneyData })));
          } else {
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'No data Found', data: [] })));
          }

        
    } catch (error) {
       
        logger.error(`Unable to find record: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  
  
  
  
   async sendMoneyTest(req, res, ipAddress) {
    // const decryptedObject = utility.DataDecrypt(req.encReq);
    const { to_user, amount, message, user_id } = req;

    const requiredKeys = Object.keys({ to_user, amount, message, user_id});
            
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        // return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;
    try {
        
        const userId = user_id;
        const getData = await this.db.wallet_transfer.getData(['created_on'], {from_user_id:userId});
        let timeDifferenceSeconds = 61;
        const walletType = 'Main';
        
        if(getData){
            const previousDate = getData.created_on;
            const currentTime = new Date();
            const timeDifferenceMilliseconds = currentTime - previousDate;
            timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
        }
        t = await this.db.sequelize.transaction();
        if (timeDifferenceSeconds > 60) {
            const getTouserDetails = await this.db.user.getData(['id', 'first_name', 'last_name' ,'mobile'], {id: to_user});
            const getFromuserDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user_id});

            // const to_user_token=await this.db.fcm_notification.getFcmToken(toUserId);
            // const to_fcmTokens = to_user_token ? to_user_token.token : '';
        
            // const from_user_token=await this.db.fcm_notification.getFcmToken(user_id);
            // const from_fcmTokens = from_user_token ? from_user_token.token : '';

            
            const walletbalance = await this.db.wallet.getWalletAmount(userId);
            if(getTouserDetails)
            {
                if(getTouserDetails.id != userId)
                {   
                    if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
                    { 
                        const transferData = { 
                            from_user_id: userId, 
                            to_user_id: getTouserDetails.id,  
                            amount,
                            message,
                            env,
                            created_by:userId
                        };
                        const walletTransafer = await this.db.wallet_transfer.insertData(transferData, { transaction: t });

                        if(walletTransafer)
                        {   
                            const walletTransafer_id = walletTransafer.id;
                            let results = await this.main_wallet(ipAddress, userId, 'Debit', amount, walletTransafer_id, walletType, getTouserDetails.id);
                            results = await this.main_wallet(ipAddress, getTouserDetails.id, 'Credit', amount, walletTransafer_id, walletType, userId);
                            
                            if (results) {
                                
                                const transaferData = await this.db.wallet_transfer.findByPk(walletTransafer_id);
                                transaferData.dataValues.first_name = getTouserDetails.first_name;
                                transaferData.dataValues.last_name = getTouserDetails.last_name;
                                
                                // const whatsapp_receiver = await whatsappUtility.sendMoneyMessagetoUser(getTouserDetails.first_name,getTouserDetails.last_name,getTouserDetails.mobile,getFromuserDetails.first_name,getFromuserDetails.last_name,amount);
                                // await this.db.whatsapp_notification.insertData(whatsapp_receiver);
                
                                // const whatsapp_sender = await whatsappUtility.sendMoneyMessageSender(getTouserDetails.first_name,getTouserDetails.last_name,getFromuserDetails.mobile,getFromuserDetails.first_name,getFromuserDetails.last_name,amount);
                                // await this.db.whatsapp_notification.insertData(whatsapp_sender);
                
                                // if (to_fcmTokens.length > 0) {
                                //     const message=`Dear ${getTouserDetails.first_name} ${getTouserDetails.last_name}, You have received ${amount} in your wallet.`
                                //     const notification = await notificationUtility.messageShootNotification(to_fcmTokens,message,getTouserDetails.id,1);
                                //     await this.db.log_app_notification.insertData(notification);
                                // }
                
                                // if (from_fcmTokens.length > 0) {
                                //     const message=`Dear ${getFromuserDetails.first_name} ${getFromuserDetails.last_name}, Amount ${amount} successfully transferred to ${getTouserDetails.first_name} ${getTouserDetails.last_name}.`
                                //     const notification = await notificationUtility.messageShootNotification(from_fcmTokens,message,getFromuserDetails.id,1);
                                //     await this.db.log_app_notification.insertData(notification);
                                // }
                               return res.status(200).json({ status: 200, message: 'Amount successfully transferred to '+getTouserDetails.first_name+' '+getTouserDetails.last_name, data: transaferData });
                            //   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Amount successfully transferred to '+getTouserDetails.first_name+' '+getTouserDetails.last_name, data: transaferData })));
                            } else {
                                 return res.status(500).json({ status: 500, message: 'Failed to insert data', data: [] });
                                // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to insert data', data: [] })));
                            }
                        }
                    }else{
                         return res.status(500).json({ status: 500, message: 'You do not sufficient wallet balance', data: [] });
                        // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You do not sufficient wallet balance', data: [] })));
                    }
                }else{
                    return res.status(500).json({ status: 500, message: 'You can not transfer money to yourself', data: [] });
                    // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You can not transfer money to yourself', data: [] })));
                }

            }else{
                 return res.status(500).json({ status: 500, message: 'Receiver user does not exists', data: [] });
                // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Receiver user does not exists', data: [] })));
            }

        }else{
            return res.status(500).json({ status: 500, message: 'Duplicate transaction plz wait for 1 minutes to process next transfer', data: [] });
            // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Duplicate transaction plz wait for 1 minutes to process next transfer', data: [] })));
        }
    } catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
        //   const validationErrors = error.errors.map((err) => err.message);
             return res.status(500).json({ status: 500,errors: 'Internal Server Error.' });
        //   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.' })));
        }
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
// 		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  

  
  
  
  
  
  
  
}

module.exports = new SendMoney();