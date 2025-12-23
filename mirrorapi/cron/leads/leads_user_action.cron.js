
const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 

class cronJobOrderRepurchase {
   
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        this.db = connect();
    }

    async LeadsRepurchaseJob() { 
        
        try {
            let date = new Date();
            let crdate = utility.formatDate(date);


            const createdOn = new Date(crdate);
            const dateBefore90Days = createdOn.getTime()-(90*24*60*60*1000);
            const dateBefore90DaysStr = new Date(dateBefore90Days);
            let dateBefore90DaysDate = utility.formatDate(dateBefore90DaysStr);
            const startDate = dateBefore90DaysDate +' 00:00:00';
            const endDate = dateBefore90DaysDate + ' 23:59:59';
            let whereCondition = {
                    'created_on': {
                      [Op.lte]: endDate
                    },
                status:1
            }
            const leadRecords = await this.db.holdIncome.getAllRecords(whereCondition);
            const t = await this.db.sequelize.transaction();    
              
                for (const order of leadRecords) 
                {
                    const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(order.user_id);
                    let openingbalance = 0;
        
                    if (userIncomeBalance) {
                        openingbalance = userIncomeBalance;
                    }
                    const transactionData = {
                        transaction_id:order.transaction_id,
                        user_id: order.user_id,
                        sender_id: order.user_id,
                        env:order.env,
                        type: order.type,
                        opening_balance: openingbalance,
                        details: order.details,
                        sub_type: order.sub_type,
                        tran_for:order.tran_for,
                        credit:  order.amount,
                        debit: 0,
                        closing_balance: openingbalance +  order.amount,
                        plan_id: 0,
                        level: order.level
                    };

                    const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                   
                    await this.db.holdIncome.update(
                        {status: 2 },  
                        { where: { user_id:order.user_id,
                                     transaction_id:order.transaction_id,
                                    status:1 }},{ transaction: t }
                      );


                     await this.db.upi_order.update(
                                    {order_status:'SUCCESS' },
                                    { where: { user_id:order.user_id,
                                                order_id:order.transaction_id,
                                                order_status:'PENDING' }},{ transaction: t }
                                  );
                    await t.commit();
                  console.log(order.transaction_id);
               
                }

                return "success";
                
        } catch (err) {
            await t.rollback();
            console.error('Error in shopping repurchase income job :', err);
        }
    }




}

module.exports = new cronJobOrderRepurchase();
