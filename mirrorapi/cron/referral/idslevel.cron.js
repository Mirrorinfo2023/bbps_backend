const { connect } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

class idslevelCronJob {
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async ReferIDJob() {
        
       
        
        try {
            
            const Users = await this.db.user.GetAllreferalLevelnotexist();
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
                    for (const Data of Users) {
                        
                            let level = 1;
                            let sponsor = Data.referred_by;
                        
                            while (true) {
                                if (sponsor !== '' && sponsor !== 0) {
                                    
                                    
                                    
                                    const found=await this.db.referral_idslevel.getCount(Data.id,sponsor,level);
                                    
                                    if(found==0){
                                        console.log("referal Id"+Data.id);
                                        const refObj={
                                            user_id:Data.id,
                                            ref_userid:sponsor,
                                            mlm_id:Data.mlm_id,
                                            level
                                        };
                                        try{
                                            await this.db.referral_idslevel.insertData(refObj);
                                        } catch (err) {
                                            console.error('Error in Insert level :', err);
                                        }
                                        
                                    }
                                    
                                   
                                   
                                    
                                   const attribute=['referred_by'];
                                   const whereClause={id:sponsor};
                                    
                                    const UsersSponser = await this.db.user.getData(attribute,whereClause);
                                    
                                  
                                    if (UsersSponser!=null) {
                                        sponsor =UsersSponser.referred_by;
                                    } else {
                                        break;
                                    }
                                } else {
                                    break;
                                }
                                level++;
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
}

module.exports = new idslevelCronJob();
