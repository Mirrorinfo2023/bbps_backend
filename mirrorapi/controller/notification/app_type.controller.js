const { connect } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const emailUtility = require('../../utility/email.utility');
// const logger = pino({ level: 'info' }, process.stdout);

class NotificationApp {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
 


    async getAppType( req, res) {

        try {
          
              const notificationApp= await this.db.notificationAppType.getAllData();

            if(notificationApp){
              return res.status(200).json({ status: 200, message: 'Notification saved successfully', data: notificationApp });
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
    
    
     async sendEmail( req, res) {

      // try {
         const to='arti.mirrorinfotech@gmail.com';
         const subject='Welcome to mirror';
         const message='Hello Team';

            const notificationApp=   emailUtility.send_mail(to,subject, message);
            // console.log(notificationApp);
          if(notificationApp){
            return res.status(200).json({ status: 200, message: 'Email saved successfully', data: notificationApp });
          }else{
          return res.status(200).json({ status: 200, message: 'Email saved successfully', data:[]});
          }
        // } catch (error) {
         
    
           
    
        //     if (error.name === 'SequelizeValidationError') {
        //       const validationErrors = error.errors.map((err) => err.message);
        //       return res.status(500).json({ status: 500, errors: validationErrors });
        //     }
    
        //     return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        //   }

  }


      


     

}

   

module.exports = new NotificationApp();