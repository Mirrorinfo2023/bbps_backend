const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class Royality {
  db = {};

  constructor() {
    this.db = connect();
  }

  

    async RankRoyalityCategory(req, res) {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            let currentDate =req.royality_date
            //`2024-06-07`;
            //new Date();
            //currentDate.setDate(currentDate.getDate() - 1);
            if (typeof currentDate === 'string' || currentDate instanceof String) {
                    currentDate = new Date(currentDate);
                }
                
                // Handle invalid date conversion
                if (isNaN(currentDate)) {
                    throw new Error('Invalid date');
                }
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            //const yesterdayLogDate = `2024-06-06`;
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
           
           let whereClause='';
           if(req.royality!=null){
                whereClause =`and m.id in (${req.royality})`; 
           }
           
           
            
            const [resultslevel, metadatas]  = await this.db.sequelize.query(`
                                                    
                                                    
                                        SELECT 
                                            m.category,
                                            r.user_id,
                                            r.level,
                                            m.id as rank_id,
                                            uu.username,
                                            ROW_NUMBER() OVER (PARTITION BY r.user_id ORDER BY m.target_amt DESC) AS row_num
                                        FROM
                                            mst_rank_royality_category m
                                         JOIN
                                            trans_royality_income r ON r.level = m.level AND r.total_income = m.target_amt and r.is_active=1 and r.is_transfer=1
                                         JOIN
                                            tbl_app_users uu ON uu.id = r.user_id
                                        WHERE uu.status=1  ${whereClause} and m.id  in (4)
                                       
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            //and m.id  in (1,4,13)
                                    
            const silvercount=await this.db.RoyalityIncome.getSilverCountId();
            const mobilefundcount=await this.db.RoyalityIncome.getMobilefundCountId();
            const goldcount=await this.db.RoyalityIncome.getGoldCountId();
            const PlatinumCount=await this.db.RoyalityIncome.getPlatinumCountId();
            const DiamondCount=await this.db.RoyalityIncome.getDiamondCountId();
             const getHouseFund=await this.db.RoyalityIncome.getHouseFundCountId();
             const getTravelFund=await this.db.RoyalityIncome.getTravelFundCountId();
              const getCarFund=await this.db.RoyalityIncome.getCarFundCountId();
                                           
                  
                                    
                                    
                                    
            
            
            let successFlag;
            
            for (const IncData of resultslevel) {
                //IncData.row_num==1
                
                
              // let CountuserAction = await this.db.userAction.getLastUserLog();
              //refer_link_count follow_up_count grafix_count income_screenshot_count direct_count prime_level_count login_attampt
              
                //const Userlogcount= await this.db.log.getUserLoginCount(yesterdayLogDate,IncData.username);
                
                
                       
                              /*  let totalTaskdone=0;
                        

                                let primecount  = await this.db.sequelize.query(`select count(p.ref_userid)  from trans_royality_income t 
                                join trans_royality_prime p on p.ref_userid=t.user_id and cast(p.created_on as date)= '${yesterdayLogDate}'
                                where p.ref_userid='${IncData.user_id}' and  level=1
                                                  
                                                    `, {
                                                    raw: false,
                                                    type: this.db.sequelize.QueryTypes.SELECT,
                                                    });
                                        
                                        
                                if(primecount>0){
                                    totalTaskdone=100;
                                }else{
                                
                                
                                        const  Taskpercentage   = await this.db.sequelize.query(`
                                                        SELECT 
                                                        CASE 
                                                        WHEN total_tasks >= 3 THEN 100 
                                                        ELSE LEAST((total_tasks / 3.0) * 100, 100)
                                                        END AS percentage
                                                        FROM (
                                                        SELECT 
                                                        SUM(CASE WHEN task_count >= subquery.target_count THEN 1 ELSE 0 END) AS total_tasks
                                                        FROM (
                                                        SELECT  
                                                        COUNT(*) AS task_count,target_count
                                                        FROM 
                                                        log_user_task t 
                                                        JOIN 
                                                        mst_task m ON m.id = t.task_id
                                                        WHERE 
                                                        t.task_id > 1 
                                                        and   user_id = '${IncData.user_id}' AND CAST(task_date AS DATE) = '${yesterdayLogDate}'
                                                        GROUP BY 
                                                        t.task_id
                                                        ) AS subquery
                                                        ) AS total_tasks_subquery
                                                    `, {
                                                    raw: false,
                                                    type: this.db.sequelize.QueryTypes.SELECT,
                                                    });
                                                    
                                                    
                                             if (Taskpercentage[0].percentage !== null) {
                                                totalTaskdone = parseInt(Taskpercentage[0].percentage, 10); 
                                              } 
                                }
                                
                                
                          console.log(`totalTaskdone : ${totalTaskdone}`);*/
                
                if(true){
                    
                    console.log(`getTodayAmount company  royality company userid: ${IncData.user_id}`);
                    
                    const [resultsroyalitycategory, metadata]  = await this.db.sequelize.query(`
                    
                     select rc.*,r.rank as rank_r from mst_rank_royality_category rc join mst_rank_royality r on r.id=rc.rank_id  where rc.id=${IncData.rank_id}
                    and rc.status=1
                    `, {
                    raw: false,
                    });
                    
                    
                    for (const rankcategory of resultsroyalitycategory) {
                    
                    let percentage= rankcategory.percentage;
                    
                    let Totalroyalityids=0;
                    
                    
                    
                    let sub_type='Royality';
                    
                    if(rankcategory.id==1){
                        
                        Totalroyalityids=silvercount;
                        sub_type =`${rankcategory.rank_r} ( ${rankcategory.category} Income )`;
                    }
                    
                    
                     if(rankcategory.id==2){
                        
                        Totalroyalityids=goldcount;
                        sub_type =`${rankcategory.rank_r} ( ${rankcategory.category} Income )`;
                    }
                    if(rankcategory.id==3){
                        
                        Totalroyalityids=getCarFund;
                        sub_type =`${rankcategory.category}`;
                    }
                    
                      if(rankcategory.id==4){
                        
                        Totalroyalityids=PlatinumCount;
                         sub_type =`${rankcategory.rank_r} ( ${rankcategory.category} Income )`;
                    }
                    
                      if(rankcategory.id==7){
                        
                        Totalroyalityids=DiamondCount;
                         sub_type =`${rankcategory.rank_r} ( ${rankcategory.category} Income )`;
                    }
                    
                       if(rankcategory.id==19){
                        
                        Totalroyalityids=mobilefundcount;
                         sub_type =`${rankcategory.category}`;
                    }
                    
                    if(rankcategory.id==6){
                        
                        Totalroyalityids=getHouseFund;
                        sub_type =`${rankcategory.category}`;
                    }
                    
                    if(rankcategory.id==13){
                        
                        Totalroyalityids=getTravelFund;
                        sub_type =`${rankcategory.category}`;
                    }
                    
                    if(Totalroyalityids>0){
                    
                    console.log(`Totalroyalityids : ${Totalroyalityids}`);
                    
                    let royalityamount= ((getTodayAmount*percentage)/100)/Totalroyalityids;
                    
                    const whereParams = { id: IncData.user_id };
                    const userAttr = ['id', 'referred_by', 'mlm_id'];
                    const userDataResult = await this.db.user.getData(userAttr, whereParams);
                    
                   
                    
                    if(userDataResult){
                    
                      console.log(`royality comapny user object: ${JSON.stringify(userDataResult)}`);
                    
                    const userIncomeBalance = await this.db.ReferralIncome.getIncomeBalance(userDataResult.id);
                    let openingbalance = 0;
                    
                    if (userIncomeBalance) {
                    openingbalance = userIncomeBalance;
                    }
                    
                     console.log(`royality openingbalance: ${openingbalance}`);
                    const order_id = utility.generateUniqueNumeric(7);
                    
                     console.log(`royality order_id: ${order_id}`);
                    const transaction_id = order_id;
                    
                    const orderData = {
                    user_id: userDataResult.id,
                    env: config.env,
                    tran_type: 'Credit',
                    tran_sub_type: 'Royality',
                    tran_for: `${rankcategory.category} Income Royalty ${Totalroyalityids}`,
                    trans_amount: royalityamount,
                    currency: 'INR',
                    order_id,
                    order_status: 'Success',
                    created_on: Date.now(),
                    created_by: userDataResult.id,
                    ip_address: 0,
                    };
                    
                    
                    console.log(`royality income data : ${JSON.stringify(orderData)} `);
                    
                    const generateorder = await this.db.upi_order.insertData(orderData);
                      
                      const transactionData = {
                    transaction_id,
                    user_id: userDataResult.id,
                    sender_id: 0,
                    env: config.env,
                    type: 'Credit',
                    opening_balance: openingbalance,
                    details: `${yesterdayDate} ${rankcategory.rank} ( ${rankcategory.category} ) Royalty ${Totalroyalityids} `,
                    sub_type: `${sub_type}`,
                    tran_for: 'Royality',
                    credit: royalityamount,
                    debit: 0,
                    closing_balance: openingbalance + royalityamount,
                    plan_id: 6,
                    level: IncData.level
                    };
                    
                    
                    
                     const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData);
                     
                     successFlag=true;
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                    //successFlag = true;
                    }catch(err){
                        
                        
                    
                    console.log(`Royality category income   ${err.message}`);
                    
                    
                    
                    }*/
                    
                    
                    
                   /* const transactionData = {
                    transaction_id,
                    user_id: userDataResult.id,
                    sender_id: 0,
                    env: config.env,
                    type: 'Credit',
                    opening_balance: openingbalance,
                    details: ` ${rankcategory.category}  Income Received`,
                    sub_type: `${rankcategory.category}`,
                    tran_for: 'Royality',
                    credit: royalityamount,
                    debit: 0,
                    closing_balance: openingbalance + royalityamount,
                    plan_id: 6,
                    level: IncData.level
                    };
                    
                    console.log(`royality income data : ${JSON.stringify(transactionData)} `);*/
                     //const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                     
                      //await transaction.commit();
                 
                    
                    
                    
                    }     
                    
                    }
                    
                    
                    
                    
                    
                    }
                    
                    
                   // await transaction.commit();
            }
            
            
            }
            
            if(successFlag){
                
                 return res.status(200).json({ status: 200, message: 'success', data: [] });
            }else{
                
                return res.status(500).json({ status: 500, message: 'Error', data: [] });
            }
            
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', err);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back',err);
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
        async PrimeRoyality(req,res) {
        
       
        
        try {
            
            //const TargetRank = await this.db.RankRoyality.getAllTargetRank();
            
            
                                                            
                                                            
           // const transaction =await this.db.sequelize.transaction();
           //  //AND CAST(p.created_on AS DATE) >= '2024-01-01' 
            
            try {
                 const [userResult, metadatas]  = await this.db.sequelize.query(`select id from tbl_app_users where status=1`, {
                                                              raw: false,
                                                            });
                                                            
                    let successFlag=false;
                
                    for (const Data of userResult) {
                        
                                    console.log(`user for prime royality - ${Data.id}`);
                                    
                                    
                                     const [resultslevel, metadatasprime]  = await this.db.sequelize.query(`
                                                SELECT
                                                without_gst,
                                                p.plan_id,
                                                p.user_id,
                                                rpl.level,
                                                rpl.ref_userid
                                            FROM
                                                tbl_plan_purchase p
                                            JOIN
                                                mst_recharge_cashback_plan r ON r.id = p.plan_id
                                            LEFT JOIN
                                                trans_royality_prime rp ON rp.user_id = p.user_id AND rp.plan_id = p.plan_id AND rp.ref_userid = ${Data.id}
                                            LEFT JOIN
                                                tbl_referral_idslevel rpl ON rpl.user_id = p.user_id
                                            WHERE
                                                rpl.ref_userid =${Data.id} 
                                                AND rp.user_id IS NULL
                                                AND rpl.status = 1
                                            ORDER BY
                                                p.user_id ASC
                                                ` , {
                                                         raw: false,
                                                   });
                                                   
                                 
                                  
                                     for (const IncData of resultslevel) {
                                            
                                            
                                         
                                            let refObj={
                                                user_id:IncData.user_id,
                                                plan_id:IncData.plan_id,
                                                amount:IncData.without_gst,
                                                ref_userid:IncData.ref_userid,
                                                level:IncData.level
                                             };
                                             
                                             const found= await this.db.RoyalityPrime.getCount(IncData.user_id,IncData.plan_id,IncData.ref_userid);
                                             
                                             if(found==0){
                                                 
                                                  await this.db.RoyalityPrime.insertData(refObj);//{ transaction: transaction}
                                             }
                                             
                                            
                                     }
                                   successFlag=true; 
                     }
                     
                     if(successFlag){
                
                         return res.status(200).json({ status: 200, message: 'success', data: [] });
                    }else{
                        
                        return res.status(500).json({ status: 500, message: 'Error', data: [] });
                    }
                              
           
                         // await transaction.commit();
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in prime transaction royality  tables:', error.message);
                 return res.status(500).json({ status: 500, message: 'Error', data: error.message });
              
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in referalids job :', err);
        }
    }

    async RoyalityRank(req,res) {
        
       
        
        try {
            
           
            
                const [resultslevel, metadatas]  = await this.db.sequelize.query(`
                                                              SELECT sum(amount) as totalincome,ref_userid,level from trans_royality_prime where status=0 
                                                              and level >=1 and level <=6  group by ref_userid,level
                                                            `, {
                                                              raw: false,
                                                            });
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
                 let successFlag=false;   
                 
                    for (const Data of resultslevel) {
                                            
                                            var Incomelevel=Data.level;
                                            var income=Data.totalincome;
                                            var old_flag=0;
                                             var royality_name='';
                                            
                                            //var levelIncrease=0;
                                            
                                             /*const whereParam = { user_id:Data.ref_userid,old_flag:1 };
                                             const userAttr = ['old_flag', 'level'];
                                             const chkRoyality=await this.db.RoyalityIncome.getData(userAttr,whereParam);
                                             if(chkRoyality!=null){
                                                 
                                                 levelIncrease=chkRoyality.level+1;
                                                 
                                                
                                                  
                                                 
                                             }*/
                                             
                                             // && Data.totalincome<200000.00
                                             
                                        if(Data.totalincome>=20000   && Data.totalincome<100000.00   && Data.level==1 ){
                                            Incomelevel=1;
                                            income= 20000;
                                            old_flag=1;
                                            royality_name='Silver';
                                            
                                            
                                        }
                                          if(Data.totalincome>=100000.00  && Data.totalincome<200000.00  && Data.level==1 ){
                                            Incomelevel=7;
                                            income= 100000;
                                             old_flag=1;
                                             royality_name='Mobile Fund';
                                           
                                        }
                                         if(Data.totalincome>=200000.00  && Data.totalincome<500000.00  && Data.level==2 ){
                                            Incomelevel=2;
                                            income= 200000;
                                             old_flag=1;
                                             royality_name='Gold';
                                           
                                        }
                                          if(Data.totalincome>=500000.00  && Data.totalincome<1000000.00  && Data.level==3  ){
                                            Incomelevel=3;
                                            income= 500000;
                                             old_flag=1;
                                              royality_name='Platinum';
                                           
                                        }
                                        
                                         if(Data.totalincome>=1000000.00  && Data.totalincome<2000000.00  && Data.level==4  ){
                                            Incomelevel=4;
                                            income= 1000000;
                                             old_flag=1;
                                             royality_name='Diamond';
                                        }
                                        
                                         if(Data.totalincome>=2000000.00  && Data.totalincome<4000000.00  && Data.level==5  ){
                                            Incomelevel=5;
                                            income= 2000000;
                                             old_flag=1;
                                            royality_name='Double Diamond';
                                           
                                        }
                                         if(Data.totalincome>=4000000.00  && Data.level==6  ){
                                            Incomelevel=6;
                                            income= 4000000;
                                             old_flag=1;
                                             royality_name='Ambassdor';
                                           
                                        }
                                        
                                           
                                       
                                           
                                             
                                             if(old_flag==1){
                                                 
                                                 
                                                  let refObj={
                                                user_id:Data.ref_userid,
                                                level:Incomelevel,
                                                total_income:income,
                                                 old_flag:old_flag,
                                                  royality_name:royality_name
                                             };
                                             
                                             const found=await this.db.RoyalityIncome.getCount(Data.ref_userid,Incomelevel);
                                             
                                             if(found==0){
                                                 console.log(`test income ${JSON.stringify(refObj)  }`);
                                                  await this.db.RoyalityIncome.insertData(refObj,{ transaction: transaction});
                                                  
                                             }else{
                                                 
                                                    const currentDate = new Date();
                                                    const formattedDate = currentDate.toLocaleString();
                                                    let Obj={
                                                      
                                                         total_income:income,
                                                         level:Incomelevel,
                                                         old_flag:old_flag,
                                                         updated_on:formattedDate,
                                                         royality_name:royality_name
                                                        
                                                     };
                                             
                                             
                                             
                                                 await this.db.RoyalityIncome.updateData(Obj,Data.ref_userid,Incomelevel,{ transaction: transaction});
                                                 
                                             }
                                                 
                                                  let Objs={
                                                      
                                                         status:1
                                                        
                                                     };
                                                 
                                                   await this.db.RoyalityPrime.updateData(Objs,Data.ref_userid,Data.level,{ transaction: transaction});
                                             }
                                             
                                            
                           successFlag=true;          
                                    
                     }
            await transaction.commit();
            
                 if(successFlag){
                
                         return res.status(200).json({ status: 200, message: 'success', data: [] });
                    }else{
                        
                        return res.status(500).json({ status: 500, message: 'Error', data: [] });
                    }
                    
                         
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
                return res.status(500).json({ status: 500, message: 'Error', data:error.message });
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in referalids job :', err);
        }
    }
    
    
    
    
      async updateRoyalityStatus(req, res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const {user_id} = decryptedObject;
        
            
            const requiredKeys = Object.keys({ user_id });
                  
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
        
            try {
        
               
                
                const updatedStatus = await this.db.RoyalityIncome.update(
                    { is_transfer:0},
                    { where: { user_id:user_id} }
                );
                            
                if (updatedStatus) {
                    
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Royality Stopped Successful' })));
                } else {
                    
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data' })));
                }
                        
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
                }
                
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message:error.message, data:[] })));
            }
        }
 
 
         async RoyalityReport(req, res) {
             
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const {from_date,to_date} = decryptedObject;
        
            
           
        
            try {
        
                let whereclause='';
                
               if(to_date){
                   whereclause=`where t.entry_date  between '${from_date}' and  '${to_date}'`;
               }
                
                 const [results, metadatas]  = await this.db.sequelize.query(`
                                                                     SELECT 
                                                                        t.entry_date, 
                                                                        t.credit_per_person, 
                                                                        t.details, 
                                                                        t.royalty, 
                                                                        t.total_credit_user,
                                                                        t2.total_active_users,
                                                                        t2.total_drop_users
                                                                    FROM (
                                                                        SELECT 
                                                                            cast(i.created_on as date) as entry_date, 
                                                                            min(credit) as credit_per_person, 
                                                                            details, 
                                                                            CASE 
                                                                                WHEN sub_type = 'Gold ( Gold Income )' THEN 'Gold'
                                                                        		 WHEN sub_type = 'Silver ( Silver Income )' THEN 'Silver'
                                                                                  WHEN sub_type = 'Platinum ( Platinum Income )' THEN 'Platinum'
                                                                                ELSE sub_type
                                                                            END AS royalty, 
                                                                            COUNT(i.user_id) AS total_credit_user
                                                                        FROM  trans_referral_income i 
                                                                        WHERE 
                                                                            tran_for = 'Royality' 
                                                                        GROUP BY 
                                                                            cast(i.created_on as date), 
                                                                            details, 
                                                                            sub_type
                                                                    ) AS t
                                                                    LEFT JOIN (
                                                                        SELECT 
                                                                             royality_name,
                                                                         COUNT(CASE WHEN is_transfer = 1 THEN user_id END) AS total_active_users,
                                                                        COUNT(CASE WHEN is_transfer = 0 THEN user_id END) AS total_drop_users
                                                                        FROM 
                                                                            trans_royality_income
                                                                        group by royality_name
                                                                       
                                                                    ) AS t2
                                                                    ON t.royalty = t2.royality_name
                                                                    ${whereclause}
                                                                    ORDER BY 
                                                                        t.entry_date DESC
                                                            `, {
                                                              raw: false,
                                                            });
                            
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Royality Report',data:results })));
                        
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
                }
                
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message:error.message, data:[] })));
            }
        }
 
}

module.exports = new Royality();