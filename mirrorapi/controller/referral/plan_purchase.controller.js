const { connect,config } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const notificationUtility = require('../../utility/fcm_notification.utitlity');
const whatsappUtility = require('../../utility/whatsapp.utility');
const messagingService = require('../../router/whatsapp/messagingService');
const emailUtility = require('../../utility/email.utility');

class planPurchase {
  db = {};

  constructor() {
    this.db = connect();
  }
    
     async Purchase(req, res) {
       
    const t = await this.db.sequelize.transaction();    
    try {
        //const decryptedObject = utility.DataDecrypt(req.encReq);
        const { plan_id, user_id, amount, wallet, sender_user_id } = req;

        const requiredKeys = ['plan_id', 'user_id', 'amount'];
        /*if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }*/


        const walletType = wallet?wallet:'Main';
        const senderUserId = sender_user_id?sender_user_id:user_id;
        const whereParam = { id: user_id };
        const userAttr = ['referred_by', 'mlm_id', 'first_name', 'last_name'];
        const userData = await this.db.user.getData(userAttr, whereParam);
        
        let walletbalance = 0;    

       /* if(walletType == 'Main')
        {
            walletbalance = await this.db.wallet.getWalletAmount(user_id);
        }

        if(walletType == 'Epin')
        {
            walletbalance = await this.db.epinWallet.getWalletAmount(senderUserId);
        }*/
        
            //walletbalance!==null && walletbalance > 0 && walletbalance >= amount
            if(true)
            {


            if (!userData) {
                return res.status(400).json({ status: 400, message: 'User not found', data: [] });
            }
    
            let balance = 0 ;
           /* if(walletType == 'Main')
            {
                balance = await this.db.wallet.getLastclosingBalance(user_id);
            }

            if(walletType == 'Epin')
            {
                balance = await this.db.epinWallet.getLastclosingBalance(senderUserId);
            }
    
             if (balance < amount) {
                 return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Insufficient balance', data: [] })));
            }*/
    
           
            
            try {
                const reffer_id = userData.referred_by;
                const order_id = utility.generateUniqueNumeric(7);
                const transaction_id = order_id;
                let CashbackAmount = 0;
                let PrimeAmount = 0;
                
                // const user_token=await this.db.fcm_notification.getFcmToken(userRow.id);
                // const fcmTokens = user_token ? user_token.token : '';
    
                const orderData = {
                    user_id,
                    env: config.env,
                    tran_type: 'Debit',
                    tran_sub_type: 'Plan Purchase',
                    tran_for: 'Plan Purchase',
                    trans_amount: amount,
                    currency: 'INR',
                    order_id,
                    order_status: 'PENDING',
                    created_on: Date.now(),
                    created_by: senderUserId,
                    ip_address: 0
                };
    
                const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });
                let PlanPurchase;
                
                try {
                    const purchaseData = {
                            transaction_id,
                            user_id,
                            plan_id,
                            amount,
                            created_on: Date.now(),
                            created_by: senderUserId
                        };
            
                     PlanPurchase = await this.db.PlanPurchase.insertData(purchaseData, { transaction: t });
                }
                catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        // Handle the case where the unique constraint is violated
                        console.error('Duplicate entry error:', error);
                        return res.status(400).json({ status: 400, message: 'You have alredy purchase the plan' });
                    } else {
                        // Handle other errors
                        console.error('Error during PlanPurchase insertion:', error);
                        throw error;
                    }
                }
                
                if(walletType == 'Main')
                {
                    const transactionData = {
                        transaction_id,
                        user_id,
                        env: config.env,
                        type: 'Debit',
                        amount,
                        sub_type: 'Prime Purchase',
                        tran_for: 'main'
                    };
        
                    await this.db.wallet.insert_wallet(transactionData, { transaction: t });
                }
                
               /* if(walletType == 'Epin')
                {
                    const etransactionData = {
                        transaction_id,
                        user_id:senderUserId,
                        env: config.env,
                        type: 'Debit',
                        amount,
                        sub_type: 'Prime Purchase',
                        tran_for: 'epin'
                    };
        
                    await this.db.epinWallet.insert_wallet(etransactionData, { transaction: t });
    
                }*/
                
              
                
                if(plan_id==1  || plan_id==3  || plan_id==4 ||  plan_id==2 ){
                    const plan_details = await this.db.cashbackPlan.getData(plan_id);
                    //CashbackAmount=parseFloat(plan_details.without_gst)+parseFloat(plan_details.without_gst);
                  //  PrimeAmount = parseFloat(plan_details.prime_amount);
                                  
                        PrimeAmount = parseFloat(amount);           
                    
                    if(plan_id==1){CashbackAmount=5555;}
                    if(plan_id==2){CashbackAmount=14999;}
                    if(plan_id==3 || plan_id==4){CashbackAmount=20000;}
                    
                    const CashbackData = {
                                        transaction_id,
                                        user_id,
                                        env:config.env, 
                                        type:'Credit',
                                        sub_type:'Prime Purchase',
                                        tran_for:'cashback',
                                        amount:CashbackAmount
                                    };
                                    
                const Cashback = await this.db.cashback.insert_cashback_wallet(CashbackData,{ transaction: t });
                
               
                }
                
                //  if (fcmTokens.length > 0) {
                //       const message=`Dear ${userData.first_name} ${userData.last_name},Congratulations..!!  You have successfully Purchased Mirror Prime membership.`;
                //         const notification = await notificationUtility.planPurchaseNotification(fcmTokens,userData.id,message,1);
                //         await this.db.log_app_notification.insertData(notification);
                //   }
                 this.insert_direct_income_inr_hybridlevel(user_id,plan_id,amount);
                 
                 const getOrder = await this.db.upi_order.findOne({
                      attributes: ['reference_no', 'order_id'],
                      where:{
                          user_id:user_id,
                          order_id:transaction_id,
                      }
                    });
                
                const dataResult = {
                    'reference_no': getOrder.reference_no,
                    'order_id': getOrder.order_id,
                    'prime_amount': PrimeAmount,
                    'cashback_amount': CashbackAmount,
                }
    
                t.commit();
                const whereChk = { id: user_id };
                const UserAttribute = ['id', 'first_name', 'last_name', 'mobile'];
                const userRow = await this.db.user.getData(UserAttribute, whereChk);
                let message;
                message = await whatsappUtility.prime_purchase(userRow.first_name, userRow.last_name, userRow.mobile);
                const emailMsg = await emailUtility.primePurchaseEmail(userRow.first_name, userRow.last_name, userRow.mobile);
                messagingService.sendMessage(userRow.mobile, message,null,userRow.email,"Prime Purchase Alert",emailMsg);
                return res.status(200).json( { status: 200, message: 'Purchase successful', data: [] });
            
            } catch (error) {
                await t.rollback();
                console.error("Transaction failed:", error);
                throw error;
            }
         
            }else{
                return res.status(500).json( { status: 500,error: 'You do not have sufficient wallet balance' });
            }
        
         
        
    } catch (error) {
         await t.rollback();
        console.error(`Error in Purchase: ${error}`);
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors: 'You have alredy purchase the plan' });
        }
        return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
    
    
    
}



async primeDirectCashback(user_id, PrimeAmount, parent_user_id)
    {
        try 
        {
            const chasback_amount = (PrimeAmount*0.25);
          const order_id=utility.generateUniqueNumeric(7);
            const orderData = {
                user_id:user_id,
                env:config.env, 
                tran_type:'Credit',
                tran_sub_type:'Prime Cashback',
                tran_for:'Prime Cashback',
                trans_amount:chasback_amount,
                currency:'INR',
                order_id,
                order_status:'SUCCESS',
                created_on:Date.now(),
                created_by:parent_user_id,
                ip_address:0
            };
              
            const generateorder = await this.db.upi_order.insertData(orderData); 
            if(generateorder)
            {

                const primeData = {
                    transaction_id:order_id,
                    user_id, 
                    env: config.env, 
                    type: 'Credit', 
                    sub_type: 'Bonus Prime', 
                    tran_for: 'prime', 
                    amount:chasback_amount
                };
                    
                await this.db.prime.insert_prime_wallet(primeData);
            }
            
            return  true;
        } catch (error) {
            console.error(error.message);
            return  false;
        }
    }




        
  async  determinePlans(data, plan_id) {
    const sortedData = data.sort((a, b) => b - a);
    console.log(sortedData);
    if (sortedData.length === 0) {
        return '555';
    }
    for (const item of sortedData) {
        if (item == 4) {
            return '2360B';
        }
        if (item == 3) {
            return '2360A';
        }
        if (item == 2) {
            return '1499';
        }
        if (item == 1) {
            return '555';
        }
    }

    // If no matches are found, return '555'
  
    if (plan_id == 1) {
        return '555';
    }
    if (plan_id == 2) {
        return '1499';
    }
    if (plan_id == 3) {
        return '2360A';
    }
     if (plan_id == 4) {
        return '2360B';
    }
   
     return '555';
     
}



// async insert_direct_income_inr_hybridlevel(user_id, plan_id) {
//     const referral_ids = await this.db.referral_idslevel.getMemberIdsPlan(user_id, plan_id);
    
   
//     if (referral_ids && referral_ids.length > 0) {
//          let successFlag = false;
//         for (const data of referral_ids) {
          
//             let credit = 0;
//             let planType = '';
//             let planAllotedName = '';
//             let planLabel = '';
//             let cb = 0;

//             if (plan_id === '1') {
//                 planType = 'Hybrid';
//                 planAllotedName = '555';
//                 planLabel = 'Hybrid';

//                 credit = 10;

//                 if (data.level === 1) {
//                     credit = 200;
//                 }
//             } else if (plan_id === '2') {
//                 planType = '1499';
//                 planLabel = 'Booster';

//                 let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);

//                 console.log(plantype_users);

//                 let plans = await this.determinePlans(plantype_users,plan_id);

//                 if (plans === '555') {
                 
//                     const PlanObjAttr = ['amount'];
//                     const PlanObjWhre = { plan: plans, level: data.level };

//                     const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

//                     if (PlanAmount) {
//                         credit = PlanAmount.amount;
//                     }
//                 } else {
//                     const PlanObjAttr = ['amount'];
//                     const PlanObjWhre = { plan: plans, level: data.level };

//                     const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

//                     if (PlanAmount) {
//                         credit = PlanAmount.amount;
//                     }
//                     planAllotedName = plans;
//                 }
//             } else if (plan_id === '3' || plan_id === '4') {
//                 planType = '2360';
//                 planLabel = 'Prime A';

//                 if (plan_id === '4') {
//                     planLabel = 'Prime B';
//                 }
              
//                 let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);

                

//                 let plans = await this.determinePlans(plantype_users,plan_id);
//                   console.log(plans);

//                 if (plans === '555' || plans === '1499' || plans === '2360B') {
                    
//                     console.log(`plans : ${plans}`);
                    
//                     if (data.level === 2 && (plans === '1499' || plans === '2360B')) {
//                         credit = 50;
//                     } else if (plans === '555' || plans === '1499') {
//                         const PlanObjAttr = ['amount'];
//                         const PlanObjWhre = { plan: plans, level: data.level };

//                         const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

//                         if (PlanAmount) {
//                             credit = PlanAmount.amount;
//                         }
//                     }
//                 } else if ((plans === '2360A' || plans === '2360B') && data.level >= 4 && data.level <= 10) {
//                     credit = 100;
//                     console.log(100);
//                 } else {
//                     const PlanObjAttr = ['amount'];
//                     const PlanObjWhre = { plan: plans, level: data.level };

//                     const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

//                     if (PlanAmount) {
//                         credit = PlanAmount.amount;
//                     }
//                     planAllotedName = '';
//                 }

               

//             }
            
            
//                 const whereParams = { id: data.ref_userid };
//                 const userAttr = ['id', 'referred_by', 'mlm_id'];
//                 const userDataResult = await this.db.user.getData(userAttr, whereParams);

//                 const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
//                 let openingbalance = 0;

//                 if (userIncomeBalance) {
//                     openingbalance = userIncomeBalance;
//                 }
//                  const where = { id: data.user_id };
//                 const Attr = ['first_name', 'last_name', 'mlm_id'];
//                 const userData = await this.db.user.getData(Attr, where);
                
                
//                 const order_id = utility.generateUniqueNumeric(7);
//                 const transaction_id = order_id;
               
//                 const orderData = {
//                     user_id: userDataResult.id,
//                     env: config.env,
//                     tran_type: 'Credit',
//                     tran_sub_type: 'Income',
//                     tran_for: 'Income',
//                     trans_amount: credit,
//                     currency: 'INR',
//                     order_id,
//                     order_status: 'PENDING',
//                     created_on: Date.now(),
//                     created_by: userDataResult.id,
//                     ip_address: 0,
//                 };
              
               

//                 const transactionData = {
//                     transaction_id,
//                     user_id: userDataResult.id,
//                     sender_id: data.user_id,
//                     env: config.env,
//                     type: 'Credit',
//                     opening_balance: openingbalance,
//                     details: `${planLabel} Level Income ${data.level} Received From ${userData.first_name} ${userData.last_name} (${data.mlm_id})`,
//                     sub_type: planLabel,
//                     tran_for: 'Income',
//                     credit: credit,
//                     debit: 0,
//                     closing_balance: openingbalance + credit,
//                     plan_id: plan_id,
//                     level: data.level,
//                 };
                 
//                  const t = await this.db.sequelize.transaction();
                 
//                 try {
                   
//                   const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
//                   const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
//                       t.commit();
//                   successFlag = true;
//                 } catch (error) {
//                  await t.rollback();
//                   console.log('Error inserting income:', error.message);
                  
//                   throw error;
//                 }
                
                
                
//         }
        
//         if(successFlag==true){ return true;}
//         return false;
//     }
// }


async insert_direct_income_inr_hybridlevel(user_id, plan_id,amount) {
     
    const referral_ids = await this.db.referral_idslevel.getMemberIdsPlan(user_id, plan_id);
    
    
    if (referral_ids && referral_ids.length > 0) {
         let successFlag = false;
         let result = [];
        for (const data of referral_ids) {
            
          
          
            let credit = 0;
            let planType = '';
            let planAllotedName = '';
            let planLabel = '';
            let cb = 0;
            let plans = '';
            let plan = '';
            let bonusAmount = 0;
            
         
              
           

            const userDataResult = [];
            userDataResult.id = data.ref_userid;
            const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
            let openingbalance = 0;

            if (userIncomeBalance) {
                openingbalance = userIncomeBalance;
            }
             const where = { id: data.user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.getData(Attr, where);
            
            const userDataRef = await this.db.user.findOne({
                attributes: ['first_name', 'last_name', 'mlm_id', 'is_levelincome'],
                where: {id: data.ref_userid}
            });
            
          
            const PlanObjAttr = ['percentage'];
            const PlanObjWhre = { plan_id: 3, level: data.level };

            const PlanPercentage = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);


            credit=(amount*PlanPercentage.percentage)/100;
            
            
            const order_id = utility.generateUniqueNumeric(7);
            const transaction_id = order_id;
        
            const orderData = {
                user_id: userDataResult.id,
                env: config.env,
                tran_type: 'Credit',
                tran_sub_type: 'Income',
                tran_for: 'Income',
                trans_amount: credit,
                currency: 'INR',
                order_id,
                order_status: 'PENDING',
                created_on: Date.now(),
                created_by: userDataResult.id,
                ip_address: 0,
            };
        
        	let prime_id = await this.db.PlanPurchase.getSinglePlanUserId(userDataResult.id);

            const transactionData = {
                transaction_id,
                user_id: userDataResult.id,
                sender_id: data.user_id,
                env: config.env,
                type: 'Credit',
                opening_balance: openingbalance,
                details: `Bonus Referral Income ${data.level} Received From ${userData.first_name} ${userData.last_name} (${data.mlm_id})`,
                sub_type: 'Bonus',
                tran_for: 'Income',
                credit: credit,
                debit: 0,
                closing_balance: openingbalance + credit,
                plan_id: prime_id,
                level: data.level
            };
            const t = await this.db.sequelize.transaction();
            
            try {
            
               const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
               const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
               
          
                  
                t.commit();
              successFlag = true;
            } catch (error) {
             await t.rollback();
              console.log('Error inserting income:', error.message);
            
              throw error;
            }
                
        }
        
        if(successFlag==true){ return true;}
        return false;
    }
}



async check_Notification(req,res){
    
    const { plan_id, user_id } = req;
    
      
                   const where = { id: user_id };
                   const Attr = ['first_name', 'last_name', 'mlm_id'];
                   const userData = await this.db.user.getData(Attr, where);
              
                const app_id=2;
                const user_token=await this.db.fcm_notification.getFcmToken(user_id,app_id);
                if(user_token!=null){
                    const fcmTokens = user_token ? user_token.token : '';
                    const app_id = user_token ? user_token.app_id : '';
                   
           
                   if (fcmTokens.length > 0) {
                       const message=`Dear ${userData.first_name}  ${userData.last_name},2360A Level Income 1 Received From ${userData.first_name} ${userData.last_name} (${userData.mlm_id})`;
                       const notification = await notificationUtility.incomeNotification(fcmTokens,message,user_id,app_id);
                       await this.db.log_app_notification.insertData(notification);
                        
                     }
                }else{
                    return "not found";
                }
        
}

async insert_direct_income_inr_hybridlevel_backendentry(req, res) {
    
    const { plan_id, user_id } = req;
    const referral_ids = await this.db.referral_idslevel.getMemberIdsPlan(user_id, plan_id);
    
    const planIncomeUserIds = await this.db.ReferralIncome.getsenderUserLevel(user_id, plan_id);
    
    if (referral_ids && referral_ids.length > 0) {
         let successFlag = false;
         let result = [];
        for (const data of referral_ids) {
            
            
       
            
        if( !planIncomeUserIds.includes(data.ref_userid)  ) {
          //if(data.ref_userid=='79112') {
            let credit = 0;
            let planType = '';
            let planAllotedName = '';
            let planLabel = '';
            let cb = 0;
            let plans = '';
            let plan = '';
            let bonusAmount = 0;
            
            if (plan_id === '1') {
                planType = 'Hybrid';
                planAllotedName = '555';
                planLabel = 'Hybrid';

                credit = 10;

                if (data.level === 1) {
                    credit = 200;
                }
            } else if (plan_id === '2') {
                planType = '1499';
                planLabel = 'Booster';
                plan = '1499';
                
                let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);

                plans = await this.determinePlans(plantype_users,plan_id);
                
                
                if(parseInt(plan, 10) < parseInt(plans, 10)){
                    plans = plan;
                }


                const PlanObjAttr = ['amount'];
                const PlanObjWhre = { plan: plans, level: data.level };

                const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

                if (PlanAmount) {
                    credit = PlanAmount.amount;
                }
                planAllotedName = plan_id;

            } else if (plan_id === '3' || plan_id === '4') {
                
                planType = '2360';
                planLabel = 'Prime A';
                plan = '2360A';

                if (plan_id === '4') {
                    planLabel = 'Prime B';
                    plan = '2360B';
                }
              
                let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);


                plans = await this.determinePlans(plantype_users,plan_id);

                if(data.level == 1 && plans == '1499')
                {
                    bonusAmount = 200;
                }
                
                if(parseInt(plan, 10) < parseInt(plans, 10)){
                    plans = plan;
                }
                
                
                
                if(plan=='2360B' && plans =='2360A')
                {
                    plans = '2360B';
                }
                
                const PlanObjAttr = ['amount'];
                const PlanObjWhre = { plan: plans, level: data.level };

                const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);
                if (PlanAmount) {
                    credit = PlanAmount.amount;
                }


            }else if (plan_id === '9' || plan_id === '10' || plan_id === '11') {
                const getPlan = await this.db.cashbackPlan.getData(plan_id);

                planType = getPlan.plan_amount;
                planLabel = getPlan.plan_name;
                plan = getPlan.plan_amount;
                const schemeAttr = ['level', 'percentage'];
                const schemeClause = {'status': 1, level: data.level}
                const getSchemePercentage =  await this.db.SchemeLevel.getSchemePercentage(schemeAttr, schemeClause);
                if(getSchemePercentage)
                {
                    credit = parseFloat(getPlan.plan_amount*(getSchemePercentage.percentage/100));
                }
                
            }

            const userDataResult = [];
            userDataResult.id = data.ref_userid;
            const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
            let openingbalance = 0;

            if (userIncomeBalance) {
                openingbalance = userIncomeBalance;
            }
             const where = { id: data.user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id','is_levelincome'];
            const userData = await this.db.user.getData(Attr, where);
            
            const userDataRef = await this.db.user.findOne({
                attributes: ['first_name', 'last_name', 'mlm_id', 'is_levelincome'],
                where: {id: data.ref_userid}
            });
            
            const is_levelincome=userDataRef?userDataRef.is_levelincome:null;
            /*********************STOP LEVELE INCOME**********************/
            if(is_levelincome  && is_levelincome==0){
                
                credit=0;
            }
            
            
            const order_id = utility.generateUniqueNumeric(7);
            const transaction_id = order_id;
        
            const orderData = {
                user_id: userDataResult.id,
                env: config.env,
                tran_type: 'Credit',
                tran_sub_type: 'Income',
                tran_for: 'Income',
                trans_amount: credit,
                currency: 'INR',
                order_id,
                order_status: 'PENDING',
                created_on: Date.now(),
                created_by: userDataResult.id,
                ip_address: 0,
            };
        
        

            const transactionData = {
                transaction_id,
                user_id: userDataResult.id,
                sender_id: data.user_id,
                env: config.env,
                type: 'Credit',
                opening_balance: openingbalance,
                details: `${planLabel} Level Income ${data.level} Received From ${userData.first_name} ${userData.last_name} (${data.mlm_id})`,
                sub_type: planLabel,
                tran_for: 'Income',
                credit: credit,
                debit: 0,
                closing_balance: openingbalance + credit,
                plan_id: plan_id,
                level: data.level
            };
            result.push(transactionData);
            const t = await this.db.sequelize.transaction();
            
            try {
            
              const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
              const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
               
              if(bonusAmount > 0)
              {
                    await this.bonusEntry(data.user_id, userDataResult.id, data.level, planLabel, plan_id, bonusAmount, data.mlm_id);
              }
                  
                t.commit();
                if(IncomeResult){
                    
                      successFlag = true;
                }
            
            } catch (error) {
             await t.rollback();
              console.log('Error inserting income:', error.message);
            
              throw error;
            }
        }
                
        }
        
        if(successFlag==true){ return true;}
        return false;
    }
}


    async bonusEntry(user_id, ref_user_id, level, planLabel, plan_id, bonusAmount, mlm_id)
    {
        const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(ref_user_id);
        let openingbalance = 0;
        let successFlag = false;

        if (userIncomeBalance) {
            openingbalance = userIncomeBalance;
        }
        const where = { id: user_id };
        const Attr = ['first_name', 'last_name', 'mlm_id'];
        const userData = await this.db.user.getData(Attr, where);
        
        
        const order_id = utility.generateUniqueNumeric(7);
        const transaction_id = order_id;
    
        const orderData = {
            user_id: ref_user_id,
            env: config.env,
            tran_type: 'Credit',
            tran_sub_type: 'Income',
            tran_for: 'Prime Bonus',
            trans_amount: bonusAmount,
            currency: 'INR',
            order_id,
            order_status: 'PENDING',
            created_on: Date.now(),
            created_by: ref_user_id,
            ip_address: 0,
        };
    
    

        const transactionData = {
            transaction_id,
            user_id: ref_user_id,
            sender_id: user_id,
            env: config.env,
            type: 'Credit',
            opening_balance: openingbalance,
            details: `Prime Bonus Level Income ${level} Received From ${userData.first_name} ${userData.last_name} (${mlm_id})`,
            sub_type: planLabel,
            tran_for: 'Income',
            credit: bonusAmount,
            debit: 0,
            closing_balance: openingbalance + bonusAmount,
            plan_id: plan_id,
            level: level
        };
        
        
        try {
        
            const generateorder = await this.db.upi_order.insertData(orderData);
            const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);

            successFlag = true;
        } catch (error) {

            console.log('Error inserting income:', error.message);
        
            throw error;
        }

        if(successFlag==true){ return true;}
        return false;
    }




 async ReferralBalance(req, res) {
   const decryptedObject = utility.DataDecrypt('eyJoZ3pnZmgiOjgwMCwibnZoaHp0diI6Ikl2d3Z2biBoZnh4dmhodWZvIiwid3pneiI6W119');
    const { user_id } = req;


    try {


          const whereChk={id:user_id};
          const UserAttribute=['id','first_name','last_name','mobile'];
          const userRow = await this.db.user.getData(UserAttribute,whereChk);



          if (!userRow) {

          return res.status(400).json({ status: 400, message: 'User not found', data: [] });
          }
        



 		 let prime_id = await this.db.PlanPurchase.getAllPlanUser(user_id);

		  const getReferralBonusBalance = await this.db.ReferralIncome.getReferralBonusBalance(user_id,prime_id);
 		  const getDailyBonusBalance = await this.db.ReferralIncome.getDailyBonusBalance(user_id,prime_id);
		  const getBonusBalance = await this.db.ReferralIncome.getBonusBalance(user_id,prime_id);

           if(getReferralBonusBalance  || getDailyBonusBalance || getBonusBalance ){
                                    
                  return res.status(200).json({ status: 200, getDailyBonusBalance,getReferralBonusBalance,getBonusBalance });
                                     
             }else {

                return res.status(200).json({ status: 200, getDailyBonusBalance:0,getReferralBonusBalance:0,getBonusBalance:0 });

                }
                                 



    }catch (error) {
     // this.handleError(err, res);
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json( utility.DataEncrypt(JSON.stringify(  { status: 500, errors: err.message } )) );
        }
         return res.status(500).json(  utility.DataEncrypt(JSON.stringify(  { status: 500, errors: error.message } ))  );
    }

}


    async RequestRedeem(req, res) {
     const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, amount, remarks , wallet_type ,plan_id } = decryptedObject;
	 

 // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Redeem', data: decryptedObject })));



    try {
     
      
      const whereChk={id:user_id};
      const UserAttribute=['id','first_name','last_name','mobile','email'];
      const userRow = await this.db.user.getData(UserAttribute,whereChk);
      
      
       if (!userRow) {
             
                return res.status(400).json({ status: 400, message: 'User not found', data: [] });
        }
        
        
        const whereKyc={user_id:user_id};
        const kycRow = await this.db.kyc.getKycData(whereKyc);
        
        let nonprime_count = await this.db.PlanPurchase.getNonPrimeCount(user_id);
        let prime_user = await this.db.PlanPurchase.PlanChkCount(user_id);


		let prime_res= await this.db.PlanPurchase.getPlanDate(user_id,plan_id);
		
		let prime_date=prime_res.planDate;

		

        const primeDay = parseInt(prime_date.split('-')[2], 10); // Extract day as number
        const today = new Date();
      const todayDay = today.getDate();
      const currentMonth = today.getMonth();  
      const currentYear = today.getFullYear();

      	let redeemDay = null;

        // Determine the redeem day based on primeDay
        if ((primeDay >= 25 && primeDay <= 31) || (primeDay >= 1 && primeDay < 6)) {
          redeemDay = 5;
        } else if (primeDay >= 6 && primeDay < 15) {
          redeemDay = 15;
        } else if (primeDay >= 15 && primeDay < 25) {
          redeemDay = 25;
        }
                                                   
     
                                                   
      const nextMonth = currentMonth ; // Next month (0-based index)
	  const redeemDate = new Date(currentYear, nextMonth, redeemDay);

       
        if (  (redeemDate <= today  &&  wallet_type=='1' )   || (  wallet_type=='2' ||  wallet_type=='3'  ) )  {


      

        
        
          const todayStartDate =new Date();
          todayStartDate.setHours(0, 0, 0);
          
          const todayEndDate =new Date();
          todayEndDate.setHours(23, 59, 59);
          
          //const chkTodayRedeem =await this.db.Redeem.chkRedeem(user_id,amount,todayStartDate ,todayEndDate);



		 let prime_id = await this.db.PlanPurchase.getAllPlanUser(user_id);

	


		 let walletbalance = {};

         walletbalance =await this.db.ReferralIncome.getReferralBonusBalance(user_id,prime_id);



		//await this.db.ReferralIncome.getIncomeBalance(user_id);
		 let reedemType='Daily Repurchase Bonus';
		

 


		if(wallet_type=='2'){
		  walletbalance = await this.db.ReferralIncome.getReferralBonusBalance(user_id,prime_id);
			reedemType='Daily Repurchase Bonus';

		}

		if(wallet_type=='1'){
		  walletbalance = await this.db.ReferralIncome.getDailyBonusBalance(user_id,prime_id);
			reedemType='Daily Bonus Income';

		}

		if(wallet_type=='3'){
		  walletbalance = await this.db.ReferralIncome.getBonusBalance(user_id,prime_id);
			reedemType='Bonus';

		}


	
		
		  const PrimeAmount = walletbalance[plan_id];

		
         
         
         
            if(parseFloat(PrimeAmount)>=parseFloat(amount)){
        
            if(prime_user>0  || true ){
        
                if(true){
                    
                    if(kycRow!= null && kycRow.status==1  || true ){
                    
                       if(amount>=250){
                            const trans_no = utility.generateUniqueNumeric(7);
                      
                            const RedeemObj = {
                                    user_id,
                                    amount: amount,
                                    category: 'Redeem',
                                    trans_no,
                                    remarks: remarks,
                                    created_on: Date.now(),
                                    updated_by: user_id,
                                    status: 0
                                };
                                
                     
                            const results = await this.db.Redeem.insertData(RedeemObj);
                            if (results.id > 0) {
                                
                                const autoapprove= await this.ApproveRedeem(user_id, user_id,amount,trans_no,'Auto Approved',reedemType,plan_id);
                                console.log(`autoapprove : ${autoapprove}`);
                                if(autoapprove!=null || autoapprove!=undefined  || autoapprove!=false ){
                                     return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Redeem successful', data: results })));
                                    //  return res.status(200).json( { status: 200, message: 'Redeem successful', data: results } );
                                }
                                 
                               
                            } else {
                                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Redeem', data: [] })));
                               // return res.status(500).json(  { status: 500, message: 'Failed to Redeem', data: [] }  );
                            }
                        
                       }else{
                           return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Minimum Redeem Amount  Rs 250 is Required', data: [] })));
                            // return res.status(500).json({ status: 500, message: 'amount should be greater than 150', data: [] });
                        }
                    }else{
                         return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Your Kyc not done. Please do Kyc first.', data: [] })));
                        // return res.status(500).json({ status: 500, message: 'Your Kyc not done. Please do Kyc first.', data: [] });
                    }
                }else{
                    // return res.status(500).json({ status: 500, message: 'You are not allowed to Redeem income Please purchase Prime Plan.', data: [] });

 					return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You are not allowed to Redeem income Please purchase Prime Plan.', data: [] })));
                }
            }else{
                 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'You are not prime member.', data: [] })));
				 //return res.status(500).json({ status: 500, message: 'You are not prime member.', data: [] });
            }
            }else{
                 //return res.status(500).json({ status: 500, message: 'Insufficient Income', data: [] });
  				return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Insufficient Income', data: [] })));
            }


  		} else {


          return res.status(500).json(utility.DataEncrypt(JSON.stringify({
            status: 500, 
            message: `Withdrawals are allowed on the ${redeemDate}th of month. Kindly wait until then to redeem your bonus.`, 
            data: []
          })));


        }
            
     
    } catch (error) {
     // this.handleError(err, res);
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json( utility.DataEncrypt(JSON.stringify(  { status: 500, errors: err.message } )) );
			// return res.status(500).json(  { status: 500, errors: err.message } );
        }
         return res.status(500).json(  utility.DataEncrypt(JSON.stringify(  { status: 500, errors: error.message } ))  );
		 //return res.status(500).json(   { status: 500, errors: error.message } );
    }
  }
    
    async ApproveRedeem(user_id, sender_user_id,amount,trans_no,remarks,reedemType,plan_id) {
        
        
            const t = await this.db.sequelize.transaction();    
    
            const walletbalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
    
                const orderData = {
                    user_id,
                    env: config.env,
                    tran_type: 'Debit',
                    tran_sub_type: 'Redeem',
                    tran_for: 'Redeem',
                    trans_amount: amount,
                    currency: 'INR',
                    order_id:trans_no,
                    order_status: 'PENDING',
                    created_on: Date.now(),
                    created_by: sender_user_id,
                    ip_address: 0
                };
    
                const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });
                
                 const RedeemObj = {
                  
                            // approval_remarks: remarks,
                            updated_on: Date.now(),
                            updated_by: sender_user_id,
                            // status: 1
                          };
             
                        const LastUpdated = await this.db.Redeem.UpdateData(RedeemObj,user_id,trans_no,{ transaction: t });
                
                        if(LastUpdated){
                            
                             const transactionData = {
                            transaction_id:trans_no,
                            user_id: user_id,
                            sender_id: user_id,
                            env: config.env,
                            type: 'Debit',
                            opening_balance: walletbalance,
                            details: `Redeem`,
                            sub_type: reedemType,
                            tran_for: 'Redeem',
                            credit: 0,
                            debit: amount,
                            closing_balance: walletbalance - amount,
                            plan_id: plan_id,
                            level: 0,
                        };
                        const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                        
                         t.commit();
                        const whereChk = { id: user_id };
                        const UserAttribute = ['id', 'first_name', 'last_name', 'mobile','email'];
                        const userRow = await this.db.user.getData(UserAttribute, whereChk);
                return true;
                
    }
                
    /*            
                
    try {
       

        const whereParam = { id: user_id };
        const userAttr = ['referred_by', 'mlm_id'];
        const userData = await this.db.user.getData(userAttr, whereParam);
        
       
         const TransactionAmountChk = await this.db.Redeem.getTransactionAmount(user_id,trans_no,amount);
         if(TransactionAmountChk==1){
             
             
        
        
            
        const walletbalance = await this.db.ReferralIncome.getIncomeBalance(user_id);
        
            if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
            {

            
            try {
                
                console.log(`remarks : ${remarks}`);
                const order_id = utility.generateUniqueNumeric(7);
                const transaction_id = order_id;
                
              
                const orderData = {
                    user_id,
                    env: config.env,
                    tran_type: 'Debit',
                    tran_sub_type: 'Redeem',
                    tran_for: 'Redeem',
                    trans_amount: amount,
                    currency: 'INR',
                    order_id,
                    order_status: 'PENDING',
                    created_on: Date.now(),
                    created_by: sender_user_id,
                    ip_address: 0
                };
    
                const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });
                
                try {
                    
                    
                        const RedeemObj = {
                  
                            approval_remarks: remarks,
                            updated_on: Date.now(),
                            updated_by: sender_user_id,
                            status: 1
                          };
             
                        const LastUpdated = await this.db.Redeem.UpdateData(RedeemObj,user_id,trans_no,{ transaction: t });
                
                        if(LastUpdated){
                            
                             const transactionData = {
                            transaction_id,
                            user_id: user_id,
                            sender_id: user_id,
                            env: config.env,
                            type: 'Debit',
                            opening_balance: walletbalance,
                            details: `Redeem`,
                            sub_type: 'Redeem',
                            tran_for: 'Redeem',
                            credit: 0,
                            debit: amount,
                            closing_balance: walletbalance - amount,
                            plan_id: 7,
                            level: 0,
                        };
                        const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                        
                        
                        
                        }
                    
                      
                }
                catch (error) {
                     await t.rollback();
                    return false;
                }
                
                 
    
                t.commit();
                return true;
            
            
            } catch (error) {
                await t.rollback();
               return false;
            }
           
           
           
           
           
           
            }
            else{
                return false;
            }
            
            
            
            }else{
                return false;
            }
        
         
        
    } catch (error) {
         await t.rollback();
       
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return false;
        }
        return false;
    }*/
   
    
    
   } 

        
         
        async RejectRedeem(req, res) {
               
            const t = await this.db.sequelize.transaction();    
            try {
                const {user_id, sender_user_id,amount,trans_no,remarks,status } = req;
        
                const requiredKeys = [ 'user_id', 'trans_no','sender_user_id','remarks','status'];
                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
                    return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
        
                    try {
                        
                        const action = status===1? 'Approved':'Rejected';
                        const RedeemObj = {
                  
                            approval_remarks: remarks,
                            updated_on: Date.now(),
                            updated_by: sender_user_id,
                            status: status
                          };
             
                        const LastUpdated = await this.db.Redeem.UpdateData(RedeemObj,user_id,trans_no,{ transaction: t });
                        
                        t.commit();
                        
                        if(LastUpdated){
                            const whereChk = { id: user_id };
                            const UserAttribute = ['id', 'first_name', 'last_name', 'mobile','email'];
                            const userRow = await this.db.user.getData(UserAttribute, whereChk);
                            const action = status === 1 ? 'Approved' : 'Rejected';

                            let message;
                            let emailMsg;
                            if (status === 1) {
                                message = await whatsappUtility.redeem_approve(userRow.first_name, userRow.last_name, userRow.mobile, amount);
                                emailMsg = await emailUtility.redeemApproveEmail(userRow.first_name, userRow.last_name, userRow.mobile, amount);    
                            } else {
                                message = await whatsappUtility.redeem_reject(userRow.first_name, userRow.last_name, userRow.mobile, amount);
                                emailMsg = await emailUtility.redeemRejectEmail(userRow.first_name, userRow.last_name, userRow.mobile, amount);
                            }
                           messagingService.sendMessage(userRow.mobile, message,null,userRow.email,`Redeem ${action}`,emailMsg);
                        return res.status(200).json({ status: 200, message: `Redeem ${action} successful`, data: [] });
                        }else{
                            return res.status(400).json({ status: 400, message: `unable to update Data`, data: [] });
                        }
                        
                      
                        
                    
                    } catch (error) {
                        await t.rollback();
                        console.error("Transaction failed:", error);
                        throw error;
                    }
                  
                
            } catch (error) {
                 await t.rollback();
                console.error(`Error in Redeem: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors: err.message });
                }
                return res.status(500).json({ status: 500, message: error.message, data: [] });
            }
        }
            
            
            
        async insert_royality_income(req, res) {
    
            const { level, mlm_ids, message, amount, sender_id, sub_type } = req;
            const requiredKeys = Object.keys({level, mlm_ids, message, amount, sender_id, sub_type});
            
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }

            const Attr = ['id', 'first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.findAll({
                attributes: [...Attr],
                where: {mlm_id: [...mlm_ids]}
            });
            let successFlag = false;
            let result = [];
            for (const data of userData) {

                const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(data.id);
                let openingbalance = 0;
    
                if (userIncomeBalance) {
                    openingbalance = userIncomeBalance;
                }
                    
                
                
                const order_id = utility.generateUniqueNumeric(7);
                const transaction_id = order_id;
            
                const orderData = {
                    user_id: data.id,
                    env: config.env,
                    tran_type: 'Credit',
                    tran_sub_type: 'Royality',
                    tran_for: sub_type,
                    trans_amount: amount,
                    currency: 'INR',
                    order_id,
                    order_status: 'SUCCESS',
                    created_on: Date.now(),
                    created_by: sender_id,
                    ip_address: 0,
                };
            
            
    
                const transactionData = {
                    transaction_id,
                    user_id: data.id,
                    sender_id: sender_id,
                    env: config.env,
                    type: 'Credit',
                    opening_balance: openingbalance,
                    details: message,
                    sub_type: sub_type,
                    tran_for: 'Royality',
                    credit: amount,
                    debit: 0,
                    closing_balance: openingbalance + amount,
                    plan_id: 6,
                    level: level
                };
                result.push(transactionData);
                const t = await this.db.sequelize.transaction();
                
                try {
                
                  const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
                  const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
                        
                    t.commit();
                  successFlag = true;
                } catch (error) {
                 await t.rollback();
                  console.log('Error inserting income:', error.message);
                
                  throw error;
                }
            //}
                    
            }
            
            if(successFlag==true){ return true;}
            return false;
        }

  
  
  
  async insert_levelincome(req,res) {
      
      const {user_id, plan_id } = req;
     
    const referral_ids = await this.db.referral_idslevel.getMemberIdsPlan(user_id, plan_id);
    
    
    if (referral_ids && referral_ids.length > 0) {
        
         let successFlag = false;
         let result = [];
        for (const data of referral_ids) {
            
            // const app_id=2;// id for business
            // const user_token=await this.db.fcm_notification.getFcmTokenByAppId(data.ref_userid,app_id);
            // const fcmTokens = user_token ? user_token.token : '';
            
          
            let credit = 0;
            let planType = '';
            let planAllotedName = '';
            let planLabel = '';
            let cb = 0;
            let plans = '';
            let plan = '';
            let bonusAmount = 0;
            
            if (plan_id === '1') {
                planType = 'Hybrid';
                planAllotedName = '555';
                planLabel = 'Hybrid';

                credit = 10;

                if (data.level === 1) {
                    credit = 200;
                }
            } else if (plan_id === '2') {
                planType = '1499';
                planLabel = 'Booster';
                plan = '1499';
                
                let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);

                plans = await this.determinePlans(plantype_users,plan_id);
                
                if(data.level == 1 && (plans == '2360A' || plans == '2360B'))
                {
                    bonusAmount = 200;
                }
                
                if(parseInt(plan, 10) < parseInt(plans, 10)){
                    plans = plan;
                }


                const PlanObjAttr = ['amount'];
                const PlanObjWhre = { plan: plans, level: data.level };

                const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);

                if (PlanAmount) {
                    credit = PlanAmount.amount;
                }
                planAllotedName = plan_id;

            } else if (plan_id === '3' || plan_id === '4') {
                planType = '2360';
                planLabel = 'Prime A';
                plan = '2360A';

                if (plan_id === '4') {
                    planLabel = 'Prime B';
                    plan = '2360B';
                }
              
                let plantype_users = await this.db.PlanPurchase.getAllPlanUser(data.ref_userid);


                plans = await this.determinePlans(plantype_users,plan_id);
                
                
                
                if(parseInt(plan, 10) < parseInt(plans, 10)){
                    plans = plan;
                }
                
                if(plan=='2360B' && plans =='2360A')
                {
                    plans = '2360B';
                }
                
                const PlanObjAttr = ['amount'];
                const PlanObjWhre = { plan: plans, level: data.level };

                const PlanAmount = await this.db.PlanLevel.getPlanAmount(PlanObjAttr, PlanObjWhre);
                if (PlanAmount) {
                    credit = PlanAmount.amount;
                }


            }

            const userDataResult = [];
            userDataResult.id = data.ref_userid;
            const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
            let openingbalance = 0;

            if (userIncomeBalance) {
                openingbalance = userIncomeBalance;
            }
             const where = { id: data.user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.getData(Attr, where);
            
            const whereRef = { id: data.ref_userid };
            const AttrRef = ['first_name', 'last_name', 'mlm_id'];
            const userDataRef = await this.db.user.getData(AttrRef, whereRef);
            
            
            
            const order_id = utility.generateUniqueNumeric(7);
            const transaction_id = order_id;
        
            const orderData = {
                user_id: userDataResult.id,
                env: config.env,
                tran_type: 'Credit',
                tran_sub_type: 'Income',
                tran_for: 'Income',
                trans_amount: credit,
                currency: 'INR',
                order_id,
                order_status: 'PENDING',
                created_on: Date.now(),
                created_by: userDataResult.id,
                ip_address: 0,
            };
        
        

            const transactionData = {
                transaction_id,
                user_id: userDataResult.id,
                sender_id: data.user_id,
                env: config.env,
                type: 'Credit',
                opening_balance: openingbalance,
                details: `${planLabel} Level Income ${data.level} Received From ${userData.first_name} ${userData.last_name} (${data.mlm_id})`,
                sub_type: planLabel,
                tran_for: 'Income',
                credit: credit,
                debit: 0,
                closing_balance: openingbalance + credit,
                plan_id: plan_id,
                level: data.level
            };
            const t = await this.db.sequelize.transaction();
            
            try {
            
               const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: t });
               const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: t });
               
                // if (fcmTokens.length > 0) {
                //       const message=`Dear ${userDataRef.first_name} ${userDataRef.last_name}, ${planLabel} Income Level  ${data.level} Received ${credit} RS From ${userData.first_name} ${userData.last_name} (${data.mlm_id})`;
                //       const notification = await notificationUtility.incomeNotification(fcmTokens,message,user_id,app_id);
                //       await this.db.log_app_notification.insertData(notification);
                // }
               
               if(bonusAmount > 0)
               {
                    await this.bonusEntry(data.user_id, userDataResult.id, data.level, planLabel, plan_id, bonusAmount, data.mlm_id);
               }
                  
                t.commit();
              successFlag = true;
            } catch (error) {
             await t.rollback();
              console.log('Error inserting income:', error.message);
            
              throw error;
            }
                
        }
        
        if(successFlag==true){  return res.status(200).json( { status: 200, message: 'Success' } ); }
     
        
    }else{
         return res.status(500).json( { status: 500, message: 'Fail' } );
        
    }
}


  async  referalTaskCheck(referal_ids) {
      
      
      
                            let activeChk = await this.db.sequelize.query(`
                            SELECT count(user_id) from tbl_userlevel_active where user_id='${referal_ids}' 
                            and is_active=1
                            
                            `, {
                            raw: false,
                            type: this.db.sequelize.QueryTypes.SELECT,
                            });
                            
                            if(activeChk>0){
                                 return true;
                            }
                            
      
                              let taskcount = await this.db.sequelize.query(`
                                                SELECT 
                                                    IFNULL(
                                                        (
                                                            SELECT 
                                                                COUNT(user_id)
                                                            FROM (
                                                                SELECT 
                                                                    SUM(CASE WHEN task_count >= subquery.target_count THEN 1 ELSE 0 END) AS total_tasks,
                                                                    subquery.user_id
                                                                FROM (
                                                                    SELECT  
                                                                        COUNT(*) AS task_count,
                                                                        target_count,
                                                                        t.user_id
                                                                    FROM 
                                                                        log_user_task t 
                                                                    JOIN 
                                                                        mst_task m ON m.id = t.task_id
                                                                    WHERE 
                                                                        t.user_id='${referal_ids}'  
                                                                        AND t.task_id > 1 
                                                                        AND task_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)  
                                                                    GROUP BY 
                                                                        t.task_id, t.user_id
                                                                ) AS subquery
                                                                GROUP BY  
                                                                    subquery.user_id
                                                            ) AS total_tasks_subquery
                                                            WHERE 
                                                                CASE 
                                                                    WHEN total_tasks >= 3 THEN 100 
                                                                    ELSE (total_tasks / 3.0) * 100
                                                                END = 100
                                                        ),
                                                        (
                                                            SELECT COUNT(p.ref_userid)
                                                            FROM trans_royality_income t 
                                                            JOIN trans_royality_prime p ON p.ref_userid = t.user_id 
                                                            WHERE p.ref_userid = '${referal_ids}' 
                                                                AND p.level = 1
                                                                AND p.created_on >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                                                        )
                                                    ) AS taskcount
                                            `, {
                                                raw: false,
                                                type: this.db.sequelize.QueryTypes.SELECT,
                                            });

                                
                                if(taskcount>0){
                                    return true;
                                }
                                
                        return false;
                        
                        
       }
       
       
       async updatePrimePurchaseStatus(req, res) {
            const {purchase_id, remarks, status} = req;
        
            
            const requiredKeys = Object.keys({ purchase_id, remarks, status });
                  
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
        
            try {
        
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                
                const updatedStatus = await this.db.PlanPurchase.update(
                    { order_status:status, order_remarks: remarks},
                    { where: { id:purchase_id} }
                );
                            
                if (updatedStatus) {
                    return res.status(200).json({ status: 200, message: 'Updated Successful.'});
                } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                }
                        
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors:'Internal Server Error', data:validationErrors });
                }
                
                return res.status(500).json({ status: 500,  message: error.message ,data:[]});
            }
        }
       
       
       
       
       

  
}

module.exports = new planPurchase();