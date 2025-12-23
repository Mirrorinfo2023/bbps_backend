const { connectshop } = require('../../config/shopdb.config');
const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const { details } = require('../../controller/reports/user_details.controller');
const utility = require('../../utility/utility'); 

class cronJobOrderRepurchase {
     shopdb = {};
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        this.shopdb = connectshop();
        this.db = connect();
    }

    async OrderRepurchaseJob() { 
        
        try {
            
            const shop_orders = await this.shopdb.order.getIncomeCreditOrders();
            
            try {
                
                for (const order of shop_orders) 
                {
                    const user_id = order.user_id;
                    const seller_user_id = order.seller_user_id;
                    const amount = order.order_amount;
                    const ipAddress = 0;
                    const shopping_order_id = order.id;

                    const Repurchase = await this.rePurchaseIncome(config.env, user_id, seller_user_id, amount, ipAddress, shopping_order_id );
                    
                    await this.shopdb.order.update(
                        {income_credit:1 },
                        { where: { id:order.id } }
                    );
                        
                }

                
            } catch (error) {
                console.error('Error in updating tables:', error);
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in shopping repurchase income job :', err);
        }
    }


    async ReferralIncomeCreditJob() { 
        
        try {
            
            const holdIncome = await this.shopdb.order.getDataForCreditIncome();
            
            try {
                
                for (const income of holdIncome) 
                {
                    const getCountOrder = await this.shopdb.getCount(income.shopping_order_id);
                    if(getCountOrder == 1)
                    {
                        let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(income.user_id);
                        let credit_amount = income.amount.toFixed(2);
                        let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);

                        const refralData = {
                            user_id:income.user_id,
                            transaction_id: income.transaction_id,
                            env: income.env, 
                            type: 'Credit', 
                            sub_type: income.sub_type, 
                            opening_balance: opening_balance,
                            credit: credit_amount,
                            debit:0,
                            closing_balance: closing_balance,
                            tran_for: income.tran_for, 
                            created_by:income.sender_id,
                            details: income.details,
                            sender_id: income.sender_id,
                            level: income.level,
                            plan_id:5
                        };
                        const result = await this.db.ReferralIncome.insert(refralData);

                        await this.db.upi_order.update(
                            {order_status: 'SUCCESS' },
                            { where: { user_id:income.user_id,order_id:income.transaction_id }, t }
                          );
                    }
                    
                    
                        
                }

                
            } catch (error) {
                console.error('Error in updating tables:', error);
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in shopping repurchase income job :', err);
        }
    }



    async rePurchaseIncome(env, user_id, seller_user_id, amount, ipAddress, shopping_order_id )
    {
      try {

        
        let sub_type = 'Product Shopping';
        const netAmount = parseFloat(amount-(amount*12/100));
        const seller_repurchase_amount = (netAmount*2/100).toFixed(2);
        let user_repurchase_amount = ((netAmount*1/100)/15).toFixed(2)


        const referrals = await this.db.referral_idslevel.getShoppingRefralUser(user_id);
        let date = new Date();
        const newRow = {
            id: '0',
            user_id: user_id,
            ref_userid: seller_user_id,
            level: 0,
            status: 1,
            created_on: utility.formatDate(date),
          };
          referrals.push(newRow);
          
          const purchaserNewRow = {
            id: '0',
            user_id: user_id,
            ref_userid: user_id,
            level: 1,
            status: 1,
            created_on: utility.formatDate(date),
          };
          referrals.push(purchaserNewRow);
        let results = [];
       for (const referral of referrals) 
       {
           let newLevel = referral.level;
           if(referral.id> 0 && referral.level>0)
           {
               newLevel = referral.level+1;
           }
        
            const schemeAttr = ['level', 'shopping_percentage'];
            const schemeClause = {'status': 1, level: newLevel}
            const getSchemePercentage =  await this.db.SchemeLevel.getSchemePercentage(schemeAttr, schemeClause);
            if(getSchemePercentage)
            {
                user_repurchase_amount = parseFloat(netAmount*(getSchemePercentage.shopping_percentage/100));
            }
            
          if(referral.ref_userid>0 && user_repurchase_amount>0)
          {
            const order_id=utility.generateUniqueNumeric(7);
            const orderData = {
                user_id:referral.ref_userid,
                env:env, 
                tran_type:'Credit',
                tran_sub_type:'Shopping Repurchase',
                tran_for:'Repurchase',
                trans_amount:(newLevel==0)? seller_repurchase_amount:user_repurchase_amount,
                currency:'INR',
                order_id,
                order_status:'PENDING',
                created_on:Date.now(),
                created_by:user_id,
                ip_address:ipAddress
            };
              
            const generateorder = await this.db.upi_order.insertData(orderData); 

            if(generateorder){
              const refralData = {
                  user_id:referral.ref_userid,
                  transaction_id: order_id,
                  env: env, 
                  type: 'Credit', 
                  sub_type: sub_type, 
                  amount: (newLevel==0)? seller_repurchase_amount:user_repurchase_amount,
                  tran_for: 'Repurchase', 
                  created_by:user_id,
                  details: sub_type + ' Repurchase(' +amount+ ') income',
                  sender_id: user_id,
                  level: newLevel,
                  shopping_order_id: shopping_order_id
              };
              const result = await this.db.holdIncome.insert(refralData);
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
}

module.exports = new cronJobOrderRepurchase();
