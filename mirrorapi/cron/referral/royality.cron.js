const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const utility = require('../../utility/utility');


class cronJobRoyality {
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async Royality() {
        
       
        
        try {
            
           
            
                const [resultslevel, metadatas]  = await this.db.sequelize.query(`
                                                              SELECT sum(amount) as totalincome,ref_userid,level from trans_royality_prime where status=0 
                                                              and level >=1 and level <=6  group by ref_userid,level
                                                            `, {
                                                              raw: false,
                                                            });
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
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
                                        //   if(Data.totalincome>=100000.00  && Data.totalincome<200000.00  && Data.level==2 ){
                                        //     Incomelevel=2;
                                        //     income= 100000;
                                        //      old_flag=1;
                                        //      royality_name='Mobile Fund';
                                           
                                        // }
                                        //  if(Data.totalincome>=200000.00  && Data.totalincome<500000.00  && Data.level==2 ){
                                        //     Incomelevel=2;
                                        //     income= 200000;
                                        //      old_flag=1;
                                        //      royality_name='Gold';
                                           
                                        // }
                                        //   if(Data.totalincome>=500000.00  && Data.totalincome<1000000.00  && Data.level==3  ){
                                        //     Incomelevel=3;
                                        //     income= 500000;
                                        //      old_flag=1;
                                        //       royality_name='Platinum';
                                           
                                        // }
                                        
                                        //  if(Data.totalincome>=1000000.00  && Data.totalincome<2000000.00  && Data.level==4  ){
                                        //     Incomelevel=4;
                                        //     income= 1000000;
                                        //      old_flag=1;
                                        //      royality_name='Diamond';
                                        // }
                                        
                                        //  if(Data.totalincome>=2000000.00  && Data.totalincome<4000000.00  && Data.level==5  ){
                                        //     Incomelevel=5;
                                        //     income= 2000000;
                                        //      old_flag=1;
                                        //     royality_name='Double Diamond';
                                           
                                        // }
                                        //  if(Data.totalincome>=4000000.00  && Data.level==6  ){
                                        //     Incomelevel=6;
                                        //     income= 4000000;
                                        //      old_flag=1;
                                        //      royality_name='Ambassdor';
                                           
                                        // }
                                        
                                           
                                       
                                           
                                             
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
            console.error('Error in referalids job :', err);
        }
    }
    
    
     async ActiveRoyalityUser() {
        
       
        
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            const year = currentDate.getFullYear();
            
            const yesterdayDate = `${year}-${month}-${day}`;
            
            
        
     
     
            try {
                
                                    await this.db.RoyalityIncome.updateMany();
                                    
                                    

                                     const [resultslevel, metadatas]  = await this.db.sequelize.query(`
                                                                        SELECT user_id
                                                                        FROM (
                                                                        SELECT 
                                                                        SUM(CASE WHEN task_count >= subquery.target_count THEN 1 ELSE 0 END) AS total_tasks,
                                                                        subquery.user_id AS user_id
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
                                                                        t.task_id > 1 
                                                                        AND   cast(task_date  as date) ='${yesterdayDate}'
                                                                        
                                                                        GROUP BY 
                                                                        t.task_id, t.user_id
                                                                        ) AS subquery
                                                                        GROUP BY  
                                                                        subquery.user_id
                                                                        HAVING 
                                                                        CASE 
                                                                        WHEN total_tasks >= 3 THEN 100 
                                                                        ELSE (total_tasks / 3.0) * 100
                                                                        END = 100
                                                                        
                                                                        UNION
                                                                        
                                                                        SELECT 
                                                                        p.ref_userid AS user_id,
                                                                        NULL AS task
                                                                        FROM 
                                                                        trans_royality_income t 
                                                                        JOIN 
                                                                        tbl_referral_idslevel  p ON p.ref_userid = t.user_id 
                                                                        WHERE 
                                                                        p.level = 1
                                                                        AND  cast(p.created_on  as date) ='${yesterdayDate}'
                                                                        and t.is_transfer=1
                                                                        ) AS combined_results order by user_id asc
                                                            `, {
                                                              raw: false,
                                                            });
                                    
                                     for (const IncData of resultslevel) {
                                         
                                         
                                           
                                                    let Obj={
                                                      
                                                        is_active:1
                                                        
                                                     };
                                             
                                                 await this.db.RoyalityIncome.updateUser(Obj,IncData.user_id);
                                             
                                            
                                     }
                                    
                     
          
                         
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in updating royality table income:', error);
            
                throw error;
              }
            
            
     
        
        
    }
    
    
    
    
    
            async SilverRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=1
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
            
            
            
            async GoldRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=2
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
              async CarFundRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=3
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
            
              async PlatinumRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=4
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
            
               async DiamondRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=7
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
            
               async MobileFundRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=19
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
              async HouseFundRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=6
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
            
              async TravelFundRankRoyalityCategory() {
          
            const transaction =await this.db.sequelize.transaction();
            
            try {
            
            const currentDate = new Date();
            
            currentDate.setDate(currentDate.getDate() - 1);
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const month = monthNames[monthIndex];
            const year = currentDate.getFullYear();
            const cmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
           
            
            const yesterdayDate = `${day} ${month} ${year}`;
            const yesterdayLogDate = `${year}-${cmonth}-${day}`;
            
            
            
           const getTodayAmount=await this.db.CompanyPortfolio.getTodayAmount(yesterdayLogDate);
            const getTodayTotalIds=await this.db.CompanyPortfolio.getTodayTotalIds(yesterdayLogDate);
            
             
        
            
            if(getTodayTotalIds>0){
                
               
            
           // select m.rank,r.user_id,m.id as rank_id from mst_rank_royality m left join trans_royality_income r ON r.level = m.level 
           // AND r.total_income >= m.target join tbl_app_users uu on uu.id=r.user_id ORDER BY m.target DESC
            
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
                                        WHERE uu.status=1  and m.id=13
                                        ORDER BY m.category 
                                    `, {
                                    raw: false,
                                    });
            
            
                                    
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
                    
                     /* try{
                       
                       
                      const generateorder = await this.db.upi_order.insertData(orderData);
                     
                    
                   // const generateorder = await this.db.upi_order.insertData(orderData,{ transaction: transaction });
                    //const IncomeResult = await this.db.ReferralIncome.insert_income(transactionData,{ transaction: transaction });
                    
                   // successFlag = true;
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
            
            
            }
            
            
            
            } catch (err) {
                
                console.error('Error in updating tables:', error);
                
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction royality category rolled back');
               // throw error;
                
                 console.error('Error in  job :', err);
            }
            
            
            }
            
    
}

module.exports = new cronJobRoyality();
