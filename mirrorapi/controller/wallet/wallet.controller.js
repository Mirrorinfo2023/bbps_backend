const { connect,config ,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const crypto = require('crypto');
const { AES, enc, mode, lib } = require('crypto-js');

class Wallet {
  db = {};

  constructor() {
    this.db = connect();
  }


     async getWalletBalance(req,res) {
         const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id} =decryptedObject;
        
	    const requiredKeys = Object.keys({ user_id });
            
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }


        try {
                const [walletBalance, cashbackBalance, primeBalance, affiliateBalance, voucher, epinWalletBalance, total_earning, today_income ] = await Promise.all([
                                                              this.db.wallet.getWalletAmount(user_id),
                                                              this.db.cashback.getCashbackAmount(user_id),
                                                              this.db.prime.getPrimeAmount(user_id),
                                                              this.db.ReferralIncome.getIncomeBalance(user_id),
                                                              this.db.coupon.getCouponCount(user_id),
                                                              this.db.epinWallet.getWalletAmount(user_id),
                                                              this.db.ReferralIncome.getTotalIncome(user_id),
                                                              this.db.ReferralIncome.getTodayIncome(user_id)
                                                            ]);
                                                            
                // const Total_income = await this.db.ReferralIncome.getTotalIncome(user_id);
                // const getRank = await this.db.RankRoyality.getLevelRoyality(Total_income);
                
                const getRank = await this.db.sequelize.query(`
                    SELECT m.category, m.level
                  FROM trans_royality_income r
                  JOIN mst_rank_royality_category m ON r.level = m.level AND r.total_income = m.target_amt 
                  JOIN tbl_app_users u ON r.user_id = u.id 
                  WHERE u.id=${user_id}
                  ORDER BY m.target_amt  DESC
                  LIMIT 1
                `, {
                  raw: false,
                  type: this.db.sequelize.QueryTypes.SELECT,
                });
                
                let rank = 'Distributor';
                if(getRank.length>0)
                {
                    rank = getRank[0].category;
                }
                
                const affiliateIncome = await this.db.ReferralIncome.findOne({
                    attributes: [
                      [Sequelize.fn('SUM', Sequelize.col('credit')), 'amount']
                    ],
                    where: {
                      status: '1',
                      user_id: user_id,
                      tran_for: 'Repurchase',
                      sub_type: 'Invoice Income'
                    }
                  });
                const affiliate_Income = (affiliateIncome)?affiliateIncome.dataValues.amount:0;
                const userRow=await this.db.user.getData(['id', 'is_portfolio'], {'id': user_id});
                
               return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', walletBalance: walletBalance,cashbackBalance:cashbackBalance, primeBalance:primeBalance, affiliateBalance:affiliateBalance, voucher:voucher, rank:rank, affiliateIncome:affiliate_Income, epinWalletBalance:epinWalletBalance,is_portfolio:userRow.is_portfolio, total_earning:total_earning, today_income:today_income })));


	
            }catch (err) {
                    logger.error(`Unable to find : ${err}`);
        			if (err.name === 'SequelizeValidationError') {
        			  const validationErrors = err.errors.map((err) => err.message);
        			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        			}
        			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
                }

    }
    
    
    async getWalletBalanceTest(req,res) {
         //const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id} = req;
        
	    const requiredKeys = Object.keys({ user_id });
            
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }

        try {
                const [walletBalance, cashbackBalance, primeBalance, affiliateBalance, voucher ] = await Promise.all([
                                                              this.db.wallet.getWalletAmount(user_id),
                                                              this.db.cashback.getCashbackAmount(user_id),
                                                              this.db.prime.getPrimeAmount(user_id),
                                                              this.db.affiliate.getAffiliateAmount(user_id),
                                                              this.db.coupon.getCouponCount(user_id)
                                                            ]);
                                                            
                // const Total_income = await this.db.ReferralIncome.getTotalIncome(user_id);
                // const getRank = await this.db.RankRoyality.getLevelRoyality(Total_income);
                
                const getRank = await this.db.sequelize.query(`
                    SELECT m.rank, m.level
                  FROM trans_royality_income r
                  JOIN mst_rank_royality m ON r.level = m.level AND r.total_income >= m.target 
                  JOIN tbl_app_users u ON r.user_id = u.id 
                  WHERE u.id=${user_id}
                  ORDER BY m.level DESC
                  LIMIT 1
                `, {
                  raw: false,
                  type: this.db.sequelize.QueryTypes.SELECT,
                });
                //return getRank;
                let rank = 'Distributor';
                if(getRank.length>0)
                {
                    rank = getRank[0].rank;
                }
                
                
                
                
               return res.status(200).json({ status: 200, message: 'Success', walletBalance: walletBalance,cashbackBalance:cashbackBalance, primeBalance:primeBalance, affiliateBalance:affiliateBalance, voucher:voucher, rank:rank });
	
            }catch (err) {
                    logger.error(`Unable to find : ${err}`);
        			if (err.name === 'SequelizeValidationError') {
        			  const validationErrors = err.errors.map((err) => err.message);
        			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        			}
        			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
                }

    }
    
    async getUpiId(req,res) {
       

        try {
            
            const substitutionMap = {
  A: 'Z', B: 'Y', C: 'X', D: 'W', E: 'V',
  F: 'U', G: 'T', H: 'S', I: 'R', J: 'Q',
  K: 'P', L: 'O', M: 'N', N: 'M', O: 'L',
  P: 'K', Q: 'J', R: 'I', S: 'H', T: 'G',
  U: 'F', V: 'E', W: 'D', X: 'C', Y: 'B',
  Z: 'A',
  a: 'z', b: 'y', c: 'x', d: 'w', e: 'v',
  f: 'u', g: 't', h: 's', i: 'r', j: 'q',
  k: 'p', l: 'o', m: 'n', n: 'm', o: 'l',
  p: 'k', q: 'j', r: 'i', s: 'h', t: 'g',
  u: 'f', v: 'e', w: 'd', x: 'c', y: 'b',
  z: 'a',
  '1': '9', '2': '8', '3': '7', '4': '6', '5': '5',
  '6': '4', '7': '3', '8': '2', '9': '1', '0': '0'
};
              
const message = 'Hello 123';
const encryptData = message.split('').map(char => substitutionMap[char] || char).join('');
const encryptDatas = Buffer.from(encryptData).toString('base64');

const reverseMap = {};
Object.entries(substitutionMap).forEach(([key, value]) => {
  reverseMap[value] = key;
});

const decryptedData = encryptData.split('').map(char => reverseMap[char] || char).join('');
const decryptedMessage = Buffer.from(decryptedData, 'base64').toString('utf-8');

console.log('Original Message:', message);
console.log('Encrypted Data:', encryptDatas);
console.log('Decrypted Message:', decryptedMessage);


              return res.status(200).json({ status: 200, message: 'Success', encryptdatas:encryptDatas ,decrypt:decryptedMessage});
               
	
            }catch (err) {
                    logger.error(`Unable to find : ${err}`);
        			if (err.name === 'SequelizeValidationError') {
        			  const validationErrors = err.errors.map((err) => err.message);
        			  return res.status(500).json({ status: 500,errors: validationErrors });
        			}
        			 return res.status(500).json({ status: 500, message: err.message,data: []  });
                }

    }
    
    
    
    async creditDebitIncomeToUser(req, res) {
      const {mobile,walletType,amount,action, narration} = req;
  
      const requiredKeys = Object.keys({ mobile,walletType,amount,action});
            
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
  
      let t;
  
      try {
          
        
          let flag=0;
          let closing_balance=0;
          let credit=0  ;
          let debit =0 ;
          let sub_typ = '';

          const whereChk={mobile:mobile};
          const UserAttribute=['id','first_name','last_name','email'];
          const userRow = await this.db.user.getData(UserAttribute,whereChk);
              if(userRow){

                    const [walletBalance, cashbackBalance,primeWallet,affiliateBalance] = await Promise.all([
                        this.db.wallet.getWalletAmount(userRow.id),
                        this.db.cashback.getCashbackAmount(userRow.id),
                        this.db.prime.getLastclosingBalance(userRow.id),
                        this.db.ReferralIncome.getIncomeBalance(userRow.id),

                    ]);
                   
                    const openingBalance = (walletType === 'wallet') ? walletBalance : (walletType === 'cashback') ? cashbackBalance : (walletType === 'prime') ? primeWallet : (walletType === 'income') ? affiliateBalance : 0;
                   
                        
                      const order_id = utility.generateUniqueNumeric(7);
                     
                      if(action=='Credit'){
                           credit= amount;
                           debit=0;
                           sub_typ = 'System Credit';
                          closing_balance= parseFloat(openingBalance) + parseFloat(amount);
                      }else{
                          credit=0;
                          debit= amount;
                          sub_typ = 'System Debit';
                          closing_balance= parseFloat(openingBalance) - parseFloat(amount);
                      }
                      
                  
                     if(closing_balance>=0){
                         
                      const logData = {
                        user_id: userRow.id,
                        wallet_type: walletType,
                        amount: amount,
                        transaction_type: action,
                        details:narration?narration:sub_typ,
                        created_by:userRow.id,
                      };
                      
                      
                    
                      const logEntry = await this.db.logSystemCreditDebit.insertData(logData);
                        let orderEntry = [];
                      
                        if(logEntry && logEntry.id)
                        {
                          
                            const orderData = {
                              user_id: userRow.id,
                              env: config.env,
                              tran_type: action,
                              tran_sub_type: sub_typ,
                              tran_for: walletType,
                              trans_amount: amount,
                              currency: 'INR',
                              order_id,
                              order_status: 'SUCCESS',
                              created_on: Date.now(),
                              created_by: userRow.id,
                              ip_address: 0,
                          };
      
                          orderEntry = await this.db.upi_order.insertData(orderData);
                        }
                        if(orderEntry){
                         
                                if(walletType==='wallet'){
                                  const transactionData={
                                    transaction_id:order_id,
                                    user_id:userRow.id,
                                    env:config.env,
                                    type:action,
                                    amount:amount,
                                    sub_type:sub_typ,
                                    tran_for:'main',
                                    description: narration?narration:sub_typ
                                  };
                                  const IncomeResult = await this.db.wallet.insert_wallet(transactionData);
                                  flag=1;
                                }

                                if(walletType==='cashback'){
                              
                                  const transactionData = {
                                    transaction_id:order_id,
                                    user_id:userRow.id,
                                    env:config.env, 
                                    type:action,
                                    sub_type:sub_typ,
                                    tran_for:'cashback',
                                    amount:amount,
                                    description: narration?narration:sub_typ
                                };
                                const IncomeResult = await this.db.cashback.insert_cashback_wallet(transactionData);
                                flag=1;
                              }


                              if(walletType==='prime'){
                              
                                const transactionData = {
                                  transaction_id:order_id,
                                  user_id:userRow.id,
                                  env:config.env, 
                                  type:action,
                                  sub_type:sub_typ,
                                  tran_for:'prime',
                                  amount:amount,
                                  description: narration?narration:sub_typ
                              };
                              console.log(transactionData);
                              const IncomeResult = await this.db.prime.insert_prime_wallet(transactionData);
                              flag=1;
                            }

                            
                            if(walletType==='income'){
                              
                              const transactionData = {
                                  transaction_id:order_id,
                                  user_id: userRow.id,
                                  sender_id: userRow.id,  //sender_id 
                                  env: config.env,
                                  type: action,
                                  opening_balance: openingBalance,
                                  details: narration?narration:`Income ${amount} Received From System `,
                                  sub_type: sub_typ,
                                  tran_for: 'Income',
                                  credit: credit,
                                  debit: debit,
                                  closing_balance: closing_balance,
                                  plan_id: 0,//enter plan _id  
                                  level: 0,  //enter level 
                              };
                              
                                const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
                                flag=1;
                            }
                            
                            
                            if(walletType==='epin'){
                              const epinData={
                                transaction_id:order_id,
                                user_id:userRow.id,
                                env:config.env,
                                type:action,
                                amount:amount,
                                sub_type:sub_typ,
                                tran_for:'epin'
                              };
                              const epinWallet = await this.db.epinWallet.insert_wallet(epinData);
                              flag=1;
                            }


                        }
                      
                        if (flag==1 ) {
                          return res.status(200).json({ status: 200, message: `${action} Successful.`});
                        } else {
                            return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                        }
                        
                     }else{
                            return res.status(500).json({ status: 500, message: 'Amount should be greater than 0', data: [] });
                      }
                   
                  
                    }
                             
             
                  
              } catch (error) {
                  logger.error(`Unable to find Income: ${error}`);
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                  }
                
                  return res.status(500).json({ status: 500,  message:'Internal Server Error' ,data:[]});
              
            }
          }



        async bulkCreditDebitIncome(req, res) {
            
            const { walletType, action, amount, narration, uploadedData, sender_id } = req;
        
            const requiredKeys = Object.keys({ walletType, amount, narration, uploadedData, sender_id });
                  
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
        
            try {
                
                
                let flag=0;
                let closing_balance=0;
                let credit=0  ;
                let debit =0 ;
                let sub_typ = '';
                const wallets = ['income', 'Royality', 'SIP', 'MF', 'Laptop', 'Bike', 'Car', 'House'];
        
                if(uploadedData !== null)
                {
                  try {
                    //const jsonData = JSON.parse(uploadedData);
        
                    for(const user of uploadedData)
                    {
        
                      const whereChk={mlm_id: user.user_id};
                      const UserAttribute=['id','first_name','last_name','email'];
                      const userRow = await this.db.user.getData(UserAttribute,whereChk);
                      let userAmount = user.amount
                      if(userAmount==null)
                      {
                        userAmount = amount;
                      }
                      if(userRow)
                      {
        
                          const order_id = utility.generateUniqueNumeric(7);
                          const openingBalance = await this.db.ReferralIncome.checkIncomeBalance(userRow.id)
        
                          if(action==='Credit'){
                                credit= userAmount;
                                debit=0;
                                sub_typ = 'System Credit';
                              closing_balance= parseFloat(openingBalance) + parseFloat(userAmount);
                          }else{
                              credit=0;
                              debit= userAmount;
                              sub_typ = 'System Debit';
                              closing_balance= parseFloat(openingBalance) - parseFloat(userAmount);
                          }
        
        
        
                            const logData = {
                              user_id: userRow.id,
                              wallet_type: walletType,
                              amount: userAmount,
                              transaction_type: action,
                              details:sub_typ,
                              created_by:userRow.id,
                            };
                        
                            const logEntry = await this.db.logSystemCreditDebit.insertData(logData);
                            let orderEntry = [];
                          
                            if(logEntry && logEntry.id)
                            {
                              
                                const orderData = {
                                  user_id: userRow.id,
                                  env: config.env,
                                  tran_type: action,
                                  tran_sub_type: sub_typ,
                                  tran_for: walletType,
                                  trans_amount: userAmount,
                                  currency: 'INR',
                                  order_id,
                                  order_status: 'SUCCESS',
                                  created_on: Date.now(),
                                  created_by: sender_id,
                                  ip_address: 0,
                              };
        
                              orderEntry = await this.db.upi_order.insertData(orderData);
                            }
                            if(orderEntry)
                            {
                                if(wallets.includes(walletType)){
                                  
                                  const transactionData = {
                                      transaction_id:order_id,
                                      user_id: userRow.id,
                                      sender_id: sender_id,  //sender_id 
                                      env: config.env,
                                      type: action,
                                      opening_balance: openingBalance,
                                      details: narration,
                                      sub_type: sub_typ,
                                      tran_for: walletType,
                                      credit: credit,
                                      debit: debit,
                                      closing_balance: closing_balance,
                                      plan_id: 0,//enter plan _id  
                                      level: 0,  //enter level 
                                  };
                                  
                                    const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
                                    flag=1;
                                }
        
                            }
           
                        
                      }
        
                        
                    }
        
                    if (flag==1 ) {
                      return res.status(200).json({ status: 200, message: `${action} Successful.`});
                    } else {
                        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                    }
                    
                  } catch (error) {
                      return res.status(500).json({ status: 500, error: error.message, data: [] });
                  }
                }
                
                                   
                   
                        
                    } catch (error) {
                        logger.error(`Unable to find Income: ${error}`);
                        if (error.name === 'SequelizeValidationError') {
                          const validationErrors = error.errors.map((err) => err.message);
                          return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                        }
                      
                        return res.status(500).json({ status: 500,  message:'Internal Server Error' ,data:[]});
                    
              }
          }
          
  

    
    
}

module.exports = new Wallet();