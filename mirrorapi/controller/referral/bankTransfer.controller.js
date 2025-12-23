const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const smsUtility = require('../../utility/sms.utility');
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class bankTransfer {
  db = {};

  constructor() {
    this.db = connect();
  }
    

  async affiliateToWallet(req, res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { user_id, amount, remarks } = decryptedObject ;
            
            const requiredKeys = Object.keys({ user_id, amount, });
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
              
            }
        
           try {
             const t = await this.db.sequelize.transaction();    
             const whereChk={id:user_id};
             const UserAttribute=['id','first_name','last_name','mobile'];
             const userRow = await this.db.user.getData(UserAttribute,whereChk);
             
             
                if (!userRow) {
                    return res.status(400).json({ status: 400, message: 'User not found', data: [] });
               }
               
               
               const whereKyc={user_id:user_id};
               const kycRow = await this.db.kyc.getKycData(whereKyc);
               
               let prime_count = await this.db.PlanPurchase.getPrimeCount(user_id);
               //let prime_user = await this.db.PlanPurchase.PlanChkCount(user_id);
               
               
                 const todayStartDate =new Date();
                 todayStartDate.setHours(0, 0, 0);
                 
                 const todayEndDate =new Date();
                 todayEndDate.setHours(23, 59, 59);
                 
                const walletbalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
                
                if(prime_count){
                  if(kycRow!= null && kycRow.status==1){
                
                   if(walletbalance>=amount){
                              if(amount>=200){
                                    const order_id = utility.generateUniqueNumeric(7);
                                    const transaction_id = order_id;
                                    const deduction_amt= amount * 0.05;
                                    const transfer_amt= amount - deduction_amt;
                                    
                                    const orderData = {
                                        user_id,
                                        env: config.env,
                                        tran_type: 'Debit',
                                        tran_sub_type: 'Affiliate to wallet',
                                        tran_for: 'Affiliate to wallet',
                                        trans_amount: amount,
                                        currency: 'INR',
                                        order_id,
                                        order_status: 'PENDING',
                                        created_on: Date.now(),
                                        created_by: user_id,
                                        ip_address: 0
                                    };
                                    const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });
        
                                    const RedeemObj = {
                                        user_id,
                                        amount: amount,
                                        deduction_amt:deduction_amt,
                                        transfer_amt:transfer_amt,
                                        category: 'Affiliate to wallet',
                                        trans_no:order_id,
                                        remarks: remarks,
                                        created_on: Date.now(),
                                        created_by: user_id,
                                        status: 1,
                                       
                                    };
                                    const LastUpdated = await this.db.affiliateToWallet.insertData(RedeemObj,{ transaction: t });
                                    if(LastUpdated){
                                   
                                        const transactionData = {
                                           transaction_id,
                                           user_id: user_id,
                                           sender_id: user_id,
                                           env: config.env,
                                           type: 'Debit',
                                           opening_balance: walletbalance,
                                           details: `Affiliate to wallet`,
                                           sub_type: 'Affiliate to wallet',
                                           tran_for: 'Affiliate to wallet',
                                           credit: 0,
                                           debit: amount,
                                           closing_balance: walletbalance - amount,
                                           plan_id: 7,
                                           level: 0,
                                       };
                                       const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                
                                        const walletData = {
                                            transaction_id:transaction_id,
                                            user_id:user_id,
                                            env:config.env,
                                            type:'Credit',
                                            amount:transfer_amt,
                                            sub_type:'Affiliate to wallet',
                                            tran_for:'main'
                                        };
                                        const walletEntry = await this.db.wallet.insert_wallet(walletData, { transaction: t });
                                       
                                        await this.db.upi_order.update(
                                            {order_status:'SUCCESS' },
                                            { where: { user_id:user_id,order_id:order_id,order_status:'PENDING' }, t }
                                          );
                
                                        t.commit();
        
                                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Income transfer successful', data: LastUpdated })));
                                        // return res.status(200).json( { status: 200, message: 'Income transfer successful', data: LastUpdated } );
                                    }else{
                                            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed To trasfer', data: [] })));
                                        // return res.status(500).json({ status: 500, message: 'Failed To trasfer', data: [] });
                                    }
                              }else{
                                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Amount should be greater than and or equal to 200', data: [] })));
                                //   return res.status(500).json({ status: 500, message: 'amount should be greater than 150', data: [] });
                               }
                   
                   }else{
                        // return res.status(500).json({ status: 500, message: 'Insufficient Income', data: [] });
                        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Insufficient Income', data: [] })));
                   }
                   
                   }else{
                            // return res.status(500).json({ status: 500, message: 'Insufficient Income', data: [] });
                            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Your Kyc not done. Please do Kyc first.', data: [] })));
                       }
                    }else{
                            // return res.status(500).json({ status: 500, message: 'Insufficient Income', data: [] });
                            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You are not prime member', data: [] })));
                       }
                   
            
           } catch (error) {
            // this.handleError(err, res);
               if (error.name === 'SequelizeValidationError') {
                   const validationErrors = error.errors.map((err) => err.message);
                //   return res.status(500).json(  { status: 500, errors: err.message } );
                    return res.status(500).json( utility.DataEncrypt(JSON.stringify(  { status: 500, errors: err.message } )) );
               }
        
            //   return res.status(500).json( { status: 500, errors: error.message });
                return res.status(500).json(  utility.DataEncrypt(JSON.stringify(  { status: 500, errors: error.message } ))  );
           }
 }
   
 
         async  affiliateToWalletHistory(req, res) {
               const decryptedObject = utility.DataDecrypt(req.encReq);
              const { user_id } = decryptedObject;
        
                try {
        
                    let whereCondition ;
                    whereCondition = {
                        'user_id':user_id
                        // 'created_on': {
                        //   [Op.between]: [startDate, endDate]
                        // },
                    }
        
                  const results = await this.db.view_affiliateToWallet.getAllData(whereCondition);
                  if(results){
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message:'Data Found', data: results })));
                    // return res.status(200).json({ status: 200,message:'Data Found', data: results });
                  }else{
                      return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message:'Data Not Found', data: [] })));
                    // return res.status(200).json({ status: 200,message:'Data Not Found', data: [] });
                  }
                  
        
                } catch (error) {
                  logger.error(`Unable to find user: ${error}`);
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                    // return res.status(500).json({ status: 500,errors: validationErrors });
                  }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
                //   return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
            }
          
  
}

module.exports = new bankTransfer();