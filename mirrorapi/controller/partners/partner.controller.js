const { connectpartner } = require('../../config/partner.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const { paginate } = require('../../utility/pagination.utility'); 
const utility = require('../../utility/utility'); 

class partners {

    db = {};

    constructor() {
        this.partnerdb = connectpartner();
        
    }
	

//     async getWalletBalance(req,res) {
       
//        try {
//             const user_id = await this.partnerdb.partner.getUserId();

//             const [walletBalance] = await Promise.all([
//                 this.partnerdb.wallet.getWalletAmount(user_id),
//             ]);

//             return { status: 200, message: 'Success', walletBalance: parseFloat(walletBalance).toFixed(2)};
   
//            }catch (err) {
//                 if (err.name === 'SequelizeValidationError') {
//                     const validationErrors = err.errors.map((err) => err.message);
//                     return res.status(500).json({ status: 500,errors: validationErrors });
//                 }
//                 return res.status(500).json({ status: 500, message: err.message,data: []  });
//             }
//    }


    async getPartners(req,res) {
       
       try {
            const partners = await this.partnerdb.partner.GetAllUsers();

            return res.status(200).json({ status: 200, message: 'Success', data:partners });
   
           }catch (err) {
                if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: validationErrors });
                }
                return res.status(500).json({ status: 500, message: err.message,data: []  });
            }
   }


    async getTransactionHistory(req,res) 
    {
        const { partner_id, from_date, to_date } = req;

        try {
            const user_id = partner_id?partner_id:0;
            const page = 1;
            const startDate =new Date(from_date);
            const endDate =new Date(to_date);
            endDate.setHours(23, 59, 59);
    
            const whereClause = {
                user_id: user_id,
                created_on: {
                  [Op.between]: [startDate, endDate]
                }
              }

            const result = await paginate(this.partnerdb.viewTransactions, {
                whereClause,
                page,
                pageSize: 500
            });

            if (result.totalPageCount > 0) {
                return { status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount };
            } else {
                return { status: 200, message: 'Data Not Found', data: [], totalPageCount: 0};
            }
            
        }catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
        }
    
    }


    async creditDebitToWallet(req, res) {
        const {partner_id,amount,action, narration} = req;
    
        const requiredKeys = Object.keys({ partner_id,amount,action, narration });
              
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
    
    
        try {
            
            let flag=0;
            let closing_balance=0;
            let credit=0  ;
            let debit =0 ;
            let sub_typ = '';
  
            const whereChk={id:partner_id};
            const UserAttribute=['id','name','email'];
            const userRow = await this.partnerdb.partner.getData(UserAttribute,whereChk);
                if(userRow){
  
                      const [walletBalance] = await Promise.all([
                          this.partnerdb.wallet.getWalletAmount(userRow.id)
                      ]);
                     
                      const openingBalance = walletBalance;
  
                        const order_id = utility.generateUniqueNumeric(8);
                       
                        if(action==='Credit'){
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
  
                      if(closing_balance>0){
  
                        
                        const orderData = {
                            user_id: userRow.id,
                            env: 'PROD',
                            tran_type: action,
                            tran_sub_type: sub_typ,
                            tran_for: sub_typ,
                            trans_amount: amount,
                            currency: 'INR',
                            order_id,
                            order_status: 'SUCCESS',
                            created_on: Date.now(),
                            created_by: userRow.id,
                            ip_address: 0,
                            api_response: narration
                        };
    
                        const orderEntry = await this.partnerdb.transOrder.insertData(orderData);
                        if(orderEntry){
                           
                            const transactionData={
                            transaction_id:order_id,
                            user_id:userRow.id,
                            type:action,
                            amount:amount,
                            sub_type:sub_typ,
                            tran_for:'main'
                            };
                            const IncomeResult = await this.partnerdb.wallet.insert_wallet(transactionData);
                            flag=1;

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
                    if (error.name === 'SequelizeValidationError') {
                      const validationErrors = error.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                    }
                  
                    return res.status(500).json({ status: 500,  message:error.message ,data:[]});
                
          }
    }


}


module.exports = new partners();