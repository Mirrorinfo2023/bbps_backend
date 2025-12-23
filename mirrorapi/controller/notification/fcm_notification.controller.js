const { connect,baseurl } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const { paginate } = require('../../utility/pagination.utility'); 

class FcmNotificationApp {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    


   
    async addFcmTokenRegister( req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id,token,app_id} = decryptedObject;

        const requiredKeys = Object.keys({ user_id,token });
              
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        let t;

        try {
         
            const currentDate = new Date();
            const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    
            const result = await this.db.fcm_notification.insertData(
                {
                user_id,
                token,
                app_id,
                },
                
              );
                
              if (result) {
                   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Token Add Successful.'})));
                // return res.status(200).json({ status: 200, message: 'Token Add Successful.'});
              } else {
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Save data', data: [] })));
                // return res.status(500).json({ status: 500, message: 'Failed to Save data', data: [] });
              }
            
        } catch (error) {
            logger.error(`Unable to find Notification: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
               return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            //   return res.status(500).json({ status: 500,errors: validationErrors });
            }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
            // return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
      }
      
      
      async getFcmNotification( req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id,app_id, page  } = decryptedObject;
        
          try {
                 const input = { user_id,app_id, page  } ;
               
                const whereClause = {'app_id':app_id} 
  
                const attributes = [
                  'id',
                  'app_id',
                  'type_id',
                  'title',
                  'body',
                  'image',
                  'status',
                  'notification_date',
                  'app_name',
                  'notification_type'
                  
                ];
               
                const getNotificationData = await paginate(this.db.notification_view, {
                  attributes: [...attributes],
                  whereClause,
                  page,
                  order: [['id', 'DESC']],
                });
          
                
                if(getNotificationData){
                     return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Notification Found', data: getNotificationData })));
                //   return res.status(200).json({ status: 200, message: 'Notification Found', data: getNotificationData });
                }else{
                      return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Notification Not Found', data: [] })));
                //   return res.status(200).json({ status: 200, message: 'Notification Not Found', data: [] });
                }
            
          } catch (error) {
          
              logger.error(`Error in Get Data: ${error}`);
      
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                // return res.status(500).json({ status: 500, errors: 'Internal Server Error' });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error' })));
              }
                 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
            //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
    
        }

      

  

      


     

}

   

module.exports = new FcmNotificationApp();