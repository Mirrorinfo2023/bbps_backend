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


class Recharge {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    


    async recharge(req,res,ipAddress) {  
      
		  let results = {};
            const decryptedObject = utility.DataDecrypt(req.encReq);
      
		  const {mobile,amount,type, operatorId, ConsumerNumber, user_id, cwallet, is_assured} = decryptedObject;
      //const allowedWalletValues = ['Cashback', 'Prime', 'Affiliate'];
	
		  const requiredKeys = Object.keys({ mobile, amount,type, operatorId, ConsumerNumber, user_id});
            
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
         return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      // if (!allowedWalletValues.includes(cwallet)) {
      //   return res.status(400).json({ status: 400, message: 'Invalid value for the wallet field', allowedValues: allowedWalletValues });
      // }
      
      let t = await this.db.sequelize.transaction();
            
      try {
        let userId = user_id;
        const checkplan  = await this.db.PlanPurchase.getAllPlanUser(userId);
        let maxPlan = null;
        if(checkplan.length > 0)
        {
          maxPlan = Math.max(...checkplan);
        }
        
        //console.log(maxPlan);
        let user_type = (maxPlan !=null) ? 'Prime' : '';
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
        
         const whereChk={id:userId};
          const UserAttribute=['first_name','last_name','mobile'];
          const userRow = await this.db.user.getData(UserAttribute,whereChk);
        
        if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
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
          
          let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(userId, crdate);
          let totalRechargeOfaMonth = await this.db.recharge.getRechargeForMonth(userId, firstDay, lastDay);
          
          if(totalRechargeOfaMonth == 0 && wallet == 'Prime' && user_type != 'Prime' && check_assured == '0'){
            prime_rate = '5.00';
            prime_amount = amount*prime_rate/100; 

            if(prime_wallet_balance>=prime_amount)
            {
              //d_amount = d_amount-prime_amount;
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
                  //d_amount = d_amount-cashback_amount;
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
                    //d_amount = d_amount-prime_amount;
                    service_rate = prime_rate;
                    service_amount = prime_amount;
                  }
                  
                }

                if(affiliate_wallet_balance>0){
                  prime_rate = plan_details.prime_rate;
                  affiliate_amount = amount*prime_rate/100;

                  if(affiliate_wallet_balance>=affiliate_amount)
                  {
                    //d_amount = d_amount-affiliate_amount;
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

          if(totalDayRecharge <= 5 && rechargePermission==0)
          {
            let getAllPanel = await this.db.panel.getAllData();
            let flag = '';
            let group_transaction_no = utility.generateUniqueNumeric(7);
            for (const panel of getAllPanel) {
                const order_id=utility.generateUniqueNumeric(7);
                transaction_id = order_id;
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
                
                try {
                    
                    const reqParam = {userId, 'type': 'Debit', 'tran_for':'Recharge', amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
            cashback_amount, cashback_rate, env, 'prime_amount':0, 'recharge_type':type,transaction_id,  t};

                    const orderData = await this.rechargeRequest(reqParam);

                    //return orderData;
                    //console.log(orderData.status);
                    
                    if(orderData.status == true && orderData.recharge_status=='success')
                    {
                      
                        let requestId = transaction_id;
                        const { excutable_fun, service_url, id } = panel;

                        if (typeof rechargeUtility[excutable_fun] === 'function') {
                            const selectedFunction = rechargeUtility[excutable_fun];
                            const panelId = id;
                            const operator_code = await this.getOperatorCode(panelId, operatorId, type);
                            const { result: response, panel_id } = await selectedFunction(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panelId);
                           
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
                                flag: flag
                              }
                               
                            const whereClause = { id:orderData.rechargeId };
                            const updateRecharge = await this.db.recharge.updateData(updateData, whereClause, { transaction: t });
                            const recgData = await this.db.rechargeReport.findByPk(orderData.rechargeId);
                            flag = 'Retry';
                                await this.db.upi_order.update(
                                    {order_status:'SUCCESS' },
                                    { where: { user_id:userId,order_id:transaction_id,order_status:'PENDING' }, t }
                                );
                            if(updateRecharge){
                                let redeem_amount = 0;
                                if(wallet == 'Cashback' && cashback_amount > 0)
                                {
                                  redeem_amount = cashback_amount;
                                  await this.rePurchaseIncome(env, userId, amount, cashback_amount, ipAddress, transaction_id, type, t );
                                }
                                // const whatsappRecharge =  whatsappUtility.rechargeSuccessMessage(userRow.first_name,userRow.last_name ,userRow.mobile, cashback_amount ,amount,ConsumerNumber,transaction_id);
                                //  this.db.whatsapp_notification.insertData(whatsappRecharge);
                                if(wallet == 'Prime' && service_amount > 0)
                                {
                                  redeem_amount = service_amount;
                                }
                                
                                await this.createSpinner(userId, wallet, redeem_amount, amount, t);
                                
                                

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
                     return res.status(202).json({ status: 202,  message: 'Your recharge has been temporarily Hold for security reasons. Please contact the support team-9112421742.', data:recgData});
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
                        'cashback_amount':0, cashback_rate, env, 'prime_amount':0, 'recharge_type':type,'transaction_id':reTransaction_id,  t};

                    const rechargeResponse = await this.rechargeRequest(reqParam);
                    //console.log(rechargeResponse);
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
                            flag:flag
                        }

        
                        const whereClause = { transaction_id:transaction_id };
                        await this.db.recharge.updateData(updateData, whereClause);
                        flag = 'Retry';
                        
                        await this.db.upi_order.update(
                          {order_status: 'SUCCESS' },
                          { where: { user_id:userId,order_id:transaction_id }, t }
                        );
                        
                        
                        //const whatsappRecharge =  whatsappUtility.rechargeFailedMessage(userRow.first_name,userRow.last_name ,userRow.mobile, amount,ConsumerNumber);
                         //this.db.whatsapp_notification.insertData(whatsappRecharge);
                                
                    }

                }
            }
            
            

            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Sorry ! Failed to recharge' })));

          }else{
            await t.rollback();
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Sorry ! You have cross the limit of today recharge' })));
          }
        }else{
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'You do not have sufficient wallet balance' })));
        }
    
      }catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
		  return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }
    
    
    async rechargeRequest(reqParam)
    {
        const {userId, type, tran_for, amount, ipAddress,ConsumerNumber, operatorId, d_amount, service_rate, service_amount, 
            cashback_amount, cashback_rate, env, prime_amount,recharge_type,transaction_id, t} = reqParam;

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

                if(parseFloat(amount) >= parseFloat(setting.recharge_cutoff_limit))
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
                    //return  {'status': 'hold'};
                    
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

            if(walletEntry && cashback_amount > 0)
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

            if(walletEntry && prime_amount>0)
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
            let credit_amount = (0.25*cashback_amount/15).toFixed(2);
            let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
            
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

    async createSpinner(user_id, spinner_type, redeem_amount, main_amount, t)
    {
      try {
          const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
          const spinner_id = spinner_type.toUpperCase() +currentTimestampInSeconds;
         
          const generate_date = utility.formatDateTime(new Date());
          const expire_date = utility.formatDateTime(new Date(new Date(generate_date).getTime() + 60 * 60 * 24 * 1000));
          
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          let remaining_days = 1;
          let applied_for = 'Cashback for ' + spinner_type + ' wallet';
          
          let order_id = 'SPI-'+ currentTimestampInSeconds;
          
          const inputData = {
            user_id,
            spinner_id,
            spinner_type:'Recharge',
            generate_date,
            expire_date,
            remaining_days,
            random_number:randomNumber,
            applied_for,
            order_id,
            redeem_amount,
            status: 1,
            is_used: 0,
            main_amount
          }

          
          return await this.db.spinner.insert(inputData, { transaction: t });
      } catch (error) {
        console.error(error.message);
        return 0; 
      }
    }


    
}

module.exports = new Recharge();