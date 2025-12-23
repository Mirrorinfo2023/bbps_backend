const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const rechargeUtility = require('../../utility/recharge.utility'); 
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const whatsappUtility = require('../../utility/whatsapp.utility');
const notificationUtility = require('../../utility/fcm_notification.utitlity');

class Recharge {

    db = {};

    constructor() {
        this.db = connect();
        
    }

    // async recharge(req,res, ipAddress) {  

		  //let results = {};
		  //const {mobile,amount,type, operatorId, ConsumerNumber, user_id, cwallet} = req;
	
		  //const requiredKeys = Object.keys({ mobile, amount,type, operatorId, ConsumerNumber, user_id});
            
    //   if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
    //     return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    //   }
      
    //   let t = await this.db.sequelize.transaction();
            
    //   try {
    //     let userId = user_id;
    //     let user_type = '';
    //     let plan_id = 1;
    //     let env = config.env;
    //     let date = new Date();
    //     let crdate = utility.formatDate(date);
    //     let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //     let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //     firstDay = utility.formatDate(firstDay);
    //     lastDay = utility.formatDate(lastDay);
    //     let walletbalance = await this.db.wallet.getWalletAmount(userId);
    //     let d_amount = amount;
    //     let wallet = cwallet ? cwallet : 'Cashback';

    //     if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
    //     {
          
    //       let cashback_rate = 0;
    //       let cashback_amount = 0;
    //       let cashback_wallet_balance = await this.db.cashback.getCashbackAmount(userId);

    //       let prime_rate = 0;
    //       let prime_amount = 0;
    //       let prime_wallet_balance = await this.db.prime.getPrimeAmount(userId);

    //       let affiliate_rate = 0;
    //       let affiliate_amount = 0;
    //       let affiliate_wallet_balance = 0;//await this.db.affiliate.getAffiliateAmount(userId);
          
    //       let service_rate = 0;
    //       let service_amount = 0;
    //       let transaction_id = Date.now();

    //       if(!type.includes('electricity') || !type.includes('fasttag') )
    //       {
    //         let discountAmount = await this.db.rechargeServiceDiscount.getOperatorCode(operatorId, type);

    //         if (discountAmount != null && Object.keys(discountAmount).length>0) 
    //         {
    //           if(wallet == 'Cashback' && cashback_wallet_balance>0)
    //           {
    //             cashback_rate = discountAmount.cashback_rate;
    //             cashback_amount = amount*cashback_rate/100;
                
    //             //service_rate = discountAmount.service_rate;
    //             //service_amount = amount*service_rate/100;
    //             if(cashback_wallet_balance>=cashback_amount)
    //             {
    //               d_amount = d_amount-cashback_amount;
    //             }
                
    //           }
              
    //           if(user_type == 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate')){
    //             let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(userId, crdate);
    //             const plan_details = await this.db.cashbackPlan.getData(plan_id);
    //             if(totalDayRecharge !== null)
    //             {
    //               totalDayRecharge = totalDayRecharge;
    //             }else{
    //               totalDayRecharge = 0;
    //             }

    //             if(totalDayRecharge <= 5 && prime_wallet_balance>0){
    //               prime_rate = plan_details.prime_rate;
    //               prime_amount = amount*prime_rate/100;
                  
    //               if(prime_wallet_balance>=prime_amount)
    //               {
    //                 d_amount = d_amount-prime_amount;
    //                 service_rate = prime_rate;
    //                 service_amount = prime_amount;
    //               }
                  
    //             }

    //             if(totalDayRecharge <= 5 && affiliate_wallet_balance>0){
    //               prime_rate = plan_details.prime_rate;
    //               affiliate_amount = amount*prime_rate/100;

    //               if(affiliate_wallet_balance>=affiliate_amount)
    //               {
    //                 d_amount = d_amount-affiliate_amount;
    //                 service_rate = prime_rate;
    //                 service_amount = affiliate_amount;
    //               }
                  
    //             }

    //           } 

    //         }else{
    //           return res.status(500).json({ status: 500, error: 'Recharge Setup is not completed! Please try again' });
    //         }
    //       }
    //       let rechargePermission = 0;
    //       if(!type.includes('electricity') || !type.includes('fasttag') )
    //       {
    //         let electricity = await this.db.recharge.getRechargeCount(userId, firstDay, lastDay, 'electricity');
    //         let fasttag = await this.db.recharge.getRechargeCount(userId, firstDay, lastDay, 'fasttag');
    //         rechargePermission = electricity + fasttag;
    //       }
          
         
    //       if(rechargePermission===0)
    //       {
            
    //         const order_id=utility.generateUniqueNumeric(7);
    //         transaction_id = order_id;
    //         // Order Generate
    // 	      const orderData = {
    //             user_id:userId,
    //             env:config.env, 
    //             tran_type:'Debit',
    //             tran_sub_type:'Recharge',
    //             tran_for:'Recharge',
    //             trans_amount:amount,
    //             currency:'INR',
    //             order_id,
    //             order_status:'PENDING',
    //             created_on:Date.now(),
    //             created_by:userId,
    //             ip_address:ipAddress
    //         };
            
    //         const generateorder = await this.db.upi_order.insertData(orderData);  
    //         let rechargeEntry = [];
    //         if(generateorder && generateorder.id)
    //         {
    //           // Recahrge Entry
    //           const rechargeData = { 
    //             ConsumerNumber: ConsumerNumber, 
    //             operatorId: operatorId,  
    //             amount: d_amount,
    //             type:type,
    //             main_amount: amount,
    //             env: env,
    //             service_rate: service_rate,
    //             service_amount: service_amount,
    //             cashback_amount: cashback_amount,
    //             cashback_rate: cashback_rate,
    //             recharge_status: 'PENDING',
    //             user_id: userId,
    //             transaction_id: transaction_id,
    //             status:2
    //           };
    //           rechargeEntry = await this.db.recharge.insert(rechargeData, { transaction: t });
    //         }
            
    //         if (rechargeEntry) {
    //           //const getAllrecharge = await this.db.recharge.getAllRechargeCount();
    //           let requestId = transaction_id;
    //           let getAllPanel = await this.db.panel.getAllData();

    //           const responses = getAllPanel.map(entry => {
    //             const { excutable_fun, service_url, id } = entry;
            
    //             if (typeof rechargeUtility[excutable_fun] === 'function') {
    //               const selectedFunction = rechargeUtility[excutable_fun];
    //               const panel_id = id;
                  
    //               return this.getOperatorCode(panel_id, operatorId, type)
    //               .then(operator_code => {
    //                  return selectedFunction(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panel_id);
    //               });
                  
    //             } else {
    //               console.error(`Function '${excutable_fun}' does not exist.`);
    //               return Promise.resolve({ error: `Function '${excutable_fun}' does not exist.` });
    //             }
    //           });
              
    //           let coupon_type = 'MIW';
    //           let getCashbackPlan = await this.db.cashbackPlan.getData(plan_id);
    //           getCashbackPlan = getCashbackPlan.dataValues;
              
    //           const couponMstr = await this.db.couponMstr.getCouponMstr(coupon_type);
              
    //           return Promise.race(responses)
    //          .then(result => {
    //             const { result: response, panel_id } = result;

    //             //update in recharge for success
    //             const updateData = { 
    //               recharge_status: response.status,
    //               http_code: '',
    //               response_code: '',
    //               message: response.message,
    //               description: response.message,
    //               status: 1,
    //               trax_id: response.transactionID,
    //               updated_on: date.getTime(),
    //               updated_by: userId,
    //               panel_id:panel_id
    //             }

    //             const whereClause = { id:rechargeEntry.id };
    //             return this.db.recharge.updateData(updateData, whereClause, { transaction: t });
    //          })
    //          .then(updateRecharge => {
    //             if (updateRecharge) {
    //               //entry in wallet for deduction
    //               const walletData = {
    //                 transaction_id:transaction_id,
    //                 user_id:userId,
    //                 env:env,
    //                 type:'Debit',
    //                 amount:d_amount,
    //                 sub_type:'Recharge',
    //                 tran_for:'main'
    //               };
                
    //               return this.db.wallet.insert_wallet(walletData, { transaction: t });
    //             }
    //           })
    //           .then(orderupdate=>{
    //             if(orderupdate) {
    //                 return this.db.upi_order.update(
    //                 {order_status:'SUCCESS' },
    //                 { where: { user_id:userId,order_id:transaction_id,order_status:'PENDING' }, t }
    //               );
    //             }
    //           })
    //           .then(passbookEntry => {
    //             if(passbookEntry) {
    //               //entry in Passbook
    //               const passbookData={
    //                 transaction_id:transaction_id,
    //                 user_id:userId,
    //                 env:env,
    //                 type:'Debit',
    //                 amount:d_amount,
    //                 tran_for:'Recharge',
    //                 ref_tbl_id:rechargeEntry.id
    //               };
                
    //               return this.db.passbook.insert_passbook(passbookData, { transaction: t });
    //             }
    //           })
    //           .then(deductionEntry => {
    //             //Entry for cashback
    //             if(deductionEntry && cashback_amount > 0)
    //             {

    //               const cashbackData = {
    //                 user_id:userId, 
    //                 env: env, 
    //                 type: 'Debit', 
    //                 sub_type: 'Recharge', 
    //                 tran_for: 'Recharge', 
    //                 amount:cashback_amount,
    //                 transaction_id:transaction_id
                    
    //               };
    //               return this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });

    //             }
    //           })
    //           .then(deductionEntry1 => {
    //             //create for coupon
    //             if(prime_amount>0 && user_type == 'Prime' && wallet=='Prime' && (!type.includes('electricity') || !type.includes('fasttag'))){
    //               // let coupon_id = couponMstr['id'];
    //               // let coupon_code = coupon_type+'PRIME'+(getCashbackPlan.plan_name).toUpperCase();
    //               // let coupon_send_date = utility.formatDateTime(date);
    //               // let coupon_expire_date = utility.formatDateTime(new Date(new Date(coupon_send_date).getTime() + 60 * 60 * 24 * 1000));
    //               // let remaining_days = 1;
    //               // let applied_for = 'Cashback for prime member';

    //               // let order_id = 'CPN-'+userId+transaction_id;

    //               // const couponData = {
    //               //   user_id:userId,
    //               //   coupon_code:coupon_code,
    //               //   coupon_type:coupon_type,
    //               //   coupon_send_date:coupon_send_date,
    //               //   coupon_expire_date:coupon_expire_date,
    //               //   remaining_days:remaining_days,
    //               //   coupon_used:0,
    //               //   isScratch:0,
    //               //   coupon_id:coupon_id,
    //               //   applied_for:applied_for,
    //               //   order_id:order_id,
    //               //   redeem_amount:wallet_amount
    //               // }
                  
    //               // return this.db.coupon.insert(couponData, { transaction: t });
    //               const primeData = {
    //                 user_id:userId, 
    //                 env: env, 
    //                 type: 'Debit', 
    //                 sub_type: 'Recharge', 
    //                 tran_for: 'Recharge', 
    //                 amount:prime_amount,
    //                 transaction_id:transaction_id
    //                 };
                  
    //               return this.db.prime.insert_prime_wallet(primeData);
    //             }
    //           })
    //           .then(deductionEntry2=>{
    //             t.commit();
    //             return res.status(200).json({ status: 200,  message: 'Recharge successfully done' ,data:rechargeEntry});
    //           })
    //           .catch(error => {
    //             const { error: errResp, panel_id } = error;
    //             //console.error('Promise rejected:', errResp.message);
    //             //return res.status(500).json({ status: 500,error: error.message });
 
    //             const updateData = { 
    //               recharge_status: errResp.status,
    //               http_code: '',
    //               response_code: '',
    //               message: errResp.message,
    //               description: errResp.message,
    //               status: 3,
    //               trax_id: errResp.transactionID,
    //               updated_on: date.getTime(),
    //               updated_by: userId,
    //               panel_id:panel_id
    //             }

    //             const whereClause = { id:rechargeEntry.id };
    //             return this.db.recharge.updateData(updateData, whereClause, { transaction: t });
                
    //           })
    //           .then(error =>{
    //             return res.status(500).json({ status: 500,error: 'Sorry ! Failed to recharge' });
    //           })
    //           .catch(error => {
    //             // Handle any additional errors that might occur
    //             console.error('Error:', error);
    //             return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    //           });

    //         }else{
    //           await t.rollback()
    //           return res.status(500).json({ status: 500,error: 'Sorry ! Please try again' });
    //         }
    //       }else{
    //         await t.rollback()
    //         return res.status(500).json({ status: 500,error: 'You have already bill payment from this account' });
    //       }
    //     }else{
    //         return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
    //     }
    
    //   }catch (error) {
    //     await t.rollback();
    //     logger.error(`Unable to find user: ${error}`);
    //     if (error.name === 'SequelizeValidationError') {
    //       const validationErrors = error.errors.map((err) => err.message);
    //       return res.status(500).json({ status: 500,errors: validationErrors });
    //     }
			
    //     return res.status(500).json({ status: 500,  message: error ,data:[]});
    //   }
		  //return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    // }
    
    
    async recharge_cashback_eligibility (req,res) { 
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id,cwallet,amount } = decryptedObject;
      const requiredKeys = Object.keys({user_id,cwallet,amount});
            
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      try{

        let userId = user_id;
        
        const checkplan  = await this.db.PlanPurchase.getAllPlanUser(userId);
        let maxPlan = null;
        let wallet = cwallet ? cwallet : '';
        let date = new Date();
        let crdate = utility.formatDate(date);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDay = utility.formatDate(firstDay);
        lastDay = utility.formatDate(lastDay);
        let walletbalance = await this.db.wallet.getWalletAmount(userId);
        let minutesDifference = null;
        let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(userId, crdate);
        let totalRechargeOfaMonth = await this.db.recharge.getRechargeForMonth(userId, firstDay, lastDay);
        let make_recharge = 0;
        if(checkplan.length > 0)
        {
          maxPlan = Math.max(...checkplan);

        }
        
        let user_type = (maxPlan !=null) ? 'Prime' : 'Nonprime';
        
        const lastRecharge = await this.db.recharge.findOne({
            where: {
                user_id: userId
            },
            order: [['id', 'DESC']]
        });
        
        if(lastRecharge)
        {
            const lastRecordTime = new Date(lastRecharge.created_on);
            const timeDifference = date - lastRecordTime;
            minutesDifference = timeDifference / (1000 * 60);
        }


        if (minutesDifference!=null && minutesDifference <= 1) {
            return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Duplicate recharge, please make recharge after 1 minutes', recharge_count: totalDayRecharge, make_recharge:make_recharge })));
          //return res.status(201).json({ status: 201, error: 'Duplicate recharge, please make recharge after 1 minutes' });
        }
        
        
        
        if( user_type != 'Prime' && totalRechargeOfaMonth >= 1){
            make_recharge = 1;
              return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201,message: 'Sorry ! You have not take prime thus you will make recharge one time in a month.' , recharge_count: totalRechargeOfaMonth, make_recharge: make_recharge})));
            //return res.status(201).json({ status: 201,error: 'Sorry ! You have not take prime thus you will make recharge one time in a day.' });
          }
        
        if(walletbalance!==null && walletbalance > 0 && walletbalance >= parseInt(amount))
        {

          const whereChk={id:userId};
          const UserAttribute=['first_name','last_name','mobile'];
          const userRow = await this.db.user.getData(UserAttribute,whereChk);


          if(totalDayRecharge > 5){
              return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201,message: 'Sorry ! You have cross the limit of today recharge' , recharge_count: totalDayRecharge, make_recharge:make_recharge})));
            //return res.status(201).json({ status: 201,error: 'Sorry ! You have cross the limit of today recharge' });
          }

          const isAlreadyUsed = await this.db.prime.hasUsedPrimeWallet(user_id, 'Recharge');
          
          if(user_type != 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate') && isAlreadyUsed){
            //return res.status(201).json({ status: 201, error: userRow.first_name + ' ' + userRow.last_name + ', You have not take prime thus you will use prime wallet one time in a month. If you want more savings get prime membership and enjoy biggest cashback.' });
            return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: userRow.first_name + ' ' + userRow.last_name + ', You have not take prime thus you will use prime wallet one time in a month. If you want more savings get prime membership and enjoy biggest cashback.', recharge_count: totalDayRecharge, make_recharge:make_recharge })));
              
          }

          if(user_type == 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate') && totalDayRecharge > 2){
            
            return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: userRow.first_name + ' ' + userRow.last_name + ', You have used prime  wallet 2 times in a day, If you want more savings then select cashback wallet and enjoy biggest cashback.', recharge_count: totalDayRecharge, make_recharge:make_recharge })));
            //return res.status(201).json({ status: 201, error: userRow.first_name + ' ' + userRow.last_name + ', You have used prime  wallet 2 times in a day, If you want more savings then select cashback wallet and enjoy biggest cashback.' });
          }

          if((wallet == 'Prime' || wallet == 'Affiliate') && amount >= 1000 ){
            return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: userRow.first_name + ' ' + userRow.last_name + ', this recharge is use for commercial purpose so you can not use prime wallet, If you want more savings than select cashback wallet and enjoy biggest cashback.', recharge_count: totalDayRecharge, make_recharge:make_recharge })));
            //return res.status(201).json({ status: 201, error: userRow.first_name + ' ' + userRow.last_name + ', this recharge is use for commercial purpose so you can not use prime wallet, If you want more savings than select cashback wallet and enjoy biggest cashback.' });
          }
          
          
          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'You are eligible for cashback', recharge_count: totalDayRecharge, make_recharge:make_recharge })));
        //return res.status(200).json({ status: 200, message: 'You are eligible for cashback' });

        }else{
            return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201,message: 'You do not have sufficient wallet balance'})));
          //return res.status(201).json({ status: 201,error: 'You do not have sufficient wallet balance' });
        }

        

      }catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
          //return res.status(500).json({ status: 500,errors: validationErrors });
        }
		//return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));	
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));	
		  //return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});


    }
    
    
    async recharge(req,res,ipAddress) {  
        const decryptedObject = utility.DataDecrypt(req.encReq);
		  let results = {};
		  const {mobile,amount,type, operatorId, ConsumerNumber, user_id, cwallet, is_assured} = decryptedObject;
      //const allowedWalletValues = ['Cashback', 'Prime', 'Affiliate'];
	
		  const requiredKeys = Object.keys({ mobile, amount,type, operatorId, ConsumerNumber, user_id, cwallet});
            
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //  return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
         return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

    //   if (!allowedWalletValues.includes(cwallet)) {
    //       return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Invalid value for the wallet field', allowedValues: allowedWalletValues })));
    //   }
      
      let t = await this.db.sequelize.transaction();
      //const circleId = circle_id?circle_id:14; 
      const circleId = 14;
      try {
        let userId = user_id;
        const checkplan  = await this.db.PlanPurchase.getAllPlanUser(userId);
        
        let maxPlan = null;
        if(checkplan.length > 0)
        {
          maxPlan = Math.max(...checkplan);
        }
        
        let user_type = (maxPlan !=null) ? 'Prime' : 'Nonprime';
        let plan_id = maxPlan ? maxPlan : null;
        
        let env = config.env;
        let date = new Date();
        let crdate = utility.formatDate(date);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDay = utility.formatDate(firstDay);
        lastDay = utility.formatDate(lastDay);
        let walletbalance = await this.db.wallet.getWalletAmount(userId);
        let d_amount = amount;
        let wallet = cwallet ? cwallet : '';
        let check_assured = is_assured? is_assured: 0;
        let failed_amount = 0;
        let failed_message = '';
        let failed_reference ='';
        let failed_transaction = '';
        let minutesDifference = null;
       
        const whereChk={id:userId};
        const UserAttribute=['first_name','last_name','mobile'];
        const userRow = await this.db.user.getData(UserAttribute,whereChk);
        let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(userId, crdate);  
        let totalRechargeOfaMonth = await this.db.recharge.getRechargeForMonth(userId, firstDay, lastDay);
        
        const lastRecharge = await this.db.recharge.findOne({
            where: {
                user_id: userId
            },
            order: [['id', 'DESC']]
        });
        
        if(lastRecharge)
        {
            const lastRecordTime = new Date(lastRecharge.created_on);
            const timeDifference = date - lastRecordTime;
            minutesDifference = timeDifference / (1000 * 60);
        }


        if (minutesDifference!=null && minutesDifference <= 1) {
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Duplicate recharge, please make recharge after 1 minutes' })));
          //return res.status(500).json({ status: 500, error: 'Duplicate recharge, please make recharge after 1 minutes' });
        }
        
        if(user_type != 'Prime' && totalRechargeOfaMonth >= 1){
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,message: 'Sorry ! You have not take prime thus you will make recharge one time in a month.' , recharge_count: totalRechargeOfaMonth})));
            //return res.status(500).json({ status: 500,error: 'Sorry ! You have not take prime thus you will make recharge one time in a day.' });
        }
        
        if(walletbalance!==null && walletbalance > 0 && walletbalance >= parseInt(amount))
        {
          
          let cashback_rate = 0;
          let cashback_amount = 0;
          let cashback_wallet_balance = await this.db.cashback.getCashbackAmount(userId);

          let prime_rate = 0;
          let prime_amount = 0;
          let prime_wallet_balance = await this.db.prime.getPrimeAmount(userId);

          let affiliate_rate = 0;
          let affiliate_amount = 0;
          let affiliate_wallet_balance = 0;//await this.db.affiliate.getAffiliateAmount(userId);
          
          let service_rate = 0;
          let service_amount = 0;
          let transaction_id = Date.now();
          
          
          
          
          if(totalRechargeOfaMonth == 0 && wallet == 'Prime' && user_type != 'Prime' && check_assured == '0'){
            prime_rate = '5.00';
            prime_amount = amount*prime_rate/100; 

            if(prime_wallet_balance>=prime_amount)
            {
              d_amount = d_amount-prime_amount;
              service_rate = prime_rate;
              service_amount = prime_amount;
            }
          }
                
            if(totalDayRecharge !== null)
            {
              totalDayRecharge = totalDayRecharge;
            }else{
              totalDayRecharge = 0;
            }

          if((!type.includes('electricity') || !type.includes('fasttag')) && check_assured == '0' )
          {
            let discountAmount = await this.db.rechargeServiceDiscount.getOperatorCode(operatorId, type);

            if (discountAmount != null && Object.keys(discountAmount).length>0) 
            {
                // service_rate = discountAmount.service_rate;
                // service_amount = amount*service_rate/100;
                
              if(wallet == 'Cashback' && cashback_wallet_balance>0)
              {
                  
                if(user_type == 'Prime'){
                  cashback_rate = discountAmount.cashback_rate;
                }else{
                  cashback_rate = 1;
                }
                
                cashback_amount = amount*cashback_rate/100;

                if(cashback_wallet_balance>=cashback_amount)
                {
                    cashback_amount = cashback_amount;
                  d_amount = d_amount-cashback_amount;
                }else{
                    cashback_amount = 0;
                }
                
              }
              
              if(user_type == 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate') && plan_id > 0 && totalDayRecharge <= 2){
                  const plan_details = await this.db.cashbackPlan.getData(plan_id);
               

                if(prime_wallet_balance>0){
                  prime_rate = plan_details.prime_rate;
                  prime_amount = amount*prime_rate/100;
                  
                  if(prime_wallet_balance>=prime_amount)
                  {
                    d_amount = d_amount-prime_amount;
                    service_rate = prime_rate;
                    service_amount = prime_amount;
                  }
                  
                }

                if(affiliate_wallet_balance>0){
                  prime_rate = plan_details.prime_rate;
                  affiliate_amount = amount*prime_rate/100;

                  if(affiliate_wallet_balance>=affiliate_amount)
                  {
                    d_amount = d_amount-affiliate_amount;
                    service_rate = prime_rate;
                    service_amount = affiliate_amount;
                  }
                  
                }

              } 

            }else{
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Recharge Setup is not completed! Please try again' })));
            }
          }
          let rechargePermission = 0;
          if(!type.includes('electricity') || !type.includes('fasttag') )
          {
            let electricity = await this.db.recharge.getRechargeCount(userId, firstDay, lastDay, 'electricity');
            let fasttag = await this.db.recharge.getRechargeCount(userId, firstDay, lastDay, 'fasttag');
            rechargePermission = electricity + fasttag;
          }
          
          
          const isAlreadyUsed = await this.db.prime.hasUsedPrimeWallet(user_id, 'Recharge');
          if(user_type != 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate') && isAlreadyUsed){
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({  status: 500, error: userRow.first_name + ' ' + userRow.last_name + ', You have not take prime thus you will use prime wallet one time in a month. If you want more savings get prime membership and enjoy bigest cashback.' })));
          }
          
          if(user_type == 'Prime' && (wallet == 'Prime' || wallet == 'Affiliate') && totalDayRecharge > 2){
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({  status: 500, error: userRow.first_name + ' ' + userRow.last_name + ', You have used prime  wallet 2 times in a day, If you want more savings then select cashback wallet and enjoy bigest cashback.' })));
          }

          if((wallet == 'Prime' || wallet == 'Affiliate') && amount >= 1000 ){
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({  status: 500, error: userRow.first_name + ' ' + userRow.last_name + ', this recharge is use for commercial purpose so you can not use prime wallet, If you want more savings than select cashback wallet and enjoy biggest cashback.' })));
          }
          
          
          if(totalDayRecharge >= 5){
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Sorry ! You have cross the limit of today recharge' })));
          }
         
          if(totalDayRecharge <= 5 && rechargePermission===0)
          {
              //let isCashback = (check_assured == 1)?null:1;
            let getAllPanel = await this.db.panel.getAllData();
            
            let flag = '';
            let group_transaction_no = utility.generateUniqueNumeric(7);
            for (const panel of getAllPanel) {
                let walletBalanceCheck = await this.db.wallet.getWalletAmount(userId);
                
                if (walletBalanceCheck === null || Number(walletBalanceCheck) <= 0 || Number(walletBalanceCheck) < parseInt(amount))
                {
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Sorry ! Failed to recharge', data:[] })));
                }
                
                const order_id=utility.generateUniqueNumeric(7);
                transaction_id = order_id;
                // Order Generate
                const orderDatas = {
                    user_id:userId,
                    env:env, 
                    tran_type:'Debit',
                    tran_sub_type:'Recharge',
                    tran_for:'Recharge',
                    trans_amount:amount,
                    currency:'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on:Date.now(),
                    created_by:userId,
                    ip_address:ipAddress,
                    group_transaction_no: group_transaction_no
                };
                
                const generateorder = await this.db.upi_order.insertData(orderDatas); 
                try {
                    
                    // let requestId = transaction_id;
                    //     const { excutable_fun, service_url, id } = panel;
                    //     const panelId = id;
                    //         const operator_code = await this.getOperatorCode(panelId, operatorId, type);
                    //  const result = await rechargeUtility.kpps(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panelId, circleId);
                    //  return result;
                           
                    const reqParam = {userId, 'type': 'Debit', 'tran_for':'Recharge', amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
            cashback_amount, cashback_rate, env, 'prime_amount':service_amount, 'recharge_type':type,transaction_id,  t};

                    const orderData = await this.rechargeRequest(reqParam);
                    
                    if(orderData.status == true && orderData.recharge_status=='success')
                    {
                        let requestId = transaction_id;
                        const { excutable_fun, service_url, id } = panel;

                        if (typeof rechargeUtility[excutable_fun] === 'function') {
                            const selectedFunction = rechargeUtility[excutable_fun];
                            
                            const panelId = id;
                            const operator_code = await this.getOperatorCode(panelId, operatorId, type);
                            const { result: response, panel_id } = await selectedFunction(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panelId, circleId);
                           
                            // console.log(response);
                            const updateData = { 
                                recharge_status: response.status,
                                http_code: '',
                                response_code: '',
                                message: response.message,
                                description: response.message,
                                status: 1,
                                trax_id: response.transactionID,
                                updated_on: date.getTime(),
                                updated_by: userId,
                                panel_id:panel_id,
                                flag: flag,
                                circle_id: circleId
                              }
                               
                            const whereClause = { id:orderData.rechargeId };
                            const updateRecharge = await this.db.recharge.updateData(updateData, whereClause, { transaction: t });
                            const recgData = await this.db.rechargeReport.findByPk(orderData.rechargeId);
                            
                            if (recgData.message.includes('sufficient balance') || recgData.message.includes('Insufficient Balance')) {
                                  recgData.message = 'Due to some technical issue recharge has been failed';
                                  recgData.description = 'Due to some technical issue recharge has been failed';
                            }
                            flag = 'Retry';
                                await this.db.upi_order.update(
                                    {order_status:'SUCCESS' },
                                    { where: { user_id:userId,order_id:transaction_id,order_status:'PENDING' }, t }
                                );
                            if(updateRecharge){
                                
                                if(wallet == 'Cashback' && cashback_amount > 0)
                                {
                                  await this.rePurchaseIncome(env, userId, amount, cashback_amount, ipAddress, transaction_id, type, t );
                                }
                                
                                if(await this.db.mobileOperator.getCount(ConsumerNumber, operatorId) == 0)
                                {
                                  const mOperatorEntry = { 
                                    operator_id: operatorId, 
                                    operator_name: '',  
                                    circle: '',
                                    mobile_no:ConsumerNumber,
                                    created_by: userId
                                  };
                                  await this.db.mobileOperator.insertData(mOperatorEntry, { transaction: t });
                                }
                               
                                
                                t.commit();
                                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message: 'Recharge successfully done' ,data:recgData})));
                            }    
                            
                        } else {
                            console.error(`Function '${excutable_fun}' does not exist.`);
                            return Promise.resolve({ error: `Function '${excutable_fun}' does not exist.` });
                        }
                    }else{
                        const recgData = await this.db.rechargeReport.findByPk(orderData.rechargeId);
                        // return res.status(202).json({ status: 202,  message: 'Your recharge has been temporarily Hold for security reasons. Please contact the support team-9112421742.', data:recgData});
                        return res.status(202).json(utility.DataEncrypt(JSON.stringify({ status: 202,  message: 'Your recharge has been temporarily Hold for security reasons. Please contact the support team-9112421742.', data:recgData})));
                        
                    }

                } catch ({ result: response, panel_id }) {
                    if(response!=null && response.status=='FAILURE')
                    {
                        let reTransaction_id = utility.generateUniqueNumeric(7);
                        // Order Generate
                        const reorderData = {
                            user_id:userId,
                            env:env, 
                            tran_type:'Credit',
                            tran_sub_type:'Recharge',
                            tran_for:'Refund',
                            trans_amount:amount,
                            currency:'INR',
                            order_id:reTransaction_id,
                            order_status:'SUCCESS',
                            created_on:Date.now(),
                            created_by:userId,
                            ip_address:ipAddress,
                            group_transaction_no: group_transaction_no
                        };
                        
                        const generateorder = await this.db.upi_order.insertData(reorderData); 
    
                        const reqParam = {userId, 'type': 'Credit', 'tran_for':'Refund', amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
                            cashback_amount, cashback_rate, env, 'prime_amount':service_amount, 'recharge_type':type,'transaction_id':reTransaction_id,  t};
    
                        const rechargeResponse = await this.rechargeRequest(reqParam);
                        if(rechargeResponse)
                        {
                            const updateData = { 
                                recharge_status: response.status,
                                http_code: '',
                                response_code: '',
                                message: response.message,
                                description: response.message,
                                status: 3,
                                trax_id: response.transactionID,
                                updated_on: date.getTime(),
                                updated_by: userId,
                                panel_id:panel_id,
                                flag:flag,
                                circle_id: circleId
                            }
    
    
                            const getOrder = await this.db.upi_order.findOne({
                              attributes: ['reference_no'],
                              where:{
                                  user_id:user_id,
                                  order_id:transaction_id,
                              }
                            });
                            if (response.message.includes('sufficient balance') || response.message.includes('Insufficient Balance')) {
                              response.message = 'Due to some technical issue recharge has been failed';
                            }               
                            
                            failed_amount = amount;
                            failed_message = response.message;
                            failed_reference = getOrder.reference_no;
                            failed_transaction = response.transactionID;
            
                            const whereClause = { transaction_id:transaction_id };
                            await this.db.recharge.updateData(updateData, whereClause);
                            flag = 'Retry';
                            
                            await this.db.upi_order.update(
                              {order_status: 'SUCCESS' },
                              { where: { user_id:userId,order_id:transaction_id }, t }
                            );
                            
                            
                            
                                    
                        }
                    }

                }
            }
            
            
            const failedData = {
                  'failed_amount': failed_amount,
                  'failed_message': failed_message,
                  'failed_reference': failed_reference,
                  'failed_transaction': failed_transaction
              }
            
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Sorry ! Failed to recharge', data:failedData })));
            // return res.status(500).json({ status: 500, error: 'Sorry ! Failed to recharge', data:failedData });

          }else{
            await t.rollback();
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Sorry ! You have cross the limit of today recharge' })));
            // return res.status(500).json({ status: 500,error: 'Sorry ! You have cross the limit of today recharge' });
          }
        }else{
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'You do not have sufficient wallet balance' })));
            // return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
        }
    
      }catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        // return res.status(500).json({ status: 500,errors: validationErrors });
        }
		
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));	
// 		return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
		  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));	
    }
    
    
    async shoot_Notification(req,res){
     
        const {user_id,responsed}= req;
  
              const where = { id: user_id };
              const Attr = ['first_name', 'last_name', 'mlm_id','mobile'];
              const userData = await this.db.user.getData(Attr, where);
                
              let message='';
              const user_token=await this.db.fcm_notification.getFcmToken(user_id);
              if(user_token!=null){
                  const fcmTokens = user_token ? user_token.token : '';
                  
                  if (fcmTokens.length > 0) {
                    // if(responsed=='success'){
                       message=`Dear ${userData.first_name} ${userData.last_name},Your recharge done Successfully`;
                    // }
                    // else{
                    //   message=`Dear ${userData.first_name} ${userData.last_name},Your recharge Failed`;
                    // }
                    
                     const notification = await notificationUtility.messageShootNotification(fcmTokens,message,user_id,1);
                     await this.db.log_app_notification.insertData(notification);
                     return "success";
                  }
              }else{
                  return "not found";
              }
      
}
    
    async rePurchaseIncome(env, user_id, amount, cashback_amount, ipAddress, transaction_id, type, t )
    {
      try {

        
        let sub_type = type;
        if(type == 'Prepaid' || type == 'Postpaid')
        {
          sub_type = 'Mobile';
        }

        const referrals = await this.db.referral_idslevel.getRefralUser(user_id);

        let results = [];
       for (const referral of referrals) {
            let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);
            let credit_amount = (0.20*cashback_amount/15).toFixed(2);
            let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
            
            const userDataRef = await this.db.user.findOne({
                attributes: ['first_name', 'last_name', 'mlm_id', 'is_levelincome'],
                where: {id: referral.ref_userid}
            });
            
            const is_levelincome=userDataRef?userDataRef.is_levelincome:null;
            /*********************STOP LEVELE INCOME**********************/
            if(is_levelincome  && is_levelincome==0){
                
                credit=0;
            }
            
          if(referral.ref_userid>0 && credit_amount>0)
          {
            const order_id=utility.generateUniqueNumeric(7);
            const orderData = {
                user_id:referral.ref_userid,
                env:env, 
                tran_type:'Credit',
                tran_sub_type:'Recharge Repurchase',
                tran_for:'Repurchase',
                trans_amount:credit_amount,
                currency:'INR',
                order_id,
                order_status:'PENDING',
                created_on:Date.now(),
                created_by:user_id,
                ip_address:ipAddress,
                group_transaction_no: transaction_id
            };
              
            const generateorder = await this.db.upi_order.insertData(orderData); 

            if(generateorder){
              const refralData = {
                  user_id:referral.ref_userid,
                  transaction_id: order_id,
                  env: env, 
                  type: 'Credit', 
                  sub_type: sub_type, 
                  opening_balance: opening_balance,
                  credit: credit_amount,
                  debit:0,
                  closing_balance: closing_balance,
                  tran_for: 'Repurchase', 
                  created_by:user_id,
                  details: sub_type + ' Repurchase(' +amount+ ')',
                  sender_id: user_id,
                  level: referral.level,
                  plan_id:5
              };
              const result = await this.db.ReferralIncome.insert(refralData);
              results.push(result);
            }
          }
          
        }
        return results;

      } catch (error) {
        console.error(error.message);
        return  {'status': false};
    }
    }
    
    
    async rechargeRequest(reqParam)
    {
        const {userId, type, tran_for, amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
            cashback_amount, cashback_rate, env, prime_amount,recharge_type,transaction_id,approve_status, t} = reqParam;
        console.log(reqParam);
        const setting = await this.db.setting.getDataRow(['recharge_cutoff_limit']);

        try 
        {
            let rechargeEntry = [];
            if(tran_for == 'Recharge')
            {
                
                if(transaction_id)
                {
                // Recahrge Entry
                    const rechargeData = { 
                        ConsumerNumber: ConsumerNumber, 
                        operatorId: operatorId,  
                        amount: d_amount,
                        type:recharge_type,
                        main_amount: amount,
                        env: env,
                        service_rate: service_rate,
                        service_amount: service_amount,
                        cashback_amount: cashback_amount,
                        cashback_rate: cashback_rate,
                        recharge_status: 'PENDING',
                        user_id: userId,
                        transaction_id: transaction_id,
                        status:2
                    };
                    rechargeEntry = await this.db.recharge.insert(rechargeData, { transaction: t });
                }

                if((parseFloat(amount) >= parseFloat(setting.recharge_cutoff_limit)) && approve_status==null)
                {
                    const reupdateData = { 
                        recharge_status: 'HOLD',
                        message: 'Recharge has been temporarily on hold',
                        description: 'Recharge has been temporarily on hold for verification',
                        status: 4,
                        http_code: '202'
                    }

                    rechargeEntry.recharge_status=reupdateData.recharge_status;
                    rechargeEntry.message=reupdateData.message;
                    rechargeEntry.description=reupdateData.description;
                    rechargeEntry.status=reupdateData.status;
                    rechargeEntry.http_code=reupdateData.http_code;

                    const whereClause = { id:rechargeEntry.id };
                    await this.db.recharge.updateData(reupdateData, whereClause, { transaction: t });
                    
                    t.commit();
                    return  {'status': true, 'recharge_status': 'hold', 'rechargeId': rechargeEntry.id, 'transaction_id': transaction_id};
                }
            }

            //entry in wallet for deduction
            const walletData = {
                transaction_id:transaction_id,
                user_id:userId,
                env:env,
                type:type,
                amount:d_amount,
                sub_type:'Recharge',
                tran_for:'main'
            };
            
            const walletEntry = await this.db.wallet.insert_wallet(walletData, { transaction: t });

            if(walletEntry && parseFloat(cashback_amount) > 0)
            {

                const cashbackData = {
                    user_id:userId, 
                    env: env, 
                    type: type, 
                    sub_type: 'Recharge', 
                    tran_for: tran_for, 
                    amount:cashback_amount,
                    transaction_id:transaction_id
                
                };
                const cashbackEntry = await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });

            }
            
            if(walletEntry && parseFloat(prime_amount)>0)
            {
                const primeData = {
                    user_id:userId, 
                    env: env, 
                    type: type, 
                    sub_type: 'Recharge', 
                    tran_for: tran_for, 
                    amount:prime_amount,
                    transaction_id:transaction_id
                };
                
                const primeEntry = await this.db.prime.insert_prime_wallet(primeData, { transaction: t });
            }

            return  {'status': true, 'recharge_status': 'success', 'rechargeId': rechargeEntry.id, 'transaction_id': transaction_id};
        } catch (error) {
            console.error(error.message);
            return  {'status': false};
        }
    } 
    
    async getOperatorCode(panel_id, operator_id, operator_type)
    {
      try {
        const operator_details = await this.db.rechargeServiceOperator.getOperatorCode(panel_id, operator_id, operator_type);
    
        if (operator_details && operator_details.code) {
          return operator_details.code;
        } else {
          console.error('Data not returned');
          return 0;
        }
      } catch (error) {
        console.error(error.message);
        return 0; 
      }
    }
    
    async callbackAction(reqParam)
    {
        const {RequestID, ReferenceNo, Amount, ipAddress,status,status_code, t} = reqParam;
        const env = config.env;
        let date = new Date();
        try 
        {
          const orders = await this.db.upi_order.findOne({
            where: { order_id: RequestID, trans_amount: Amount }
          });

          
          if (orders) {
            const userId = orders.user_id;
            const transaction_id = orders.order_id;
            const orderMstrId = orders.id;
            const rechargeData = await this.db.recharge.findOne({
              where: { transaction_id: transaction_id, user_id:userId }
            });
  
            const amount = orders.trans_amount;
            const group_transaction_no = orders.group_transaction_no;
            const createdOnDate = new Date(orders.created_on);
            const orderDate = new Date(createdOnDate.getTime() + 10 * 60 * 1000);
            let currentDate = new Date();
            const rechargeMstrId = rechargeData.id;
            const ConsumerNumber = rechargeData.ConsumerNumber;
            const d_amount = rechargeData.amount;
            const operatorId = rechargeData.operatorId;
            const service_rate = rechargeData.service_rate;
            const service_amount = rechargeData.service_amount;
            const cashback_amount = rechargeData.cashback_amount;
            const cashback_rate = rechargeData.cashback_rate;
            const prime_amount = rechargeData.service_amount;
            const recharge_type = rechargeData.type;
            const panel_id = rechargeData.panel_id;
            const rechargeStatus = rechargeData.recharge_status;
            let type;
            let trans_for;
            let transInitiate = 0;

            if(rechargeStatus != status && (orderDate >= currentDate))
            {

              if((rechargeStatus == 'PROCESS' || rechargeStatus == 'SUCCESS') && status == 'FAILURE')
              {
                type = 'Credit';
                trans_for = 'Refund';
                transInitiate = 1;
              }
              //console.log(rechargeStatus);
              if(rechargeStatus == 'PROCESS' && status == 'SUCCESS')
              {
                console.log('incomming');
                transInitiate = 0;
                await this.db.upi_order.update(
                  {order_status: 'SUCCESS' },
                  { where: { id:orderMstrId } }
                );
  
                await this.db.recharge.update(
                  {recharge_status: status, status: status_code, message:status, description:status,trax_id: ReferenceNo},
                  { where: { id:rechargeMstrId } }
                );
              }
  
              if(transInitiate === 1)
              {
                await this.db.upi_order.update(
                  {order_status: status },
                  { where: { user_id:userId,order_id:transaction_id }, t }
                );
  
                let reTransaction_id = utility.generateUniqueNumeric(7);
                // Order Generate
                const reorderData = {
                    user_id:userId,
                    env:env, 
                    tran_type:type,
                    tran_sub_type:'Recharge',
                    tran_for:trans_for,
                    trans_amount:amount,
                    currency:'INR',
                    order_id:reTransaction_id,
                    order_status:'SUCCESS',
                    created_on:Date.now(),
                    created_by:userId,
                    ip_address:ipAddress,
                    group_transaction_no: group_transaction_no
                };
                
                const generateorder = await this.db.upi_order.insertData(reorderData); 
  
                const reqParam = {userId, 'type': type, 'tran_for':trans_for, amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
                    cashback_amount, cashback_rate, env, prime_amount, 'recharge_type':recharge_type,'transaction_id':reTransaction_id,  t};
  
                const rechargeResponse = await this.rechargeRequest(reqParam);
                if(rechargeResponse)
                {
                    const updateData = { 
                        recharge_status: status,
                        http_code: '',
                        response_code: '',
                        message: status,
                        description: status,
                        status: status_code,
                        trax_id: ReferenceNo,
                        updated_on: date.getTime(),
                        updated_by: userId,
                        panel_id:panel_id,
                        flag:'Retry'
                    }
                    console.log(transaction_id);
                    const whereClause = { id:rechargeMstrId };
                    await this.db.recharge.updateData(updateData, whereClause);
                }
              }
              t.commit();
              return  {'status': true};
            }
  
          } else {
            t.rollback();
            // If the transaction is not found, respond with an error message
            res.status(404).json({ error: 'Transaction not found' });
          }
  
          
        } catch (error) {
            console.error(error.message);
            return  {'status': false};
        }
    } 
    
    async panelTest(req, res)
    {
        //const opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(21220);
        //const response = await rechargeUtility.omega_test();
        let walletbalance = await this.db.wallet.getWalletAmount(74721);

        return res.status(200).json({ status: 202,  message: '', data:walletbalance});
    }
    
    
    async payboomCallback(req, res, queryParam, ipAddress)
    {
      let t = await this.db.sequelize.transaction();
      try {

        // const { recharge_id, user_id } = req;
		    // const requiredKeys = Object.keys({ recharge_id });
            
        // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        //     return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        // }

        const { RequestID, ReferenceNo, Status, Number, Amount, Balance } = queryParam;
        const callbackData = {'RequestID':RequestID, 'ReferenceNo':ReferenceNo, 'Status':Status, 'Number':Number, 'Amount':Amount, 'Balance':Balance};
        
        let status;
        let status_code;
        const panelId=1;
        const panel_name = 'Payboombiz';

        const jsonString = JSON.stringify(callbackData);
        const query = `
          INSERT INTO temp_callback_res (res,panel_id,panel_name) VALUES (:jsonString, :panel_id, :panel_name)
        `;

        // Execute the raw SQL query with parameters
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString ,  panel_id:panelId, panel_name},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
        //console.log(callbackData);
       
        if(Status == 'PROCESS'){status = 'PROCESS'; status_code = 2;}
        if(Status == 'SUCCESS'){status = 'SUCCESS'; status_code = 1;}
        if(Status == 'FAILURE'){status = 'FAILURE'; status_code = 3;}

        const reqParam = {RequestID:RequestID, ReferenceNo:ReferenceNo, Amount:Amount, ipAddress:ipAddress,status:status,status_code:status_code, t};
  
        const callback_action = await this.callbackAction(reqParam);
        return res.status(200).json({ status: 200,  message: callback_action });
      } catch (error) {
        t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
    
    
    async tekdigiCallback(req, res, queryParam, ipAddress)
    {
      let t = await this.db.sequelize.transaction();
      try {

        const { tranid, agentid, status, mobile, amount, liveid,msg } = queryParam;
        const callbackData = {'Tranid':tranid, 'Agentid':agentid, 'Status':status, 'Number':mobile, 'Amount':amount, 'Liveid':liveid, 'Msg': msg};
        
        let cl_status;
        let status_code;
        const panelId=3;
        const panel_name = 'Tekdigi';

        const jsonString = JSON.stringify(callbackData);
        const query = `
          INSERT INTO temp_callback_res (res,panel_id,panel_name) VALUES (:jsonString, :panel_id, :panel_name)
        `;

        // Execute the raw SQL query with parameters
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString ,  panel_id:panelId, panel_name},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
        //console.log(callbackData);
       return 1;
        if(status == 1){cl_status = 'PROCESS'; status_code = 2;}
        if(status == 2){cl_status = 'SUCCESS'; status_code = 1;}
        if(status == 3){cl_status = 'FAILURE'; status_code = 3;}

        const reqParam = {RequestID:agentid, ReferenceNo:tranid, Amount:amount, ipAddress:ipAddress,status:cl_status,status_code:status_code, t};
  
        const callback_action = await this.callbackAction(reqParam);
        return res.status(200).json({ status: 200,  message: callback_action });
      } catch (error) {
        t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
    
    
    async omegaCallback(req, res, queryParam, ipAddress)
    {
      let t = await this.db.sequelize.transaction();
      try {

        const { tranid, agentid, status, mobile, amount, liveid,msg } = queryParam;
        const callbackData = {'Tranid':tranid, 'Agentid':agentid, 'Status':status, 'Number':mobile, 'Amount':amount, 'Liveid':liveid, 'Msg': msg};
        
        let cl_status;
        let status_code;
        const panelId=4;
        const panel_name = 'Omega';

        const jsonString = JSON.stringify(callbackData);
        const query = `
          INSERT INTO temp_callback_res (res,panel_id,panel_name) VALUES (:jsonString, :panel_id, :panel_name)
        `;

        // Execute the raw SQL query with parameters
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString ,  panel_id:panelId, panel_name},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
        //console.log(callbackData);
       
        if(status == 1){cl_status = 'PROCESS'; status_code = 2;}
        if(status == 2){cl_status = 'SUCCESS'; status_code = 1;}
        if(status == 3){cl_status = 'FAILURE'; status_code = 3;}

        const reqParam = {RequestID:agentid, ReferenceNo:tranid, Amount:amount, ipAddress:ipAddress,status:cl_status,status_code:status_code, t};
  
        const callback_action = await this.callbackAction(reqParam);
        return res.status(200).json({ status: 200,  message: callback_action });
      } catch (error) {
        t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
    
    
    
    async ambikaCallback(req, res, queryParam, ipAddress)
    {
      let t = await this.db.sequelize.transaction();
      try {

        const { tranid, agentid, status, mobile, amount, liveid,msg } = queryParam;
        const callbackData = {'Tranid':tranid, 'Agentid':agentid, 'Status':status, 'Number':mobile, 'Amount':amount, 'Liveid':liveid, 'Msg': msg};
        
        let cl_status;
        let status_code;
        const panelId=5;
        const panel_name = 'Ambika';

        const jsonString = JSON.stringify(callbackData);
        const query = `
          INSERT INTO temp_callback_res (res,panel_id,panel_name) VALUES (:jsonString, :panel_id, :panel_name)
        `;

        // Execute the raw SQL query with parameters
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString ,  panel_id:panelId, panel_name},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
        //console.log(callbackData);
       return 1;
        if(status == 1){cl_status = 'PROCESS'; status_code = 2;}
        if(status == 2){cl_status = 'SUCCESS'; status_code = 1;}
        if(status == 3){cl_status = 'FAILURE'; status_code = 3;}

        const reqParam = {RequestID:agentid, ReferenceNo:tranid, Amount:amount, ipAddress:ipAddress,status:cl_status,status_code:status_code, t};
  
        const callback_action = await this.callbackAction(reqParam);
        return res.status(200).json({ status: 200,  message: callback_action });
      } catch (error) {
        t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
    
    
    async kkCallback(req, res, queryParam, ipAddress)
    {
      let t = await this.db.sequelize.transaction();
      try {

        const { refId, txnId, status, number, amount, balance } = queryParam;
        const callbackData = {'RequestID':refId, 'ReferenceNo':txnId, 'Status':status, 'Number':number, 'Amount':amount, 'Balance':balance};
        
        let Status;
        let status_code;
        const panelId=1;
        const panel_name = 'KKpayment';

        const jsonString = JSON.stringify(callbackData);
        const query = `
          INSERT INTO temp_callback_res (res,panel_id,panel_name) VALUES (:jsonString, :panel_id, :panel_name)
        `;

        // Execute the raw SQL query with parameters
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString ,  panel_id:panelId, panel_name},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
        //console.log(callbackData);
       
        if(status == 'Refunded'){Status = 'FAILURE'; status_code = 3;}
        if(status == 'Success'){Status = 'SUCCESS'; status_code = 1;}
        if(status == 'Failure'){Status = 'FAILURE'; status_code = 3;}

        const reqParam = {RequestID:refId, ReferenceNo:txnId, Amount:amount, ipAddress:ipAddress,status:Status,status_code:status_code, t};
  
        const callback_action = await this.callbackAction(reqParam);
        return res.status(200).json({ status: 200,  message: callback_action });
      } catch (error) {
        t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }



    async rechargeHistoryList(req, res) {
    
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id } = decryptedObject;
    
        const requiredKeys = Object.keys({ user_id});
                
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
   
      try {
          
          const userId = user_id;
          
           const getRechargeData = await this.db.userSummary.getrechargeList(
            ['id','first_name','last_name','mobile','recharge_type','ConsumerNumber','recharge_amount','created_on','recharge_status','trax_id',
          'operator_name','operator_image', 'amount', 'operatorId', 'opening_balance', 'credit', 'debit', 'closing_balance', 'circle_id'],
               {user_id:userId, sub_type:'Recharge', recharge_status:'SUCCESS'}
               );


  
          if (getRechargeData) {
              return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success',data:getRechargeData })));
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
    
    
    async rechargeHoldApproved(req, res, ipAddress) {

      const { user_id, transaction_id } = req;

      const requiredKeys = Object.keys({ user_id, transaction_id});
              
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
      let t = await this.db.sequelize.transaction();
      try {
          let date = new Date();
          let crdate = utility.formatDate(date);
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          firstDay = utility.formatDate(firstDay);
          lastDay = utility.formatDate(lastDay);
          let walletbalance = await this.db.wallet.getWalletAmount(user_id);

          

          const getRecharge = await this.db.recharge.findOne({
            where: {
              transaction_id, user_id,
              status: 4
            }
          });

          

          if(getRecharge)
          {

            let getAllPanel = await this.db.panel.getAllData();
            let flag = '';
            let group_transaction_no = utility.generateUniqueNumeric(7);

            const userId = getRecharge.user_id;
            const amount = getRecharge.main_amount;
            const d_amount = getRecharge.amount;
            const service_rate = getRecharge.service_rate;
            const service_amount = getRecharge.service_amount;
            const cashback_amount = getRecharge.cashback_amount;
            const cashback_rate = getRecharge.cashback_rate;
            const env = getRecharge.env;
            const hold_transaction_id = getRecharge.transaction_id;
            const ConsumerNumber = getRecharge.ConsumerNumber;
            const mobile = getRecharge.ConsumerNumber;
            const operatorId = getRecharge.operatorId;
            const type = getRecharge.type;
            const rechargeId = getRecharge.id;
            let wallet = '';
            let transactionid = 0;

            if(walletbalance!=null && walletbalance > 0 && walletbalance>=amount)
            {
              const whereChk={id:userId};
              const UserAttribute=['first_name','last_name','mobile'];
              const userRow = await this.db.user.getData(UserAttribute,whereChk);

              if(getRecharge.cashback_amount > 0)
              {
                wallet = 'Cashback';
              }
              if(getRecharge.service_amount > 0)
              {
                wallet = 'Prime';
              }
              
              for (const panel of getAllPanel) 
              {

                const order_id=utility.generateUniqueNumeric(7);
                transactionid = order_id;
                // Order Generate
                const orderData = {
                    user_id:userId,
                    env:env, 
                    tran_type:'Debit',
                    tran_sub_type:'Recharge',
                    tran_for:'Recharge',
                    trans_amount:amount,
                    currency:'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on:Date.now(),
                    created_by:userId,
                    ip_address:ipAddress,
                    group_transaction_no: group_transaction_no
                };
                
                const generateorder = await this.db.upi_order.insertData(orderData); 

                try 
                {

                        
                    const reqParam = {userId, 'type': 'Debit', 'tran_for':'Recharge', amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
              cashback_amount, cashback_rate, env, 'prime_amount':service_amount, 'recharge_type':type,transaction_id:transactionid, 'approve_status': 'Approved',  t};

                    const orderData = await this.rechargeRequest(reqParam);

                    
                    //console.log(orderData);
                    
                    if(orderData.status == true && orderData.recharge_status=='success')
                    {
                      
                        let requestId = transactionid;
                        const { excutable_fun, service_url, id } = panel;

                        if (typeof rechargeUtility[excutable_fun] === 'function') {
                            const selectedFunction = rechargeUtility[excutable_fun];
                            const panelId = id;
                            const operator_code = await this.getOperatorCode(panelId, operatorId, type);
                            const { result: response, panel_id } = await selectedFunction(service_url, requestId, transactionid, operator_code, mobile, ConsumerNumber, amount, panelId);
                            
                            const updateData = { 
                                recharge_status: response.status,
                                message: response.message,
                                description: response.message,
                                status: 1,
                                trax_id: response.transactionID,
                                updated_on: date.getTime(),
                                updated_by: userId,
                                panel_id:panel_id,
                                flag: flag
                              }
                              
                            const whereClause = { id:rechargeId };
                            const updateRecharge = await this.db.recharge.updateData(updateData, whereClause, { transaction: t });

                            const holdupdateData = {
                              recharge_status: 'APPROVED',
                                message: 'APPROVED',
                                description: 'APPROVED',
                                status: 1,
                                trax_id: response.transactionID,
                                updated_on: date.getTime(),
                                updated_by: userId,
                                panel_id:panel_id
                            }
                            const holdwhereClause = { transaction_id:hold_transaction_id };
                            await this.db.recharge.updateData(holdupdateData, holdwhereClause, { transaction: t });

                            const recgData = await this.db.rechargeReport.findByPk(rechargeId);
                            flag = 'Retry';
                                await this.db.upi_order.update(
                                    {order_status:'SUCCESS' },
                                    { where: { user_id:userId,order_id:transactionid,order_status:'PENDING' }, t }
                                );
                            if(updateRecharge){
                                let redeem_amount = 0;
                                if(wallet == 'Cashback' && cashback_amount > 0)
                                {
                                  redeem_amount = cashback_amount;
                                  await this.rePurchaseIncome(env, userId, amount, cashback_amount, ipAddress, transactionid, type, t );
                                }

                                if(wallet == 'Prime' && service_amount > 0)
                                {
                                  redeem_amount = service_amount;
                                }
                                
                                //await this.createSpinner(userId, wallet, redeem_amount, amount, t);

                                if(await this.db.mobileOperator.getCount(ConsumerNumber, operatorId) == 0)
                                {
                                  const mOperatorEntry = { 
                                    operator_id: operatorId, 
                                    operator_name: '',  
                                    circle: '',
                                    mobile_no:ConsumerNumber,
                                    created_by: userId
                                  };
                                  await this.db.mobileOperator.insertData(mOperatorEntry, { transaction: t });
                                }


                                
                                t.commit();
                                return res.status(200).json({ status: 200,  message: 'Recharge successfully done' ,data:recgData});
                            }    
                            
                        } else {
                            console.error(`Function '${excutable_fun}' does not exist.`);
                            return Promise.resolve({ error: `Function '${excutable_fun}' does not exist.` });
                        }
                    }

                } catch ({ result: response, panel_id }) {
                    let reTransaction_id = utility.generateUniqueNumeric(7);
                    // Order Generate
                    const reorderData = {
                        user_id:userId,
                        env:env, 
                        tran_type:'Credit',
                        tran_sub_type:'Recharge',
                        tran_for:'Refund',
                        trans_amount:amount,
                        currency:'INR',
                        order_id:reTransaction_id,
                        order_status:'SUCCESS',
                        created_on:Date.now(),
                        created_by:userId,
                        ip_address:ipAddress,
                        group_transaction_no: group_transaction_no
                    };
                    
                    const generateorder = await this.db.upi_order.insertData(reorderData); 

                    const reqParam = {userId, 'type': 'Credit', 'tran_for':'Refund', amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
                        'cashback_amount':cashback_amount, cashback_rate, env, 'prime_amount':service_amount, 'recharge_type':type,'transaction_id':reTransaction_id,  t};

                    const rechargeResponse = await this.rechargeRequest(reqParam);
                    //console.log(rechargeResponse);
                    if(rechargeResponse)
                    {
                        const updateData = { 
                            recharge_status: response.status,
                            message: response.message,
                            description: response.message,
                            status: 3,
                            trax_id: response.transactionID,
                            updated_on: date.getTime(),
                            updated_by: userId,
                            panel_id:panel_id,
                            flag:flag
                        }


                        const holdupdateData = {
                          recharge_status: response.status,
                            message: response.message,
                            description: response.message,
                            status: 3,
                            trax_id: response.transactionID,
                            updated_on: date.getTime(),
                            updated_by: userId,
                            panel_id:panel_id
                        }
                        const holdwhereClause = { transaction_id:hold_transaction_id };
                        await this.db.recharge.updateData(holdupdateData, holdwhereClause, { transaction: t });
        
                        const whereClause = { transaction_id:transactionid };
                        await this.db.recharge.updateData(updateData, whereClause);
                        flag = 'Retry';

                        
                        await this.db.upi_order.update(
                          {order_status: 'SUCCESS' },
                          { where: { user_id:userId,order_id:transactionid }, t }
                        );
                        
                                
                    }

                }

              }
              return res.status(201).json({ status: 500, error: 'Sorry ! Failed to recharge' });
            }else{
              return res.status(201).json({ status: 500, error: 'User do not have sufficient wallet balance' });
            }
          }else{
             return res.status(201).json({ status: 500, message: 'No pending for approval', data: [] });
          }
          
  
          
      } catch (error) {
         
          logger.error(`Unable to find record: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
    }
    

    async rechargeReject(req, res) {

      const { user_id, transaction_id, reject_reason, admin_user_id } = req;

      const requiredKeys = Object.keys({ user_id, transaction_id, reject_reason, admin_user_id });
              
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
      let t = await this.db.sequelize.transaction();

      try {
        let date = new Date();
        const getRecharge = await this.db.recharge.findOne({
          where: {
            transaction_id, user_id,
            status: 4
          }
        });

        if(getRecharge)
        {
          const updateData = { 
            recharge_status: 'REJECT',
            description: reject_reason,
            status: 5,
            updated_on: date.getTime(),
            updated_by: admin_user_id
          }


          const whereClause = { id:getRecharge.id };
          const rejectData = await this.db.recharge.updateData(updateData, whereClause);

          if(rejectData)
          {
            return res.status(200).json({ status: 200,  message: 'Recharge rejected'});
          }

        }else{
          return res.status(201).json({ status: 500, message: 'Data not found', data: [] });
        }


      }catch (error) {
         
        logger.error(`Unable to find record: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
      
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
    }
    
   
}

module.exports = new Recharge();