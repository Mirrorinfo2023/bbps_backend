const { connect ,baseurl } = require('../../config/db.config');
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
          
            const filePath = `uploads/notification/`+fileName;
            
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

        try {
          
              const NotificationCategory= await this.db.notificationCategory.getAllData();
              const notificationApp= await this.db.notificationAppType.getAllData();

            if(NotificationCategory && notificationApp){
              return res.status(200).json({ status: 200, message: 'Notification saved successfully', data: {NotificationCategory ,notificationApp}});
            }else{
            return res.status(200).json({ status: 200, message: 'Notification saved successfully', data:[]});
            }
          } catch (error) {
           
      
              logger.error(`Error in save Notification: ${error}`);
      
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: validationErrors });
              }
      
              return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
	
    }



    async getNotification( req, res) {

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

          
          const getNotificationData = await this.db.notification_view.getData(whereCondition);
           
             
          const notificationResult= getNotificationData.map((item) => ({
            id: item.id,
            app_id: item.app_id,
            image: baseurl+item.image,
            type_id: item.type_id,
            title: item.title,
            body: item.body,
            created_on:item.notification_date,
            status:item.status,
            created_by:item.created_by,
            modified_on:item.modified_on,
            app_name:item.app_name,
            notification_type:item.notification_type,

          }));
          
          const report={

            totalCount:await this.db.notification_view.count({ where: whereCondition },'id'),
            totalSuccessFcm:await this.db.notification_view.count({  where:{ ...whereCondition, status: 1 } }),
            totalReceivedFcm:await this.db.notification_view.count({  where:{ ...whereCondition, status:0 } }),
         }
          
          return {notificationResult, report};
           
        } catch (error) {
        
            logger.error(`Error in Get Data: ${error}`);
    
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500, errors: validationErrors });
            }
    
            return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
          }
  
      }

      


     

}

   

module.exports = new Notification();