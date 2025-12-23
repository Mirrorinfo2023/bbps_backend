const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const utility = require('../../utility/utility');


class cronJobPrimeRoyality {
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async PrimeRoyality() {
        
       
        
        try {
            
            //const TargetRank = await this.db.RankRoyality.getAllTargetRank();
            
            
                                                            
                                                            
           // const transaction =await this.db.sequelize.transaction();
           //  //AND CAST(p.created_on AS DATE) >= '2024-01-01' 
            
            try {
                 const [userResult, metadatas]  = await this.db.sequelize.query(`select id from tbl_app_users where status=1`, {
                                                              raw: false,
                                                            });
                
                    for (const Data of userResult) {
                        
                                    console.log(`user for prime royality - ${Data.id}`);
                                    
                                    
                                     const [resultslevel, metadatasprime]  = await this.db.sequelize.query(`
                                                SELECT
                                                p.amount as without_gst,
                                                p.plan_id,
                                                p.user_id,
                                                rpl.level,
                                                rpl.ref_userid
                                            FROM
                                                view_plan_packages p
                                            LEFT JOIN
                                                trans_royality_prime rp ON rp.user_id = p.user_id AND rp.plan_id = p.plan_id AND rp.ref_userid = ${Data.id}
                                            LEFT JOIN
                                                tbl_referral_idslevel rpl ON rpl.user_id = p.user_id
                                            WHERE
                                                rpl.ref_userid =${Data.id} 
                                                AND rp.user_id IS NULL
                                              
                                                AND CAST(p.created_on AS DATE) >= '2024-08-29' 
                                                AND rpl.status = 1
                                            ORDER BY
                                                p.user_id ASC
                                                ` , {
                                                         raw: false,
                                                   });
                                                   
                                 
                                  
                                     for (const IncData of resultslevel) {
                                            
                                            
                                             let rank_id=0;
                                       /* const LevelSumAmount= await this.db.RoyalityPrime.getLevelSumAmount(IncData.level,IncData.ref_userid);
                                        
                                       
                                        let royality_rank_id=0;
                                        
                                        
                                        const [resultsRoyality, metadataRoyality]  = await this.db.sequelize.query(`
                                                select r.user_id,r.royality_name as category,r.level,r.rank_id,r.total_income as target_amt 
                                                from trans_royality_income r where r.user_id=${IncData.ref_userid} and r.level=${IncData.level}
                                                order by id desc limit 1
                                                ` , {
                                                         raw: false,
                                                   });
                                                   
                                                  for (const royality of resultsRoyality) {
                                                      
                                                      royality_rank_id=royality.rank_id;
                                                      
                                                      
                                                  }        
                                            
                                         
                                          const [resultsRank, metadataRank]  = await this.db.sequelize.query(`
                                                SELECT null as user_id,c.category,c.level,c.id as rank_id,c.target_amt 
                                                FROM mst_rank_royality_category c
                                                
                                                ` , {
                                                         raw: false,
                                                   });
                                                   
                                                   for (const rankc of resultsRank) {
                                                        
                                                        if(
                                                        LevelSumAmount<=rankc.target_amt  
                                                        &&  rankc.level==IncData.level 
                                                        
                                                        ){
                                                            rank_id=rankc.rank_id;
                                                        }
                                                        else if(
                                                             LevelSumAmount>rankc.target_amt  
                                                        &&  rankc.level==IncData.level 
                                                        
                                                            ){
                                                            
                                                            
                                                            
                                                        }
                                                      
                                                      
                                                      
                                                      
                                                  }   
                                                  */
                                                  
                                                   
                                                   
                                             
                                                   
                                                   
                                                   
                                                   
                                            let refObj={
                                                user_id:IncData.user_id,
                                                plan_id:IncData.plan_id,
                                                amount:IncData.without_gst,
                                                ref_userid:IncData.ref_userid,
                                                level:IncData.level,
                                                rank_id:rank_id
                                             };
                                             
                                             const found= await this.db.RoyalityPrime.getCount(IncData.user_id,IncData.plan_id,IncData.ref_userid);
                                             
                                             if(found==0){
                                                 
                                                  await this.db.RoyalityPrime.insertData(refObj);//{ transaction: transaction}
                                             }
                                             
                                            
                                     }
                                    
                     }
           
                         // await transaction.commit();
            } catch (error) {
                // Handle errors during table updates
                console.log('Error in prime transaction royality  tables:', error.message);
            
                // Roll back the transaction if an error occurs
               // await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in referalids job :', err);
        }
    }
    
    
    
    
    
    
            
    
}

module.exports = new cronJobPrimeRoyality();
