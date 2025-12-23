const { connect } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper'); 
const pino = require('pino');
// const logger = pino({ level: 'info' }, process.stdout);

class Notification {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async addNotification(fileName, req, res) {

        
        
      const { title, body,app_id ,type_id } = req;
        
		  const requiredKeys = Object.keys({  title, body,app_id ,type_id });
            
          if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }
      
          let  t = await this.db.sequelize.transaction();

        try {
          
            const filePath = fileName;
            
              const notificationData = {
             
                title,
                body,
                app_id,
                type_id,
                image:filePath,
            };
        
              const newNotification= await this.db.notification.insertData(notificationData, { transaction:t
              });
        
              await t.commit();
          
            return res.status(200).json({ status: 200, message: 'Notification saved successfully', data: newNotification });
       
          } catch (error) {
            if (t) {
              await t.rollback();
            }
      
              logger.error(`Error in save Notification: ${error}`);
      
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: validationErrors });
              }
      
              return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
      
       
	
    }


    async getNotificationCategory( req, res) {

        // try {
          
              const NotificationCategory= await this.db.notificationCategory.getAllData();

            if(NotificationCategory){
              return res.status(200).json({ status: 200, message: 'Notification saved successfully', data: NotificationCategory });
            }else{
            return res.status(200).json({ status: 200, message: 'Notification saved successfully', data:[]});
            }
          // } catch (error) {
           
      
          //     logger.error(`Error in save Notification: ${error}`);
      
          //     if (error.name === 'SequelizeValidationError') {
          //       const validationErrors = error.errors.map((err) => err.message);
          //       return res.status(500).json({ status: 500, errors: validationErrors });
          //     }
      
          //     return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
          //   }
      
       
	
    }



    async getNotification( req, res) {

     
      
      // try {
         
        
          const getNotificationData = await this.db.notification_view.getData();
          
          return getNotificationData;
           
        // } catch (error) {
        
        //     logger.error(`Error in Get Data: ${error}`);
    
        //     if (error.name === 'SequelizeValidationError') {
        //       const validationErrors = error.errors.map((err) => err.message);
        //       return res.status(500).json({ status: 500, errors: validationErrors });
        //     }
    
        //     return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        //   }
  
  }
     

}

   

module.exports = new Notification();