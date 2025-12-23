const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 
const path = require('path');
require('dotenv').config();
const { paginate } = require('../../utility/pagination.utility'); 

class contactlog {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
      async addContactLog(req, res) {
                let t;
                const decryptedObject = utility.DataDecrypt(req.encReq);
                const { user_id,dataList} = decryptedObject;
                
                const requiredKeys = Object.keys({user_id, dataList });
              
                if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                    //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                }
              
              
                try {
                 
                  t = await this.db.sequelize.transaction();
             
                        const Data = {
                            user_id,
                            data_details:JSON.stringify(dataList),
                            created_by:user_id
                        };
                
                        const newMeeting = await this.db.contactActivityLog.insertData(Data, {
                        validate: true,
                        transaction: t,
                        logging: sql => logger.info(sql),
                        });
               
                    await t.commit();
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Contact Log added successfully', data: newMeeting })));
                    // return res.status(201).json({ status: 201, message: 'Contact Log added successfully', data: newMeeting });
                  
                } catch (error) {
                  if (t) {
                    await t.rollback();
                  }
              
                  logger.error(`Error in add Contact: ${error}`);
              
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
                    // return res.status(500).json({ status: 500, errors: validationErrors });
                  }
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
                //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
                }
              
           
        }  
	
      async addContactLogOld(req, res) {
                let t;
                const decryptedObject = utility.DataDecrypt(req.encReq);
                const { user_id, mobile, name, type} = decryptedObject;
                
                const requiredKeys = Object.keys({ user_id, mobile, name, type });
              
                if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                   return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                }
              
                try {
                 
                  t = await this.db.sequelize.transaction();
                 
                    const Data = {
                        user_id,
                        mobile, 
                        name, 
                        type,
                        created_by:user_id
                    };
              
                    const newMeeting = await this.db.contactActivityLog.insertData(Data, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
                    });
              
                    await t.commit();
              
                    // return res.status(201).json({ status: 201, message: 'Contact Log added successfully', data: newMeeting });
                     return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: 'Contact Log added successfully', data: newMeeting })));
                } catch (error) {
                  if (t) {
                    await t.rollback();
                  }
              
                  logger.error(`Error in add Contact: ${error}`);
              
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
                    // return res.status(500).json({ status: 500, errors: validationErrors });
                  }
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
                //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
                }
              
           
        }  


        async getNotificationContent(req,res) {
         

            try {
             
              let whereCondition ;
            //   const currDate=utility.formatDate(new Date());
            //   const startDate1=utility.formatDate(new Date(date));
            //   const endDate1=utility.formatDate(new Date(date));

            //   const startDate =new Date(date);
            //   const endDate =new Date(date);
            //   endDate.setHours(23, 59, 59);
      
              whereCondition = {
                //   'created_on': {
                //     [Op.between]: [startDate1, endDate1]
                //   },
                  'status':1
              }

             
                const result = await this.db.logNotificationContent.findOne({
                    where:whereCondition,
                    order: [['created_on', 'DESC']],
                   
                });
  

                if(result){
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'success', data : result })));
                    // return res.status(200).json({ status: 200,  message:'success', data : result });
                }else{
                     return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message:'not found', data : [] })));
                    // return res.status(400).json({ status: 400,  message:'not found', data : [] });
                }
                
              
              }
            catch (err) {
                    logger.error(`Unable to find Meeting: ${err}`);
              if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                // return res.status(500).json({ status: 500,errors: validationErrors });
              }
               return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
            //   return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }
      
            }



  



       
  

          
              


}




module.exports = new contactlog();