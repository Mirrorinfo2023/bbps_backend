const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const utility = require('../../utility/utility');
class cronJobPortfolio{
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async CompanyportfolioJob() {
        
       
        
        try {
            
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
                
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                    const day = String(currentDate.getDate()).padStart(2, '0');
                     const todayDate = `${year}-${month}-${day}`;
                   
               
                                    
                                    
                                     const [resultsRoyality, metadatas]  = await this.db.sequelize.query(`
                                                              SELECT count( p.plan_id) as total_ids, without_gst*count(p.plan_id) as total_amount, plan_name 
                                                              FROM mst_recharge_cashback_plan AS plan left JOIN tbl_plan_purchase p ON plan.id = p.plan_id 
                                                              and cast(p.created_on as date) ='${todayDate}' where plan.status=1 group by plan.id, plan.plan_name order by plan.id
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
                                    
                                     for (const IncData of resultsRoyality) {
                                         
                                         
                                            let refObj={
                                                total_ids:IncData.total_ids,
                                                total_amnt:IncData.total_amount,
                                                sub_category:IncData.plan_name,
                                                category:'Royality',
                                                portfolio_date:todayDate
                                             };
                                             
                                             const found=await this.db.CompanyPortfolio.getCount(todayDate,IncData.plan_name);
                                             
                                             if(found==0){
                                                 
                                                  await this.db.CompanyPortfolio.insertData(refObj,{ transaction: transaction});
                                                  
                                             }else{
                                                 
                                                    let curDate = new Date();
                                                    const formattedDate = curDate.toLocaleString();
                                                    let Obj={
                                                      
                                                            total_ids:IncData.total_ids,
                                                            total_amnt:IncData.total_amount,
                                                            updated_on:curDate
                                                        
                                                     };
                                                     
                                                     console.log(`portfolio Obj : ${JSON.stringify(Obj) }`);
                                             
                                                 await this.db.CompanyPortfolio.updateData(Obj,IncData.plan_name,todayDate,{ transaction: transaction});
                                                 
                                             }
                                             
                                            
                                     }
                                    
                     
            await transaction.commit();
                         
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in royality portfolio job :', err);
        }
    }
    
    //endcompanyroyality
    
    
    
    
    
    
    
    /*
    
    async UserRoyality() {
        
      
      
       
        
        try {
            
          
          
          
          
          
              const transaction =await this.db.sequelize.transaction();
            
            try {
                
                
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const todayDate = `${year}-${month}-${day}`;
            
                   
                            const [CompanyRoyality, metadatac]  = await this.db.sequelize.query(`SELECT sum(total_ids) as total_ids,
                            sum(total_amnt) as total_amount FROM trans_company_portfolio
                            WHERE royality_status=0   and  portfolio_date ='${todayDate}'  `, {
                            raw: false,
                            });
                
                            
                            if(CompanyRoyality!=null){
                                
                                
                                if(CompanyRoyality.total_amount!=null && CompanyRoyality.total_amount>0 ){
                                
                                const company_portfolio=CompanyRoyality.total_amount;
                                const total_users=CompanyRoyality.total_ids;
                                
                                const distribution =  company_portfolio/total_users ;
                                
                                const companyDistribution = distribution.toFixed(2);
                                
                                
                                
                                const [results, metadatas]  = await this.db.sequelize.query(`
                                select * from  mst_rank_royality 
                                `, {
                                raw: false,
                                });
                                
                                let SuccessFlag;
                                
                                
                                for( const rankmaster of results ){
                                    
                                        
                                        
                                    const [royalityIncome, metadataroyalityIncome]  = await this.db.sequelize.query(`
                                            SELECT r.user_id,r.level,m.rank FROM
                                            mst_rank_royality m
                                            LEFT JOIN trans_royality_income  r ON r.level = m.level
                                            where r.level=${rankmaster.level} and r.total_income>='${rankmaster.target}'
                                            `, {
                                              raw: false,
                                            });
                                
                                    const rankdistribution_amount=companyDistribution*(rankmaster.percentage/100);
                                    
                                        
                                        if(rankdistribution_amount>0 && royalityIncome !=null){
                                            
                                            for( const Userdata of royalityIncome){
                                                
                                                
                                                     const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(Userdata.user_id);
                                                    let openingbalance = 0;
                                    
                                                    if (userIncomeBalance) {
                                                        openingbalance = userIncomeBalance;
                                                    }
                                                
                                                
                                                    const order_id = utility.generateUniqueNumeric(8);
                                                    const transaction_id = order_id;
                                                    
                                                    const orderData = {
                                                    user_id: Userdata.user_id,
                                                    env: config.env,
                                                    tran_type: 'Credit',
                                                    tran_sub_type: 'Royality',
                                                    tran_for: `${Userdata.rank}`,
                                                    trans_amount: rankdistribution_amount,
                                                    currency: 'INR',
                                                    order_id,
                                                    order_status: 'Success',
                                                    created_on: Date.now(),
                                                    created_by: Userdata.user_id,
                                                    ip_address: 0,
                                                    };
                                                    
                                                    
                                                    
                                                    const transactionData = {
                                                    transaction_id,
                                                    user_id: Userdata.id,
                                                    sender_id: 65535,
                                                    env: config.env,
                                                    type: 'Credit',
                                                    opening_balance: openingbalance,
                                                    details: `${Userdata.rank} Income Received`,
                                                    sub_type: `${Userdata.rank}`,
                                                    tran_for: 'Royality',
                                                    credit: rankdistribution_amount,
                                                    debit: 0,
                                                    closing_balance: openingbalance + rankdistribution_amount,
                                                    plan_id: 6,
                                                    level: Userdata.level
                                                    };
                                                    
                                                    const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                                                    const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                                                    
                                                    SuccessFlag=1;
                                                
                                            }
                                            

                                            
                                            
                                        }

                                
                                //end
                                
                                }
                                
                                if(SuccessFlag){
                                    
                                    const obj = {
                                    
                                    royality_status: 1
                                    
                                    };
                                    
                                    
                                    await this.db.CompanyPortfolio.updateData(obj,todayDate,{ transaction: transaction });
                                    
                                }
                                
                                
                                
                                    await transaction.commit();
                                
                                }
                                
                                
                                
                                
                                
                            }
                                    
                         
           
                         
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
          
          
        } catch (err) {
            
            
            
            console.error('Error in royality portfolio job :', err);
        }
        
        
        
        
        
        
        
    }*/
    
    
    
    
    /*
    
    async UserReward() {
        
      
      
       
        
        try {
            
          
          
          
          
          
              const transaction =await this.db.sequelize.transaction();
            
            try {
                
                
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const todayDate = `${year}-${month}-${day}`;
            
                   
                            const [CompanyRoyality, metadatac]  = await this.db.sequelize.query(`SELECT sum(total_ids) as total_ids,
                            sum(total_amnt) as total_amount FROM trans_company_portfolio
                            WHERE reward_status=0  and  portfolio_date ='${todayDate}'  `, {
                            raw: false,
                            });
                
                            
                            if(CompanyRoyality!=null){
                                
                                
                                if(CompanyRoyality.total_amount!=null && CompanyRoyality.total_amount>0 ){
                                
                                const company_portfolio=CompanyRoyality.total_amount;
                                const total_users=CompanyRoyality.total_ids;
                                
                                const distribution =  company_portfolio/total_users ;
                                
                                const companyDistribution = distribution.toFixed(2);
                                
                                
                                
                                const [results, metadatas]  = await this.db.sequelize.query(`
                                select * from  mst_rank_reward 
                                `, {
                                raw: false,
                                });
                                
                                let SuccessFlag;
                                
                                for( const rankmaster of results ){
                                    
                                        
                                        
                                    const [royalityIncome, metadataroyalityIncome]  = await this.db.sequelize.query(`
                                            SELECT r.user_id,r.level,m.rank,m.reward FROM
                                            mst_rank_reward m
                                            LEFT JOIN trans_royality_income  r ON r.level = m.level
                                            where r.level=${rankmaster.level} and r.total_income>='${rankmaster.target}'
                                            `, {
                                              raw: false,
                                            });
                                
                                    const rankdistribution_amount=companyDistribution*(rankmaster.percentage/100);
                                    
                                        
                                        if(rankdistribution_amount>0 && royalityIncome !=null){
                                            
                                            for( const Userdata of royalityIncome){
                                                
                                                
                                                     const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(Userdata.user_id);
                                                    let openingbalance = 0;
                                    
                                                    if (userIncomeBalance) {
                                                        openingbalance = userIncomeBalance;
                                                    }
                                                
                                                
                                                    const order_id = utility.generateUniqueNumeric(8);
                                                    const transaction_id = order_id;
                                                    
                                                    const orderData = {
                                                    user_id: Userdata.user_id,
                                                    env: config.env,
                                                    tran_type: 'Credit',
                                                    tran_sub_type: 'Reward',
                                                    tran_for: `${Userdata.reward}`,
                                                    trans_amount: rankdistribution_amount,
                                                    currency: 'INR',
                                                    order_id,
                                                    order_status: 'Success',
                                                    created_on: Date.now(),
                                                    created_by: Userdata.user_id,
                                                    ip_address: 0,
                                                    };
                                                    
                                                    
                                                    
                                                    const transactionData = {
                                                    transaction_id,
                                                    user_id: Userdata.id,
                                                    sender_id: 65535,
                                                    env: config.env,
                                                    type: 'Credit',
                                                    opening_balance: openingbalance,
                                                    details: `${Userdata.rank} - ${Userdata.reward}  Income Received`,
                                                    sub_type: `${Userdata.reward}`,
                                                    tran_for: 'Reward',
                                                    credit: rankdistribution_amount,
                                                    debit: 0,
                                                    closing_balance: openingbalance + rankdistribution_amount,
                                                    plan_id: 8,
                                                    level: Userdata.level
                                                    };
                                                    
                                                    const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                                                    const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                                                    
                                                    SuccessFlag=1;

                                                
                                            }
                                            

                                            
                                            
                                        }

                                
                                //end
                                
                                }
                                
                                
                                if(SuccessFlag){
                                    
                                    const obj = {
                                    
                                    reward_status: 1
                                    
                                    };
                                    
                                    
                                    await this.db.CompanyPortfolio.updateData(obj,todayDate,{ transaction: transaction });
                                    
                                }
                                
                                
                                
                                await transaction.commit();
                                
                                }
                                
                                
                                
                                
                                
                            }
                                    
                         
           
                         
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
          
          
        } catch (err) {
            
            
            
            console.error('Error in royality portfolio job :', err);
        }
        
        
        
        
        
        
        
    }*/
    
    
    
    //end class
}

module.exports = new cronJobPortfolio();
