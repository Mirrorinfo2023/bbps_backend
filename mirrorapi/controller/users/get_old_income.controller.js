const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class OldIncome {
  db = {};

  constructor() {
    this.db = connect();
  }

   async getIncome(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, mrid} = decryptedObject;

    const requiredKeys = Object.keys({ user_id, mrid });
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {
        const whereChk={id:user_id};
        const UserAttribute=['mlm_id','old_id','is_old_fetched'];
        const userRow = await this.db.user.getData(UserAttribute,whereChk);

        const apiUrl = 'https://mirror.org.in/api/get-user-income';
        const postData = {
            user_id: mrid
        };

        if((UserAttribute.old_id == null || UserAttribute.old_id<=0)  && UserAttribute.is_old_fetched == 0)
        {
            return res.status(200).json({ status: 200, message: 'You are not authorized for previous data', data: true });
        }

        if(UserAttribute.old_id > 0 && UserAttribute.is_old_fetched == 1)
        {
            return res.status(200).json({ status: 200, message: 'You already found backup', data: true });
        }

        let responseData;
        
        await axios.post(apiUrl, postData)
        .then(response => {
            responseData = response.data;
        })
        .catch(error => {
            console.error('Error making API request:', error.message);

        });

        if(responseData != null)
        {
            const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
            let openingbalance = 0;

            if (userIncomeBalance) {
                openingbalance = userIncomeBalance;
            }

            const order_id = utility.generateUniqueNumeric(7);
            const transaction_id = order_id;
            const credit = responseData.response.close_bal;

            const orderData = {
                user_id: user_id,
                env: config.env,
                tran_type: 'Credit',
                tran_sub_type: 'System Credit',
                tran_for: 'Income',
                trans_amount: credit,
                currency: 'INR',
                order_id,
                order_status: 'SUCCESS',
                created_on: Date.now(),
                created_by: user_id,
                ip_address: 0,
            };

            const transactionData = {
                transaction_id,
                user_id: user_id,
                sender_id: 1,
                env: config.env,
                type: 'Credit',
                opening_balance: openingbalance,
                details: `Opening balance system credit`,
                sub_type: 'System Credit',
                tran_for: 'Income',
                credit: credit,
                debit: 0,
                closing_balance: parseFloat(openingbalance) + parseFloat(credit),
                plan_id: 0,
                level: 1,
            };

            const generateorder = await this.db.upi_order.insertData(orderData);
            const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
            
            const data =  {     
                is_old_fetched:1
            };
            const updatedUserStatus = await this.db.user.updateData(data,user_id);
            
            //return res.status(200).json({ status: 200, message: 'Data Found', data: true });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: true })));
        }
        else{
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Not Found', data: true })));
            //return res.status(200).json({ status: 200, message: 'Data Not Found', data: true });
        }
        

    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal server error' })));
          //return res.status(500).json({ status: 500,errors: validationErrors });
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: 'Internal server error' ,data:[]})));	
        //return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }
  
  
  async checkIncome(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id} = decryptedObject;

    const requiredKeys = Object.keys({ user_id });
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {

        const whereChk={id:user_id};
        const UserAttribute=['mlm_id','old_id','is_old_fetched'];
        const userRow = await this.db.user.getData(UserAttribute,whereChk);
        
        if(userRow && ( userRow.old_id == null || userRow.old_id <= 0)){
            //return res.status(200).json({ status: 200, message: 'User is newest', data: true });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User is newest', data: true })));
        }

        if(userRow && userRow.old_id > 0 && userRow.is_old_fetched==1){
            //return res.status(200).json({ status: 200, message: 'User data found', data: true });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User data found', data: true })));
        }

        if(userRow && userRow.old_id > 0 && userRow.is_old_fetched==0){
            //return res.status(500).json({ status: 500, message: 'User data not found', data: false });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User data not found', data: false })));
        }

    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal server error' })));
          //return res.status(500).json({ status: 500,errors: validationErrors });
        }
		return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: 'Internal server error' ,data:[]})));	
        //return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }



    
  async creditDebitIncomeToUserOld(req, res) {
    const {user_id,totalEarning,totalwithdrawal} = req;

    
    const requiredKeys = Object.keys({ user_id,totalEarning,totalwithdrawal});
          
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {
        
        const incomeArr=['Credit','Debit'];
        let flag=0;
        for (const item of incomeArr) {
                    const type=item;
                    let amount =0 ;
                    let credit=0  ;
                    let debit =0 ;
                    let closing_balance=0;

                    const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
                    let openingbalance = 0;

                    if (userIncomeBalance) {
                        openingbalance = userIncomeBalance;
                    }

                    const order_id = utility.generateUniqueNumeric(7);
                    const transaction_id = order_id;
                   

                    if(type=='Credit'){
                         amount = totalEarning;
                         credit= amount,
                         debit=0,
                        closing_balance= parseFloat(openingbalance) + parseFloat(totalEarning);
                    }else{
                        amount = totalwithdrawal;
                        credit=0,
                        debit= amount,
                        closing_balance= parseFloat(openingbalance) - parseFloat(totalwithdrawal);
                    }


                    const orderData = {
                        user_id: user_id,
                        env: config.env,
                        tran_type: type,
                        tran_sub_type: `System ${type}`,
                        tran_for: 'Income',
                        trans_amount: amount,
                        currency: 'INR',
                        order_id,
                        order_status: 'SUCCESS',
                        created_on: Date.now(),
                        created_by: user_id,
                        ip_address: 0,
                    };

                    const transactionData = {
                        transaction_id,
                        user_id: user_id,
                        sender_id: 1,
                        env: config.env,
                        type:type,
                        opening_balance: openingbalance,
                        details: `Opening balance system ${type}`,
                        sub_type: 'System Credit',
                        tran_for: 'Income',
                        credit: credit,
                        debit:debit,
                        closing_balance: closing_balance,
                        plan_id: 0,
                        level: 1,
                    };

                    const generateorder = await this.db.upi_order.insertData(orderData);
                    const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
                    flag=1;
                   
                }
                           
                if (flag==1 ) {
                    return res.status(200).json({ status: 200, message: 'User Status Updated Successful.'});
                } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                }
    
                
            } catch (error) {
                logger.error(`Unable to find Income: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
          }
      
      
      

          
            async creditDebitIncomeToUser(req, res) {


                const {user_id,
                    totalEarning,
                    totalwithdrawal,
                    silverRoyalty,
                    goldRoyalty,
                    platinumRoyalty,
                    daimondRoyalty,
                    selfIncome,
                    repurchaseIncome,
                    upgradeIncome,
                    levelIncome
            } = req;


            const requiredKeys = Object.keys({
                    user_id,
                    // totalEarning,
                    // totalwithdrawal,
                    // silverRoyalty,
                    // goldRoyalty,
                    // platinumRoyalty,
                    // daimondRoyalty,
                    // selfIncome,
                    // repurchaseIncome,
                    // upgradeIncome,
                    // levelIncome
                  
            });
            
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }

            let t;

            try {
                 
                    let flag=0;

                    if(flag==0){

                 
                        if(totalEarning>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',totalEarning, 'Credit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, totalEarning, 'Credit','Income','Income');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(totalwithdrawal>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',totalwithdrawal, 'Debit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, totalwithdrawal, 'Debit','Redeem','Redeem');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(silverRoyalty>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',silverRoyalty, 'Credit');
                            if(logResult && logResult.id){
                                await this.saveRoyalityIncome(user_id, 'Silver',silverRoyalty,1);
                                const amountData = await this.getUpdatedBalance(user_id, silverRoyalty, 'Credit','Silver Royalty','Royality');
                                 if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                 }
                            }
                        }

                        if(goldRoyalty>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',goldRoyalty, 'Credit');
                            if(logResult && logResult.id){
                                await this.saveRoyalityIncome(user_id, 'Gold',goldRoyalty,2);
                                const amountData = await this.getUpdatedBalance(user_id, goldRoyalty, 'Credit','Gold Royalty','Royality');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(platinumRoyalty>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',platinumRoyalty, 'Credit');
                            if(logResult && logResult.id){
                                await this.saveRoyalityIncome(user_id, 'Platinum',platinumRoyalty,3);
                                const amountData = await this.getUpdatedBalance(user_id, platinumRoyalty, 'Credit','Platinum Royalty','Royality');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(daimondRoyalty>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',daimondRoyalty, 'Credit');
                            if(logResult && logResult.id){
                                await this.saveRoyalityIncome(user_id, 'Daimond',daimondRoyalty,4);
                                const amountData = await this.getUpdatedBalance(user_id, daimondRoyalty, 'Credit','Daimond Royalty','Royality');
                                const TransactionResult = await this.saveTransactionIncomeData(amountData);
                            }
                        }

                        if(selfIncome>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',selfIncome, 'Credit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, selfIncome, 'Credit','Self Income','Self Income' );
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(repurchaseIncome>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',repurchaseIncome, 'Credit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, repurchaseIncome, 'Credit','Repurchase Income','Repurchase');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(upgradeIncome>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',upgradeIncome, 'Credit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, upgradeIncome, 'Credit','Upgrade','Upgrade');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        if(levelIncome>0){
                            const logResult = await this.logCreditDebitEntry(user_id,'income',levelIncome, 'Credit');
                            if(logResult && logResult.id){
                                const amountData = await this.getUpdatedBalance(user_id, levelIncome, 'Credit','Level Income','Level Income');
                                if(amountData!=null){
                                    const TransactionResult = await this.saveTransactionIncomeData(amountData);
                                }
                            }
                        }

                        flag=1;
                    
                        
                    }
                    if (flag==1) {
                        return res.status(200).json({ status: 200, message: 'User Status Updated Successful.'});
                    } else {
                        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                    }

                    
                } catch (error) {
                    logger.error(`Unable to find Income: ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: validationErrors });
                    }
                
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
            }

            async logCreditDebitEntry(user_id,walletType,amount,action){

                const logData = {
                    user_id: user_id,
                    wallet_type: walletType,
                    amount: amount,
                    transaction_type: action,
                    details:`System ${action}`,
                    status:1,
                    created_by:user_id,
                  };
                
                  const logEntry = await this.db.logSystemCreditDebit.insertData(logData);

                  return logEntry;
                  
            }

            async saveRoyalityIncome(userId,royalityType,amount,royalityLevel){

               let newRoyalityIncome=0;
               let generateorder=[];
               let level=royalityLevel;
               let rank=royalityType;
              
               const totalIncome = await this.db.ReferralIncome.getIncomeBalance(userId);

               const whereRoyality={user_id:userId, level:royalityLevel};
               const UserAttr=['user_id','level','royality_name','total_income'];
               const getRoyaltyData = await this.db.RoyalityIncome.getData(UserAttr,whereRoyality);
               

               if(getRoyaltyData){
                    level = getRoyaltyData.level;
                    newRoyalityIncome = parseFloat(getRoyaltyData.total_income)  + parseFloat(amount); 
                }else{
                   
                    newRoyalityIncome = parseFloat(totalIncome)  + parseFloat(amount); 
                }

               
                const Result = await this.db.RankRoyality.getLevelRoyality(newRoyalityIncome);
                
                if(Result!==null){
                    level=Result.level;
                    rank=Result.rank;
                }


                if(getRoyaltyData){

                    const orderData = {
                      
                        royality_name: rank,
                        total_income:newRoyalityIncome,
                    };
                     generateorder = await this.db.RoyalityIncome.updateData(orderData,userId,getRoyaltyData.level);
                   
                }else{
                    const orderData = {
                        user_id: userId,
                        level: level,
                        royality_name: rank,
                        total_income:amount,
                    };
                
                    generateorder = await this.db.RoyalityIncome.insertData(orderData);
                            
                }
               
                return generateorder;

            }


            async saveFundIncome(userId,fundType,amount){

                const orderData = {
                    user_id: userId,
                    fund_type: fundType,
                    total_income:amount,
                };

                const generateorder = await this.db.fundIncome.insertData(orderData);

            }

            async getUpdatedBalance(user_id, amount, type,trans_type,transFor){

                let closing_balance=0;
                let credit=0;
                let debit=0;
                let openingbalance = 0;

                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
               
                if (userIncomeBalance) {
                    openingbalance = userIncomeBalance;
                }

                if(type=='Credit'){
                    credit= amount,
                    debit=0,
                    closing_balance= parseFloat(openingbalance) + parseFloat(amount);
                }else{
                    credit=0,
                    debit= amount,
                    closing_balance= parseFloat(openingbalance) - parseFloat(amount);
                }
                
                let result = {} ;
                if(closing_balance>=0){
                    
                    result={
                        user_id,
                        openingbalance,
                        credit,
                        debit,
                        closing_balance,
                        type,
                        amount,
                        details:`System ${type} for ${trans_type}`,
                        trans_type,
                        transFor,
                    }
                    
                }else{
                    console.error('Closing balance is negative');
                }
                return result;

            }

            async saveTransactionIncomeData(transData){

               
                const order_id = utility.generateUniqueNumeric(7);
                const transaction_id = order_id;
                
                const orderData = {
                    user_id: transData.user_id,
                    env: config.env,
                    tran_type: transData.type,
                    tran_sub_type: `System ${transData.type}`,
                    tran_for: 'Income',
                    trans_amount: transData.amount,
                    currency: 'INR',
                    order_id,
                    order_status: 'SUCCESS',
                    created_on: Date.now(),
                    created_by: transData.user_id,
                    ip_address: 0,
                };
               
                const transactionData = {
                    transaction_id:transaction_id,
                    user_id: transData.user_id,
                    sender_id: 1,
                    env: config.env,
                    type:transData.type,
                    opening_balance: transData.openingbalance,
                    details:transData.details,
                    sub_type: `System ${transData.type}`,
                    tran_for: transData.transFor,
                    credit: transData.credit,
                    debit:transData.debit,
                    closing_balance:transData.closing_balance,
                    plan_id: 1,
                    level: 1,
                };

               
                const generateorder = await this.db.upi_order.insertData(orderData);
                const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
            }

            
      

  
}

module.exports = new OldIncome();