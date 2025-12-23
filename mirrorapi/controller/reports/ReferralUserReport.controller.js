const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class ReferralUserReport {
  db = {};

  constructor() {
    this.db = connect();
  }

  async primeUser(req, res) {

    // const { user_id,startdate,enddate } = req;
     let { from_date, to_date} = req;


    try {
        
        const today = new Date();
        if (!from_date) {
          const startOfToday = new Date(today);
          startOfToday.setHours(0, 0, 0, 0);
          from_date = startOfToday;
        } else {
          from_date = new Date(from_date);
        }

        if (!to_date) {
          const endOfToday = new Date(today);
          endOfToday.setHours(23, 59, 59, 999);
          to_date = endOfToday;
        } else {
          to_date = new Date(to_date);
          to_date.setHours(23, 59, 59, 999); // Ensure full end of day
        }
       
        let whereCondition ;

            const startDate =new Date(from_date);
            const endDate =new Date(to_date);
            endDate.setHours(23, 59, 59);
  
            whereCondition = {
  
                'created_on': {
                  [Op.between]: [startDate, endDate]
                },
            }
        console.log("whereCondition primereport",whereCondition);

         const results = await this.db.primeUserReport.getAllData(whereCondition);
         
         const report={
              total_count : await this.db.primeUserReport.count({ where: {...whereCondition} },'id'),
              total_prime : await this.db.primeUserReport.count( { where:{ ...whereCondition, plan_id:`3` } }),
              total_primeB : await this.db.primeUserReport.count({ where:{ ...whereCondition, plan_id:`4` } }),
              total_hybrid : await this.db.primeUserReport.count({ where:{ ...whereCondition, plan_id:`1` } }),
              total_booster : await this.db.primeUserReport.count({ where:{ ...whereCondition, plan_id:`2` } }),
        }

        if(results !==null){
            return res.status(200).json({ status: 200, message:'Successful', data: results, report });
        }
    
        return res.status(400).json({ status: 400, message:'Record not found',data:[] });
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
    }
  }
  
 
  
  
  
  async  primeIncomeDistribution(req, res) {

    const { sender_id } = req;

    try {
         
       
          let whereCondition ;

          // const startDate =new Date(from_date);
          // const endDate =new Date(to_date);
          // endDate.setHours(23, 59, 59);

          whereCondition = {
             
              'sender_id': sender_id,
              'sub_type': {
                [Op.notIn]: ['Cycle Income']
              },
              
              
          }


        const results = await this.db.distributionReport.getAllData(whereCondition);

        if(results !==null){
            return res.status(200).json({ status: 200, message:'Successful', data: results });
        }
    
        return res.status(400).json({ status: 400, message:'Record not found',data:[] });
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
    }
  }



//   async  userIncomeReport_old(req, res) {

//     const { user_id ,startdate , enddate} = req;

//     try {
         
        
         
        
         
//         let whereClause='';
//         if (user_id > 0) {
//             whereClause += ` AND r.user_id = ${user_id} `;
//         }
        
//         if (startdate && enddate) {
//             whereClause += ` AND  cast(r.created_on as date)  BETWEEN '${startdate}' AND '${enddate}' `;
//         }
         
       
//         const [results, metadata] =await this.db.sequelize.query(`select u.created_on as registration_date,u.username,
//         CONCAT(u.first_name, ' ', u.last_name) AS name,u.mlm_id,u.mobile,u.email,r.transaction_id,r.type,r.sub_type,
//         r.opening_balance,r.credit,r.debit,r.closing_balance,r.tran_for,r.created_on AS income_date,
//         r.details,r.level,p.plan_name
//         from trans_referral_income r join  tbl_app_users u on u.id=r.user_id
//         join mst_recharge_cashback_plan p on p.id=r.plan_id  where 1=1 ${whereClause} `);
        
//         const results = await this.db.incomeReport.getAllData();

//         if(results !==null){
//             return res.status(200).json({ status: 200, message:'Successful', data: results });
//         }
    
//         return res.status(400).json({ status: 400, message:'Record not found',data:[] });
//     } catch (error) {
//         logger.error(`Unable to find user: ${error}`);
//         if (error.name === 'SequelizeValidationError') {
//           const validationErrors = error.errors.map((err) => err.message);
//           return res.status(500).json({ status: 500,errors: validationErrors });
//         }
			
//         return res.status(500).json({ status: 500,  message: error ,data:[]});
//     }
//   }
  
  
      
      async  userIncomeReport(req, res) {
    
            const { from_date, to_date} = req;
          
            try {
    
    
              let whereCondition ;
    
              const startDate =new Date(from_date);
              const endDate =new Date(to_date);
              endDate.setHours(23, 59, 59);
    
              whereCondition = {
    
                  'created_on': {
                    [Op.between]: [startDate, endDate]
                  },
              }
              
             const report={
                    total_count : await this.db.incomeReport.count({ where: {...whereCondition} }),
                    total_incomeCount : await this.db.incomeReport.count( {  where:{ ...whereCondition, type:'Credit', status: 1} }  ),
                    total_repurchaseCount : await this.db.incomeReport.count({  where:{ ...whereCondition, tran_for:'Repurchase', type:'Credit', status: 1 } }),
                    total_RedeemCount : await this.db.Redeem.count({  where:{ ...whereCondition, status : 1} } ),
                    total_affiliateToWallet : await this.db.affiliateToWallet.count({  where:{ ...whereCondition, status:1}})
                }
    
            const results = await this.db.incomeReport.getAllData(whereCondition);
    
            if(results !==null){
                return res.status(200).json({ status: 200, message:'Successful', data: results, report });
            }
        
            return res.status(400).json({ status: 400, message:'Record not found',data:[] });
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
    			
            return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
      }

  
  
  
  async  team_details(req, res) {
      
      const decryptedObject = utility.DataDecrypt(req.encReq);
      
      const {user_id,plan_id}=decryptedObject;
      
       try {
        let whereclause='';
        
        if(user_id>0){
            
            whereclause+= `where ref_userid=${user_id}`;
        }
          let whereclausePlan='';
           let wherePlanPurchase='';
         if(user_id>0 && (plan_id>0 || plan_id==0 ) &&  plan_id!=null ){
            
          
            
            if(plan_id>0){
                whereclausePlan= `where  id=${plan_id}`;
                wherePlanPurchase= `where  plan_id=${plan_id}`;
                
                if(plan_id==1){
                    
                    
                      whereclause+= ` and l.level<=10`;
                }
                
                 if(plan_id==2){
                    
                    
                      whereclause+= ` and l.level<=25`;
                }
                 if(plan_id==3){
                    
                    
                      whereclause+= ` and l.level<=15`;
                }
                 if(plan_id==4){
                    
                    
                      whereclause+= ` and l.level<=15`;
                }
                
                
                
            }
            
        }
      
         const [results, metadata] =await this.db.sequelize.query(`SELECT
                                        total_member,
                                        total_active,
                                        total_inactive,
                                        total_earning,
                                        total_withdrawal,
                                        total_repurchase_income,
                                        total_gold_income,
                                        total_silver_income,
                                        Platinum,
                                        total_diamond_income,
                                        total_ambassador_income,
                                        total_carfund_income,
                                        total_travelfund_income,
                                        total_Communityfund_income,
                                        total_DoubleDiamond_income,
                                        total_housefund_income,
                                        total_mobilefund_income,
                                        hybrid,
                                        booste,
                                        prime_a,
                                        prime_b
                                    FROM (
                                        SELECT
                                            COUNT(l.id) AS total_member,
                                            COALESCE((earning.credit), 0) AS total_earning,
                                            COALESCE((withdrawal.debit), 0) AS total_withdrawal,
                                            COALESCE((earning.repurchase_income), 0) AS total_repurchase_income,
                                            COALESCE((earning.gold_income), 0) AS total_gold_income,
                                            COALESCE((earning.silver_income), 0) AS total_silver_income,
                                            COALESCE((earning.platinum_income), 0) AS Platinum,
                                            COALESCE((earning.diamond_income), 0) AS total_diamond_income,
                                            COALESCE((earning.ambassador_income), 0) AS total_ambassador_income,
                                            COALESCE((earning.carfund_income), 0) AS total_carfund_income,
                                            COALESCE((earning.travelfund_income), 0) AS total_travelfund_income,
                                            COALESCE((earning.Communityfund_income), 0) AS total_Communityfund_income,
                                            COALESCE((earning.DoubleDiamond_income), 0) AS total_DoubleDiamond_income,
                                            COALESCE((earning.house_income), 0) AS total_housefund_income,
                                            COALESCE((earning.mobilefund_income), 0) AS total_mobilefund_income,
                                            
                                            
                                            
                                        
                                             
                                             COUNT(CASE WHEN p.id > 0 THEN 1 ELSE NULL END) AS total_active,
                                             COUNT(case when p.user_id is null then 1 else 0 end) - count(case when p.user_id>0 and p.plan_id=3 then 1 else null end) AS total_inactive,
                                             COUNT(CASE WHEN p.plan_id=1 THEN p.id ELSE NULL END) AS hybrid,
                                             COUNT(CASE WHEN p.plan_id=2 THEN p.id ELSE NULL END) AS booste,
                                             COUNT(CASE WHEN p.plan_id=3 THEN p.id ELSE NULL END) AS prime_a,
                                             COUNT(CASE WHEN p.plan_id=4 THEN p.id ELSE NULL END) AS prime_b
                                      
                                            
                                        FROM
                                            tbl_referral_idslevel l
                                            LEFT JOIN  
                                             (
                                                    select * from  tbl_plan_purchase
                                                     ${wherePlanPurchase}
                                              )
                                                 
                                                 p ON l.user_id = p.user_id
                                                 
                                            LEFT JOIN 
                                             
                                              (
                                                    select * from  mst_recharge_cashback_plan
                                                     ${whereclausePlan}
                                              )
                                            mp ON mp.id = p.plan_id
                                            LEFT JOIN (
                                                SELECT user_id, SUM(credit) AS credit,
                                                SUM(CASE WHEN tran_for = 'Repurchase'   THEN credit ELSE 0 END) AS repurchase_income,
                                                SUM(CASE WHEN tran_for = 'Royality' and sub_type like '%Gold ( Gold Income )%'  THEN credit ELSE 0 END) AS gold_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type like '%Silver ( Silver Income )%' THEN credit ELSE 0 END) AS silver_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type like  '%Diamond ( Diamond Income )%'  THEN credit ELSE 0 END) AS diamond_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type like '%Platinum ( Platinum Income )%' THEN credit ELSE 0 END) AS platinum_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Ambassdor ( Ambassdor Income )%' THEN credit ELSE 0 END) AS ambassador_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Car Fund%' THEN credit ELSE 0 END) AS carfund_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%House Fund%' THEN credit ELSE 0 END) AS house_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Travel Fund%' THEN credit ELSE 0 END) AS travelfund_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Community Fund%' THEN credit ELSE 0 END) AS Communityfund_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Double Diamond ( Double Diamond Income )%' THEN credit ELSE 0 END) AS DoubleDiamond_income,
                                                SUM(CASE WHEN tran_for = 'Royality'  and sub_type  like  '%Mobile Fund%' THEN credit ELSE 0 END) AS mobilefund_income
                                                
                                                
                                                
                                                  
                                                FROM trans_referral_income
                                                WHERE status = 1
                                                GROUP BY user_id
                                            ) AS earning ON l.ref_userid = earning.user_id
                                            LEFT JOIN (
                                                SELECT user_id, SUM(debit) AS debit
                                                FROM trans_referral_income
                                                WHERE status = 1
                                                GROUP BY user_id
                                            ) AS withdrawal ON l.ref_userid = withdrawal.user_id
                                        
                                        ${whereclause}
                                    ) AS aggregated_data          
                                `);
          
          
          let resultslevel=[];
          let metadatas=[];
          let resultslevelteam=[];
          let metadatasteam=[];
          
         if(user_id>0 && (plan_id>0 || plan_id==0)  &&  plan_id!=null ){
              
                if(plan_id>0 ){
                        /*[resultslevel, metadatas]  = await this.db.sequelize.query(`
                          SELECT
                            COUNT(CASE WHEN p.id > 0 AND l.level IS NOT NULL and  l.level = mst.level THEN 1 END) AS total_active,
                            COUNT(CASE WHEN p.id IS NULL AND l.level IS  NULL THEN 1 END) AS total_inactive,
                            COUNT(mst.level) AS levelcount,
                            mst.level
                        FROM
                            mst_plan_level_amount mst
                        LEFT JOIN tbl_plan_purchase p ON mst.plan_id = p.plan_id
                        LEFT JOIN tbl_referral_idslevel l ON l.user_id = p.user_id 
                        LEFT JOIN mst_recharge_cashback_plan mp ON mp.id = p.plan_id
                        
                          ${whereclause} 
                          
                        GROUP BY
                            mst.level
                        ORDER BY
                            mst.level
                        `, {
                          raw: false,
                        });*/
                        
                        
                        let whereclausetesm='';
                        whereclausetesm+= `where ref_userid=${user_id} `;
                        
                        /*if(plan_id==3){
                            
                             whereclausetesm+=`and p.plan_id=${plan_id}`;
                        }*/
                        /*and mst.plan_id=${plan_id} and 
                         [resultslevel, metadatas]  = await this.db.sequelize.query(`
                         SELECT COUNT(CASE WHEN p.id > 0 AND l.level IS NOT NULL and  l.level = mst.level THEN 1 END) AS total_active,
                            COUNT(CASE WHEN p.id IS NULL AND l.level IS  NULL THEN 1 END) AS total_inactive,
                            COUNT(l.level) AS levelcount, mst.level FROM mst_plan_level_amount mst LEFT JOIN tbl_referral_idslevel l ON l.level =mst.level 
                         left JOIN tbl_plan_purchase p ON l.user_id = p.user_id 
                         ${whereclausetesm} GROUP BY l.level ORDER BY l.level
                        `, {
                          raw: false,
                        });*/
                        
                        [resultslevel, metadatas]  = await this.db.sequelize.query(`
                          SELECT mst.level,count(case when p.user_id>0 and p.plan_id=${plan_id} then 1 else null end) as total_active ,
                          case 
                             when count(case when p.user_id is null then 1 else 0 end) =1
                            then 0
                            else count(case when p.user_id is null then 1 else 0 end) - count(case when p.user_id>0 and p.plan_id=${plan_id} then 1 else null end) 
                            end as total_inactive,
                          COUNT(l.level) AS levelcount 
                        from  mst_plan_level_amount mst   left join   (  select * from  tbl_referral_idslevel   ${whereclausetesm}   ) l 
                         on l.level=mst.level left join tbl_plan_purchase p on p.user_id=l.user_id  
                         where mst.plan_id=${plan_id}
                        group by level  
                        ORDER BY level
                        `, {
                          raw: false,
                        });
                        
                       
                  
                }else{
                    
                     whereclause+= ` and l.level is not NULL`;
                    
                     [resultslevel, metadatas]  = await this.db.sequelize.query(`
                          SELECT
                             COUNT(CASE WHEN p.id > 0 THEN 1 ELSE NULL END) AS total_active,
                             COUNT(CASE WHEN p.id IS NULL THEN 1 ELSE NULL END) AS total_inactive,
                            COUNT(l.level) AS levelcount,  l.level
                          FROM
                            tbl_referral_idslevel AS l
                            LEFT JOIN tbl_plan_purchase p ON l.user_id = p.user_id
                            LEFT JOIN mst_recharge_cashback_plan mp ON mp.id = p.plan_id
                          
                          ${whereclause}
                         GROUP BY l.level
                          ORDER BY l.level
                        `, {
                          raw: false,
                        });
                }
                
              
                        
                        
                        


          }
         
         
         
           const [resultsrank, metadatasrank]  = await this.db.sequelize.query(`
                          ( SELECT COALESCE(
                            (SELECT m.category FROM mst_rank_royality_category m LEFT JOIN trans_royality_income r ON r.level = m.level 
                            AND r.total_income >= m.target_amt
                                WHERE user_id =${user_id}
                                ORDER BY m.target_amt DESC
                                LIMIT 1
                             ),'No Rank') as user_rank ) 
                        `, {
                          raw: false,
                        });
                        
            
        

           const responsedata = { status: 200, message:'Successful', data: results,leveldata:resultslevel,planlevel:resultslevelteam,rank:resultsrank };
          const encData = utility.DataEncrypt(JSON.stringify(responsedata));
           return res.status(200).json(encData);

     
    
        return res.status(400).json({ status: 400, message:'Record not found',data:[] });
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  
  }
  
  
  
  
  
  
  
  
  async  team_level_details(req, res) {
      
      const decryptedObject = utility.DataDecrypt(req.encReq);
      
      const {user_id,level,page,teamType}=decryptedObject;
     // decryptedObject;
      
       try {
           
        //and l.status=1 and u.status=1
        let whereclause= `where ref_userid=${user_id}   `;
        if(teamType>0){
            //whereclause +=` and p.plan_id=${teamType}`;
            
        }
        
         const pages = parseInt(page) || 1;
         const limit = 10; 
		const offset = (pages - 1) * limit; 
		let joinSql='';
		let planWhere='';
		if(teamType >0){
		   // joinSql+=`join ( select distinct user_id from tbl_plan_purchase where plan_id ={$teamType} ) pr on pr.user_id=u.id `;
		   
		   planWhere=`and p.plan_id=${teamType}`;
		     if(teamType==1){
                    
                    
                      whereclause+= ` and l.level<=10`;
                      whereclause+= ` and  plan_id=${teamType} and level=${level} `;
                }
                
                 if(teamType==2){
                    
                    
                      whereclause+= ` and l.level<=25`;
                      whereclause+= ` and  plan_id=${teamType} and level=${level} `;
                }
                 if(teamType==3){
                    
                    
                      whereclause+= ` and l.level<=15`;
                      whereclause+= ` and   level=${level} `;
                }
                 if(teamType==4){
                    
                    
                      whereclause+= ` and l.level<=15`;
                      whereclause+= ` and  plan_id=${teamType} and level=${level} `;
                }
		        
		         
		        
		    
		}
		/*if(teamType=='Inactive'){
		    
		    joinSql+=`  left join (     SELECT
                                          user_id,
                                          GROUP_CONCAT(DISTINCT plan_id) AS all_plan_ids
                                        FROM
                                          tbl_plan_purchase
                                      
                                        GROUP BY
                                          user_id
                                  ) pr on pr.user_id=u.id 
                             
                                 `;
            
		   whereclause+=` and (pr.user_id is NULL  OR  NOT FIND_IN_SET(3, pr.all_plan_ids) AND NOT FIND_IN_SET(4, pr.all_plan_ids) ) `;
		    
		    
		}*/
      
         const [results, metadata] =await this.db.sequelize.query(`SELECT
                                        u.id as user_id,
                                        u.mlm_id,CONCAT(first_name,' ',last_name) as name,email,mobile,address,cast(u.created_on as date) as joining_date,
                                        c.name as city,
                                        
                                        (   SELECT GROUP_CONCAT(CONCAT(plan_name, ' - ', cast(p.created_on as date) ) SEPARATOR ', ')
                                            FROM tbl_plan_purchase p join mst_recharge_cashback_plan mp on mp.id=p.plan_id
                                            WHERE p.user_id = u.id  
                                        ) as plan,
                                        (   SELECT count(*)
                                            FROM tbl_referral_idslevel ul
                                            WHERE l.user_id =ul.ref_userid and level =${level} and ul.status=1
                                        ) as team_size,
                                         (   SELECT count(*)
                                            FROM tbl_referral_idslevel ul
                                            join tbl_plan_purchase ps on ps.user_id=ul.user_id 
                                            WHERE l.user_id =ul.ref_userid and level =${level} and ul.status=1
                                        ) as active_prime_member,
                                        
                                       ( SELECT COALESCE(
                                        (SELECT m.rank 
                                            FROM mst_rank_royality_category m
                                            LEFT JOIN trans_royality_income r ON r.level = m.level AND r.total_income >= m.target_amt
                                            WHERE user_id =u.id
                                            ORDER BY m.target_amt DESC
                                            LIMIT 1
                                         ),'No Rank')  ) as user_rank
                                        
                                        
                                        
                                        
                                        FROM
                                            tbl_referral_idslevel l
                                            join  tbl_app_users u on l.user_id=u.id
                                            left join tbl_plan_purchase p on p.user_id=l.user_id
                                            left join mst_cities  c   on u.city_id=c.id
                                     
                                        ${whereclause} order by cast(u.created_on as date) desc LIMIT :limit OFFSET :offset`,
                                        {
                                            
				                        replacements:{ limit,offset },
                                          
                                        });
          
          const responsedata = { status: 200, message:'Successful', data: results };
          const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(encData);

            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
        			
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
  
    }
    
    
  
        
      async  companyportfolio(req, res) {
    
        
          
            try {
                
                
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            const formattedMonth = `${year}${month}`;
            
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = currentDate.getMonth();
            const CurrentMonth = monthNames[monthIndex];
            
            let Silver=0;
            let  Gold=0;
            let Platinum=0;
            let Diamond=0;
            let DoubleDiamond=0;
            let Ambassador=0;
            let CarFund=0;
            let HouseFund=0;
            let TravelFund=0;
            let ComunityFund=0;
            let Mobilefund=0;
            
        
           Silver=await this.db.ReferralIncome.getSilverSumAmount(CurrentMonth,year);
           Mobilefund=await this.db.ReferralIncome.getMobilerSumAmount(CurrentMonth,year);
           Gold=await this.db.ReferralIncome.getGoldSumAmount(CurrentMonth,year);
            Platinum=await this.db.ReferralIncome.getPlatinumSumAmount(CurrentMonth,year);
            Diamond=await this.db.ReferralIncome.getDiamondSumAmount(CurrentMonth,year);
            CarFund=await this.db.ReferralIncome.getCarFundSumAmount(CurrentMonth,year);
            HouseFund=await this.db.ReferralIncome.getHouseFundSumAmount(CurrentMonth,year);
            TravelFund=await this.db.ReferralIncome.getTravelFundSumAmount(CurrentMonth,year);
            ComunityFund=await this.db.ReferralIncome.getCommunityFundSumAmount(CurrentMonth,year);
            DoubleDiamond=await this.db.ReferralIncome.getDoubleDiamondSumAmount(CurrentMonth,year);
            Ambassador=await this.db.ReferralIncome.getAmbassdorSumAmount(CurrentMonth,year);

            
            
            
            


           const [todayBussiness, metadatas]  = await this.db.sequelize.query(`
                         SELECT 
                         COUNT(CASE WHEN p.plan_id=1 THEN p.id ELSE NULL END) AS hybrid,
                         COUNT(CASE WHEN p.plan_id=2 THEN p.id ELSE NULL END) AS booster,
                        COUNT(CASE WHEN p.plan_id=3 THEN p.id ELSE NULL END) AS prime_a,
                        COUNT(CASE WHEN p.plan_id=4 THEN p.id ELSE NULL END) AS prime_b
                        FROM tbl_plan_purchase p where  cast(created_on as date)='${formattedDate}'
                        `, {
                          raw: false,
                        });
            
             const [MonthlyPlanBussiness, Mplanmetadatas]  = await this.db.sequelize.query(`
                         SELECT 
                         COUNT(CASE WHEN p.plan_id=1 THEN p.id ELSE NULL END) AS hybrid,
                         COUNT(CASE WHEN p.plan_id=2 THEN p.id ELSE NULL END) AS booster,
                        COUNT(CASE WHEN p.plan_id=3 THEN p.id ELSE NULL END) AS prime_a,
                        COUNT(CASE WHEN p.plan_id=4 THEN p.id ELSE NULL END) AS prime_b
                        FROM tbl_plan_purchase p where  EXTRACT(YEAR_MONTH FROM created_on)='${formattedMonth}'
                        `, {
                          raw: false,
                        });
                        
           
            
            
            
            
            if(todayBussiness !==null){
                return res.status(200).json({ status: 200, message:'Successful', todayBussiness: todayBussiness,MonthlyPlanBussiness ,
                    
                    Silver,
                    Gold,
                    Platinum,
                    Diamond,
                    DoubleDiamond,
                    Ambassador,
                    CarFund,
                    HouseFund,
                    TravelFund,
                    ComunityFund,
                    Mobilefund
                    
                });
            }
        
    
          
            return res.status(400).json({ status: 400, message:'Record not found',todayBussiness:[] , MonthlyPlanBussiness:[] ,    
                    Silver,
                    Gold,
                    Platinum,
                    Diamond,
                    DoubleDiamond,
                    Ambassador,
                    CarFund,
                    HouseFund,
                    TravelFund,
                    ComunityFund,
                    Mobilefund
                
            });
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
    			
            return res.status(500).json({ status: 500,  message: error ,todayBussiness:[] ,  MonthlyPlanBussiness:[],
                
                    Silver,
                    Gold,
                    Platinum,
                    Diamond,
                    DoubleDiamond,
                    Ambassador,
                    CarFund,
                    HouseFund,
                    TravelFund,
                    ComunityFund,
                    Mobilefund
                
            });
        }
      }


 async  userTargetRoyalityGraph(req, res) {
    
       
             const decryptedObject = utility.DataDecrypt(req.encReq);
      
             const {user_id}=decryptedObject;
          
            try {
                
            
                                       
                                     
                                     
                                          
           
           const [result, metadatas]  = await this.db.sequelize.query(`
SELECT
    m.category,
    m.rank,
    m.target_amt AS rank_achiever_amount,
    m.target_amt as target_achievver_amount,
    m.level,
    CASE
        WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.target_amt
        ELSE COALESCE(r.total_income, 0)
    END AS received_income,
    COALESCE(r.total_income, 0) as total,
    CASE
        WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.category
        ELSE 'No Rank'
    END AS rank_achiever_category,
    ROW_NUMBER() OVER (PARTITION BY m.level, m.target_amt ORDER BY m.target_amt DESC) AS row_num
FROM mst_rank_royality_category m
LEFT JOIN (
    SELECT 
        COALESCE(SUM(p.amount), 0) + COALESCE((pk.pk_amount), 0) AS total_income,
        rl.level
    FROM view_plan_packages p
    JOIN tbl_referral_idslevel rl ON p.user_id = rl.user_id
    LEFT JOIN (
    SELECT user_id, level, SUM(amount) AS pk_amount
    FROM tbl_package_purchase
    GROUP BY user_id, level
) pk ON pk.user_id = rl.ref_userid AND pk.level = rl.level

    WHERE rl.ref_userid = ${user_id}
      AND rl.level <= (
            CASE 
                WHEN (SELECT level FROM trans_royality_income WHERE user_id = ${user_id} ORDER BY level DESC LIMIT 1) IS NULL THEN 1
                ELSE (SELECT COALESCE(level, 0) + 1 FROM trans_royality_income WHERE user_id = ${user_id} ORDER BY level DESC LIMIT 1)
            END
               
            )
    GROUP BY rl.level
) r ON r.level = m.level order by m.level,m.target_amt
                           
                                        `, {
                                          raw: false,
                                        });           
           
          /*    -- AND CAST(p.created_on AS DATE) >= '2022-07-01' const [result, metadatas]  = await this.db.sequelize.query(`
                                        SELECT
                                        m.rank,m.target as rank_achievver_amount,m.level,
                                        COALESCE(r.total_income,0) as received_income,
                                        CASE
                                        WHEN r.total_income >= m.target THEN  m.rank
                                        ELSE  'No Rank'
                                        END   AS target_achievver_amount
                                        FROM
                                        mst_rank_royality m
                                        LEFT JOIN
                                        (
                                        
                                   
                                        SELECT
                                             sum(without_gst) as total_income,
                                             rpl.level
                                            FROM
                                                tbl_plan_purchase p
                                            JOIN
                                                mst_recharge_cashback_plan r ON r.id = p.plan_id
                                            LEFT JOIN
                                                trans_royality_prime rp ON rp.user_id = p.user_id AND rp.plan_id = p.plan_id AND rp.ref_userid =65624
                                            LEFT JOIN
                                                tbl_referral_idslevel rpl ON rpl.user_id = p.user_id
                                            WHERE
                                                rpl.ref_userid =65624 -- AND rpl.status = 1
                                                AND rp.user_id IS NULL
                                                AND CAST(p.created_on AS DATE) >= '2022-07-01'
                                           
                                                and rpl.level<=7
                                                group by  rpl.level 
                                        
                                        ) r ON r.level = m.level
                                        
                                        where m.status=1
                                        group by   m.rank,m.level,m.target order by m.target
                                        `, {
                                          raw: false,
                                        });
                                        
                                        SELECT
                                        m.category,
                                        m.rank,
                                        m.target_amt AS rank_achiever_amount,
                                        m.target_amt as target_achievver_amount,
                                        m.level,
                                        CASE
                                            WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.target_amt
                                            ELSE COALESCE(r.total_income, 0)
                                        END AS received_income,
                                        COALESCE(r.total_income, 0) as total,
                                        CASE
                                            WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.category
                                            ELSE 'No Rank'
                                        END AS rank_achiever_category,
                                        ROW_NUMBER() OVER (PARTITION BY m.level, m.target_amt ORDER BY m.target_amt DESC) AS row_num
                                    FROM mst_rank_royality_category m
                                    LEFT JOIN (
                                        SELECT 
                                            COALESCE(SUM(r.without_gst), 0) AS total_income,
                                            rl.level
                                        FROM 
                                        tbl_plan_purchase p
                                        JOIN mst_recharge_cashback_plan r ON r.id = p.plan_id
                                        JOIN tbl_referral_idslevel rl ON p.user_id = rl.user_id
                                        WHERE rl.ref_userid = ${user_id}
                                          AND rl.level <= (
                                                CASE 
                                                    WHEN (SELECT level FROM trans_royality_income WHERE user_id = ${user_id} ORDER BY level DESC LIMIT 1) IS NULL THEN 1
                                                    ELSE (SELECT COALESCE(level, 0) + 1 FROM trans_royality_income WHERE user_id = ${user_id} ORDER BY level DESC LIMIT 1)
                                                END
                                                   
                                                )
                                        GROUP BY rl.level
                                    ) r ON r.level = m.level order by m.level,m.target_amt
                                    */
            
         
            if(result !==null){
               
                    const responsedata = res.status(200).json({ status: 200, message:'Successful', data: result });
                    const encData = utility.DataEncrypt(JSON.stringify(responsedata));
                    return res.status(200).json(encData);
            }
        
    
          
            return res.status(400).json({ status: 400, message:'Record not found',data:[]  });
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
    			
            return res.status(500).json({ status: 500,  message: error ,data:[]  });
        }
      }
    
    
    
    
    async  TotalRankDistribution(req, res) {
    
             const decryptedObject = utility.DataDecrypt(req.encReq);
      
             const {rank, page}=decryptedObject;
           
          
            try {
             const pageSize = 20; 
             const offset = (page - 1) * pageSize;
            let result = [];
           if(rank !=null &&  rank !=undefined){
               
               
                result  = await this.db.sequelize.query(`
                                        SELECT u.mlm_id,CONCAT(first_name,' ',last_name) as name,email,mobile,
                                        u.district as address,cast(u.created_on as date) as joining_date,cast(r.created_on as date) as achive_date
                                        FROM   trans_royality_income  r  join mst_rank_royality_category m  
                                        ON r.level = m.level and r.total_income=m.target_amt 
                                        join  tbl_app_users u on r.user_id=u.id
                                        where m.category ='${rank}' and r.is_transfer=1 order by r.created_on desc LIMIT ${pageSize} OFFSET ${offset} 
                                        `, {
                                          raw: false,
                                          type: this.db.sequelize.QueryTypes.SELECT,
                                        });
               
           }else{

                const rankData = await this.db.RankRoyality.getAllTargetRank();
                const rankUserData = [];
        
                for (const data of rankData) {
                  const rank = data.rank; 
                  const resData = await this.db.sequelize.query(`
                    SELECT u.mlm_id, CONCAT(first_name, ' ', last_name) AS name, email, mobile,
                    u.district as address, CAST(u.created_on AS DATE) AS joining_date,cast(r.created_on as date) as achive_date
                    FROM trans_royality_income r
                    JOIN mst_rank_royality_category m ON r.level = m.level AND r.total_income = m.target_amt 
                    JOIN tbl_app_users u ON r.user_id = u.id
                    WHERE m.category = :rank  and r.is_transfer=1 order by r.created_on desc
                    LIMIT :pageSize OFFSET :offset
                  `, {
                    replacements: { rank, pageSize, offset }, // Pass replacements for rank, pageSize, and offset
                    type: this.db.sequelize.QueryTypes.SELECT, // Specify the query type as SELECT
                  });
                    
                    if(resData)
                    {
                        rankUserData.push({ [rank]: resData });
                    }
                  
                }
                result = rankUserData;
               
           }
           
           const all_total = await this.db.sequelize.query(`
                                        SELECT count(r.user_id ) as total_rank,m.category 
                                        FROM mst_rank_royality_category m 
                                        LEFT JOIN ( select * from trans_royality_income  where is_transfer=1 ) r ON r.level = m.level and r.total_income = m.target_amt 
                                        group by m.category,m.level,m.target_amt,m.rank_id having count(r.user_id)>0 order by m.rank_id asc 
                                        `, {
                                          raw: false,
                                          type: this.db.sequelize.QueryTypes.SELECT
                                        });
          
            
         
              if (result !== null) {
                const responseData = {
                  status: 200,
                  message: 'Successful',
                  data: result,
                  totalCount: all_total
                };

                const encData = utility.DataEncrypt(JSON.stringify(responseData));
                return res.status(200).json(encData);
              }
        
    
          
            return res.status(400).json({ status: 400, message:'Record not found',data:[]  });
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
    			
            return res.status(500).json({ status: 500,  message: error.message ,data:[]  });
        }
      }
      
      
      
      async today_referral_detail(req, res) {
      
          const decryptedObject = utility.DataDecrypt(req.encReq);
          
          const {user_id,page,type}=decryptedObject;
        
          const requiredKeys = Object.keys({ user_id,page,type });
                    
          if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }
          
           try {
               
              const pages = parseInt(page) || 1;
              const limit = 10; 
              const offset = (pages - 1) * limit; 
              let joinSql = '';
              let extraColumn = '';
              let whereClause = ' and cast(u.created_on as date)=CURRENT_DATE() ';
        
              if(type == 'Prime')
              {
                joinSql = 'join tbl_plan_purchase ps on ps.user_id=l.user_id';
                extraColumn = ',ps.plan_id,ps.amount ';
                whereClause = ' and cast(ps.created_on as date)=CURRENT_DATE() ';
              }
        
        
              const [results, metadata] =await this.db.sequelize.query(`SELECT 
                          u.mlm_id,CONCAT(first_name,' ',last_name) as name,email,mobile,address,cast(u.created_on as date) as joining_date,
                          c.name as city ${extraColumn}
                          from tbl_referral_idslevel l 
                          join tbl_app_users u on l.user_id=u.id
                          left join mst_cities  c  on u.city_id=c.id
                          ${joinSql}
                          where l.ref_userid=${user_id} and l.level=1 and l.status=1 and u.status=1  
                          ${whereClause}
                          LIMIT :limit OFFSET :offset`,
                          {
                            replacements:{ limit,offset },
                          });
        
              const teamCount = await this.db.ReferralIncome.getReferralDetailsCount(user_id, '', ' and cast(u.created_on as date)=CURRENT_DATE() ');
              const primeCount = await this.db.ReferralIncome.getReferralDetailsCount(user_id, 'join tbl_plan_purchase ps on ps.user_id=l.user_id', ' and cast(ps.created_on as date)=CURRENT_DATE() ');
              
              const responsedata = { status: 200, message:'Successful', data: results, teamCount: teamCount, primeCount:primeCount };
             const encData = utility.DataEncrypt(JSON.stringify(responsedata));
              return res.status(200).json(encData);
        
                } catch (error) {
                    logger.error(`Unable to find user: ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                      const validationErrors = error.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: validationErrors });
                    }
                  
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
        
        }
        
        
    async  random_team_level_details(req, res) {
      
      const decryptedObject = utility.DataDecrypt(req.encReq);
      
      const {user_id,level,page,teamType}=decryptedObject;
     //return decryptedObject;
      
       try {
           
        //and l.status=1 and u.status=1
        const getLavel = Math.floor(Math.random() * 10) + 1;
        let whereclause= `where ref_userid=${user_id} and l.level=${getLavel}`;
        if(teamType>0){
            //whereclause +=` and p.plan_id=${teamType}`;
            
        }
        
         const pages = parseInt(page) || 1;
         const limit = 10; 
		const offset = (pages - 1) * limit; 
		let joinSql='';
		let planWhere='';
// 		if(teamType >0){
// 		   // joinSql+=`join ( select distinct user_id from tbl_plan_purchase where plan_id ={$teamType} ) pr on pr.user_id=u.id `;
		   
// 		   planWhere=`and p.plan_id=${teamType}`;
// 		     if(teamType==1){
                    
                    
//                       whereclause+= ` and l.level<=10`;
//                       whereclause+= ` and  plan_id=${teamType} `;
//                 }
                
//                  if(teamType==2){
                    
                    
//                       whereclause+= ` and l.level<=25`;
//                       whereclause+= ` and  plan_id=${teamType} `;
//                 }
//                  if(teamType==3){
                    
                    
//                       whereclause+= ` and l.level<=7`;
//                 }
//                  if(teamType==4){
                    
                    
//                       whereclause+= ` and l.level<=10`;
//                       whereclause+= ` and  plan_id=${teamType} `;
//                 }
		        
		         
		        
		    
// 		}
      
         const [results, metadata] =await this.db.sequelize.query(`SELECT
                                        u.id as user_id,
                                        u.mlm_id,CONCAT(first_name,' ',last_name) as name,email,mobile,address,cast(u.created_on as date) as joining_date,
                                        c.name as city,
                                        
                                        (   SELECT GROUP_CONCAT(CONCAT(plan_name, ' - ', cast(p.created_on as date) ) SEPARATOR ', ')
                                            FROM tbl_plan_purchase p join mst_recharge_cashback_plan mp on mp.id=p.plan_id
                                            WHERE p.user_id = u.id  
                                        ) as plan,
                                        (   SELECT count(*)
                                            FROM tbl_referral_idslevel ul
                                            WHERE l.user_id =ul.ref_userid and ul.status=1 and ul.level=${getLavel}
                                        ) as team_size,
                                         (   SELECT count(*)
                                            FROM tbl_referral_idslevel ul
                                            join tbl_plan_purchase ps on ps.user_id=ul.user_id 
                                            WHERE l.user_id =ul.ref_userid and ul.status=1 and ul.level=${getLavel}
                                        ) as active_prime_member,
                                        
                                       ( SELECT COALESCE(
                                        (
                                            
                                            SELECT m.rank 
                                            FROM mst_rank_royality_category m
                                            LEFT JOIN trans_royality_income r ON r.level = m.level AND r.total_income >= m.target_amt
                                            WHERE user_id =u.id
                                            ORDER BY m.target_amt DESC
                                            LIMIT 1
                                            
                                         ),'No Rank')  ) as user_rank
                                        
                                        
                                        
                                        
                                        FROM
                                            tbl_referral_idslevel l
                                            join  tbl_app_users u on l.user_id=u.id
                                            left join tbl_plan_purchase p on p.user_id=l.user_id
                                            left join mst_cities  c   on u.city_id=c.id
                                     
                                        ${whereclause} order by RAND() LIMIT :limit OFFSET :offset`,
                                        {
                                            
				                        replacements:{ limit,offset },
                                          
                                        });
          
          const responsedata = { status: 200, message:'Successful', data: results, level: getLavel };
          const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(encData);

            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
        			
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
  
    }
    
    
    async  userTeams(req, res) {
          
      const {user_id, page}=req;
      
       try {
           
          const pages = parseInt(page) || 1;
          const limit = 100; 
          const offset = (pages - 1) * limit; 
          let joinSql='';
    
      
         const [results, metadata] =await this.db.sequelize.query(`SELECT 
                                            DISTINCT
                                            u.*,
                                            l.level
                                        FROM 
                                            tbl_referral_idslevel l
                                        JOIN 
                                          view_user_details u ON l.user_id = u.id 
                                        
                                        WHERE l.ref_userid=${user_id} and l.status=1 and u.status=1
                                        order by l.level asc LIMIT :limit OFFSET :offset`,
                                        {
                                            
                                          replacements:{ limit,offset }, 
                                        });
                                        
          
          const responsedata = { status: 200, message:'Successful', data: results };
          //const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(responsedata);
    
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
                    
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
    
    }
    
    
    async  userReferrals(req, res) {
            
      const {user_id, page}=req;
      
       try {
           
          
          const pages = parseInt(page) || 1;
          const limit = 100; 
          const offset = (pages - 1) * limit; 
          let joinSql='';
    
      
         const [results, metadata] =await this.db.sequelize.query(`SELECT 
                                            DISTINCT
                                            u.*,
                                            l.level
                                        FROM 
                                            tbl_referral_idslevel l
                                        JOIN 
                                          view_user_details u ON l.ref_userid = u.id                                   
                                        WHERE l.user_id=${user_id} and l.status=1 and u.status=1
                                        order by l.level asc LIMIT :limit OFFSET :offset `,
                                        {
                                          replacements:{ limit,offset }, 
                                        });
                                        
        
          
          const responsedata = { status: 200, message:'Successful', data: results };
          //const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(responsedata);
    
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
                    
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
    
    }
    
    async  userPrimeProduct(req, res) {
            
        const { from_date, to_date} = req;
        
        const requiredKeys = Object.keys({ from_date, to_date});
                  
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
    
        try {
            const fromDate = new Date(from_date);
            const toDate = new Date(to_date);
            fromDate.setHours(0, 0, 0);
            toDate.setHours(23, 59, 59);
    
            const whereCondition = {
              created_on: {
                [Op.between]: [fromDate, toDate]
              }
            };
    
            const results = await this.db.viewPrimeProduct.getAllData(whereCondition);
            
            const report={
                total_count : await this.db.viewPrimeProduct.count({ where: whereCondition }),
                totalTransit : await this.db.viewPrimeProduct.count( { where:{ ...whereCondition, order_status:2 } }),
                totalDeliver : await this.db.viewPrimeProduct.count({ where:{ ...whereCondition, order_status:1 } }),
                totalCancel : await this.db.viewPrimeProduct.count({ where:{ ...whereCondition, order_status:3 } }),
                totalOrderPlaced : await this.db.viewPrimeProduct.count({ where:{ ...whereCondition,  order_status:0 } }),
             }
    
            if(results !==null){
                return res.status(200).json({ status: 200, message:'Successfully all record found', data: results, report });
            }
        
            return res.status(400).json({ status: 400, message:'Record not found',data:[] });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: 'Internal Sever Error',data:validationErrors });
            }
          
            return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
            
            
    
    }



    async  userEarning(req, res) {
            
      const {user_id}=req;
      
       try {
           
          
        
          let joinSql='';


     	const directuserCount = await this.db.referral_idslevel.getReferralCount(user_id,'1');
		const multiplier = directuserCount >= 5 ? 3.5 : 2.5;

      
         const [results, metadata] =await this.db.sequelize.query(`SELECT 
                          p.user_id,
                          p.amount,
                          COALESCE(SUM(i.credit), 0) AS total_earning,
                          COUNT(DISTINCT p.id) AS total_purchases,
                          p.amount * ${multiplier} * COUNT(DISTINCT p.id) AS total_expected_income,
                          GREATEST(p.amount * ${multiplier} * COUNT(DISTINCT p.id) - COALESCE(SUM(i.credit), 0), 0) AS total_remaining
                          FROM 
                              tbl_plan_purchase p
                          LEFT JOIN 
                              trans_referral_income i ON p.user_id = i.user_id AND p.id = i.plan_id
                          WHERE 
                              p.user_id =${user_id}
                          GROUP BY 
                              p.user_id, p.amount,p.transaction_id 
                          ORDER BY 
                          p.amount`  );
                                        
        
          
          const responsedata = { status: 200, message:'Successful', data: results ,multiplier};
          //const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(responsedata);
    
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
                    
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
    
    }





    async  incomeReport(req, res) {
            
      
      
       try {
          

      
         const [results, metadata] =await this.db.sequelize.query(`SELECT u.id,
                                           u.username,
                                           u.mlm_id,
                                           u.mobile,
                                           u.email,
                                           u.created_on  AS registration_date,
                                           u.first_name,
                                           u.last_name,
                                           p.created_on  AS investment_date,
                                           Sum(i.debit)  AS total_redeem,
                                           i.created_on  AS requestdate,
                                           Sum(p.amount) AS prime_amount,
                                           p.created_on  AS prime_date,
                                           Sum(CASE
                                                 WHEN i.tran_for = 'Income' THEN i.credit
                                                 ELSE 0
                                               END)      AS total_credit,
                                           Sum(CASE
                                                 WHEN i.tran_for = 'Income'
                                                      AND Month(i.created_on) = Month(CURRENT_DATE())
                                                      AND Year(i.created_on) = Year(CURRENT_DATE()) THEN i.credit
                                                 ELSE 0
                                               END)      AS monthly_credit,
                                          CASE 
                                                   WHEN (SELECT COUNT(*) 
                                                         FROM tbl_referral_idslevel r 
                                                         WHERE r.user_id = u.id AND r.level = 1) = 5 THEN 3.5
                                                   ELSE 2.5
                                                 END AS multiplier,

                                          SUM(p.amount) *
                                                 CASE 
                                                   WHEN (SELECT COUNT(*) 
                                                         FROM tbl_referral_idslevel r 
                                                         WHERE r.user_id = u.id AND r.level = 1) = 5 THEN 3.5
                                                   ELSE 2.5
                                                 END AS total_return

                                    FROM   tbl_plan_purchase p
                                           JOIN tbl_app_users u
                                             ON u.id = p.user_id
                                           JOIN trans_referral_income i
                                             ON p.user_id = i.user_id
                                    WHERE  u.is_admin = 0
                                    GROUP  BY p.user_id `  );
                                        
        
          
          const responsedata = { status: 200, message:'Successful', data: results };
          //const encData = utility.DataEncrypt(JSON.stringify(responsedata));
          return res.status(200).json(responsedata);
    
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
                    
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            
            
    
    }






      
 
 
}

module.exports = new ReferralUserReport();