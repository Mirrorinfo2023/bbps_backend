const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const utility = require('../../utility/utility');

class cycleIncomeCronJobs {
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async hybridCycle() {
        
       
        
        try {
            

				const income_date=Date.now();
			
            
             const [Users, metadatas]  = await this.db.sequelize.query(`
                                                            

  												SELECT inc.user_id, inc.amount,inc.id as cycle_id 
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3  

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id and plan_id=inc.id  and cycle_type='Daily Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )  `, {
                                                              raw: false,
                                                            });
                                      //  and  DATE(inc.created_on) BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 DAY) AND CURDATE() CURRENT_DATE
                                                                                         
            const t =await this.db.sequelize.transaction();

		
            
            try {
                
                    for (const Data of Users) {
                        
                           
                                
                                       let successFlag = false;


                                            const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(Data.user_id);
                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;
                                                const trans_amount= (Data.amount * 0.45 )/100;
                                                                                         
                                                                                     
                                                                                         
                                                    const orderData = {
                                                        user_id: Data.user_id,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: Data.user_id,
                                                        ip_address: 0,
                                                    };
                                                  
                                                   
                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: Data.user_id,
                                                        sender_id: Data.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Self Bonus Income Received`,
                                                        sub_type: 'Daily Bonus Income',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: Data.cycle_id,
                                                        level: 1,
 														created_on: income_date
                                                    };



												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(Data.user_id);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(Data.user_id,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(Data.user_id);



                                                        try{
                                                            
																if( IncomeTotalCredit < expectedTotalCredit ){
                                                                                                           
                                                                                         																
                                                                                                          
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;


																}
                                                            
                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`cycle income   ${err.message}`);
                                                            
                                                        }


                                                          if(successFlag){
                                                
                                                                const refObj={
                                                                user_id:Data.user_id,
                                                                plan_id:Data.cycle_id,
                                                                cycle_date:income_date,
																cycle_type:'Daily Bonus'
                                                                };
                                                                await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                                
                                                            }


                               // await t.commit();
                                                    
                                }
                                                     
                                                    
                                                
                                            
                                            
                                            
                                          
                                         


                                      
                                
                           
                          
                     
                        
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in updating tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

    }catch (error) {
                // Handle errors during table updates
                console.log('Error in updating tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
          
            
            
      
    }



                                                                                                       
                                                                                                                        
                                                                                                      
       async BonusReferralIncome8() {
        
       
        
        try {
            

			const income_date= '2025-07-21';
           //Date.now();
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               46  )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now() IncomeTotalCredit< expectedTotalCredit
														//
                                                     
                                                        try{
                                                            
                                                            if( true ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                           
                                                                                                                                                                                                        
                                                                                                                
                                                                                                      
       async BonusReferralIncome7() {
        
       
        
        try {
            
	const income_date= '2025-07-21';
     // const income_date= Date.now();
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               37  )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now() IncomeTotalCredit< expectedTotalCredit
														//
                                                     
                                                        try{
                                                            
                                                            if( true ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
       async BonusReferralIncome6() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               38  )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now() IncomeTotalCredit< expectedTotalCredit
														//
                                                     
                                                        try{
                                                            
                                                            if( true ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 

    
    async BonusReferralIncome() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               1,30,32,33,34,39
                                                                                                           )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now()
														//
                                                     
                                                        try{
                                                            
                                                            if( IncomeTotalCredit< expectedTotalCredit ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
                           
                                                                                                      
                                                                                                      
               
                                                                                                      
       async BonusReferralIncome1() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               38,46,37  )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now() IncomeTotalCredit< expectedTotalCredit
														//
                                                     
                                                        try{
                                                            
                                                            if( true ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
                                                                                                      
   
                                                                                                      
                                                                                                      
                                                                                                      
    
    async BonusReferralIncome2() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                                40,41,42,43,44,45,46,47,49,53
                                                                                                           )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now()
														//
                                                     
                                                        try{
                                                            
                                                            if( IncomeTotalCredit< expectedTotalCredit ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
    
    async BonusReferralIncome3() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               		 54,56,57,58,59,60,61,63,65,68
                                                                                                           )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now()
														//
                                                     
                                                        try{
                                                            
                                                            if( IncomeTotalCredit< expectedTotalCredit ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
    
    async BonusReferralIncome4() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                               70,81,84,95,99,101,106,110,115,119
                                                                                                           )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now()
														//
                                                     
                                                        try{
                                                            
                                                            if( IncomeTotalCredit< expectedTotalCredit ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
                                                                                                      
                                                                                                      
                                                                                                      
    
    async BonusReferralIncome5() {
        
       
        
        try {
            

				const income_date= '2025-07-21';
			
//, inc.amount,inc.id as cycle_id,inc.transaction_id
//and tci.plan_id=inc.id
            
             const [Users, metadatas]  = await this.db.sequelize.query(`

                                                 SELECT  distinct inc.user_id
                                                  FROM tbl_plan_purchase AS inc
                                                  WHERE inc.plan_id = 3   and user_id in (
                                                120,131,132,135,137,138,159,206
                                                                                                           )

                                                  AND NOT EXISTS (
                                                      SELECT 1
                                                      FROM trans_cycle_income tci
                                                      WHERE tci.user_id = inc.user_id  and cycle_type='Repurchase Bonus'
                                                      AND CAST(tci.cycle_date AS DATE) = '${income_date}'
                                                      -- '2025-02-28'  
                                                  )
                                                             
                                                            `, {
                                                              raw: false,
                                                            });
            const t =await this.db.sequelize.transaction();

			
			//Date.now()
            
          console.log('BonusReferralIncome', Users);
                                                                                                           

            try {
                
                    for (const Data of Users) {

  console.log('BonusReferralIncomeData.user_id', Data.user_id);
                        
										let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(Data.user_id);  

										
 									const referralDirectPrime = await this.db.referral_idslevel.getReferralCount(Data.user_id, '1');

									let ref_level='4';
									
													
									if (referralDirectPrime==1){
										ref_level='111';
									}
									if (referralDirectPrime==2){
										ref_level='222';
									}
									if (referralDirectPrime==3){
										ref_level='333';
									}
									if (referralDirectPrime==4){
										ref_level='444';
									}
										
									//console.log('referralDirectPrime', referralDirectPrime);

                           
                                     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlanRef(Data.user_id, ref_level);
                                                                                                           
    										console.log(`referral_ids: ${referral_ids}`);
                                          	console.log(`Data.ref_level: ${ref_level}`);
                                            console.log(`Data.user_id: ${Data.user_id}`); 
   
                                        if (referral_ids && referral_ids.length > 0) {


											    let successFlag=false;
                                           
                                            for (const UserdataRefer of referral_ids) {


											 const AllPlanReferral = await this.db.PlanPurchase.getAllInvestment(UserdataRefer.user_id);

											  for (const PlanData of AllPlanReferral) {

											// console.log(`PlanDataid: ${PlanData.id}`);
                                                              
                                               //const whereParams = { id: UserdataRefer.ref_userid };


												const whereParams = { id: UserdataRefer.user_id };
                                                const userAttr = ['id', 'referred_by', 'mlm_id'];
                                                const userDataResult = await this.db.user.getData(userAttr, whereParams);

                                                
                                               // console.log(`userDatacycleincomeResult: ${JSON.stringify(userDataResult)}`);
                                                
                                                if(userDataResult){
                                                    
											   //const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                                                    
                                                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(UserdataRefer.ref_userid);

                                                let openingbalance = 0;
                                
                                                if (userIncomeBalance) {
                                                    openingbalance = userIncomeBalance;
                                                }
                                                
                                                const order_id = utility.generateUniqueNumeric(7);
                                                const transaction_id = order_id;

                                                 const PlanObjAttr = ['percentage'];
                                                const PlanObjWhre = { plan_id: 4, level: UserdataRefer.level };

                                                const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


 												const PlanPurchObjAttr = ['amount'];

                                               // const PlanPurchObjWhre = { plan_id: 3, user_id:UserdataRefer.user_id,id:Data.cycle_id };


  												const PlanPurchObjWhre = { plan_id: 3, user_id:PlanData.user_id,id:PlanData.id };

                                                const PlanAmountReferral = await this.db.PlanPurchase.getData(PlanPurchObjAttr, PlanPurchObjWhre);

												const PlanReferalAount=(PlanAmountReferral.amount*.50)/100;
                                                   
                                                const trans_amount= (PlanReferalAount * PlanPercentage.percentage )/100;


												//let prime_id = Data.cycle_id;

												//validation for credit total
												
   												const TotalInvestmentAmnt = await this.db.PlanPurchase.getTotalInvestment(UserdataRefer.ref_userid);
												const directuserCount = await this.db.referral_idslevel.getReferralCount(UserdataRefer.ref_userid,'1');
												const multiplier = directuserCount >= 5 ? 3.5 : 2.5;
												const expectedTotalCredit = TotalInvestmentAmnt*multiplier;

												const IncomeTotalCredit = await this.db.ReferralIncome.getTotalCredit(UserdataRefer.ref_userid);





												//PlanData.id;

												 //console.log(`userDatacprime_id: ${prime_id}`);

													//await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);  
														//userDataResult.id 

                                                    const orderData = {
                                                        user_id: UserdataRefer.ref_userid,
                                                        env: config.env,
                                                        tran_type: 'Credit',
                                                        tran_sub_type: 'Income',
                                                        tran_for: 'Income',
                                                        trans_amount: trans_amount,
                                                        currency: 'INR',
                                                        order_id,
                                                        order_status: 'Success',
                                                        created_on: income_date,
                                                        created_by: UserdataRefer.ref_userid,
                                                        ip_address: 0,
                                                    };

 												 //console.log(`userDatacycleincomeorderData: ${JSON.stringify(orderData)}`);
                                                  
                                                   //  created_on: Date.now(),
													// sender_id: UserdataRefer.user_id,
													//${UserdataRefer.mlm_id}

                                    
                                                    const transactionData = {
                                                        transaction_id,
                                                        user_id: UserdataRefer.ref_userid,
                                                        sender_id: UserdataRefer.user_id,
                                                        env: config.env,
                                                        type: 'Credit',
                                                        opening_balance: openingbalance,
                                                        details: `Daily Repurchase Bonus Income ${UserdataRefer.level} Received From ${userDataResult.mlm_id} (${PlanData.transaction_id})`,
                                                        sub_type: 'Daily Repurchase Bonus',
                                                        tran_for: 'Income',
                                                        credit: trans_amount,
                                                        debit: 0,
                                                        closing_balance: openingbalance + trans_amount,
                                                        plan_id: prime_id,
                                                        level: UserdataRefer.level,
														created_on: income_date,
                                                        created_by:prime_id
                                                    };

													console.log('transactionDataReferralIncomedaily',transactionData);

															console.log('IncomeTotalCredit',IncomeTotalCredit);
															console.log('expectedTotalCredit',expectedTotalCredit);

													//created_on: Date.now()
														//
                                                     
                                                        try{
                                                            
                                                            if( IncomeTotalCredit< expectedTotalCredit ){
                                                                                                       
                                                                                                       
 																const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                                                              	const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                                                        
                                                       			successFlag = true;
                                                                                                       							
																}


                                                             
                                                        }catch(err){
                                                            
                                                            console.log(`repurchase income  error  ${err.message}`);
                                                            
                                                        }





												}

												

                                                    
                                                }
                                                     
                                                    
                                                
                                            }
                                        
                                            
                                            if(successFlag){
                                                
                                                const refObj={
                                                user_id:Data.user_id,
                                                plan_id:prime_id,
                                                cycle_date:income_date,
												cycle_type:'Repurchase Bonus'
                                                };

											 //cycle_date:Date.now()

                                               await this.db.CycleIncome.insertData(refObj ,{ transaction: t } );
                                                
                                            }
                                            
                                         
                                         
                                        }
                                      


                                  // await t.commit();  
                            }
                          
                     
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase  income shoot:', error.message);
         
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }

              } catch (error) {
                // Handle errors during table updates
                console.log('Error in repurchase tables:', error.message);
            
                // Roll back the transaction if an error occurs
                //await t.rollback();
               // console.log('Transaction rolled back');
                throw error;
              }
            
        } 
      
    



}

module.exports = new cycleIncomeCronJobs();
