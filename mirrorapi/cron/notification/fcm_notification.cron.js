
const { connect } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const axios = require('axios');

class cronJobNotifocation {
    
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        this.db = connect();
    }


   
    async sendNotification(notificationData) {

        const { token, body,link,image, title,app_id,category } = notificationData;
        
        const url = 'https://fcm.googleapis.com/fcm/send';
        // const fcmServerKey = 'AAAAR4ocGjw:APA91bGERo6aAnsO9fZ3iUP_qa5DIAX0WNKc6VfFlziCYxDL_W0WGNyiOiIySQvaq2LFsmZOoV5ohPqeG5kQh65S-XxOjyyu0c7uEqqLOq1hK55h8HB9XnAjxe2h82XZi2Op3N6oXy_4';
        let fcmServerKey='';
        if(app_id==2){
            //for bisuness
             fcmServerKey = 'AAAA-FJ2yYU:APA91bG1palCKFisKGPvbJZrlMZi95PjBAuBzBrT97_CDf0j973I0AebZnRIRQY8wOX8svAJDF8OeBVybCdy3f9wAo5yjXAt-U8OoCUZ2vZOnVHZScB_Gfn3bi8_mH2B8LTIg6G99XTg';
        }else{
              //for hub
             fcmServerKey = 'AAAAR4ocGjw:APA91bGERo6aAnsO9fZ3iUP_qa5DIAX0WNKc6VfFlziCYxDL_W0WGNyiOiIySQvaq2LFsmZOoV5ohPqeG5kQh65S-XxOjyyu0c7uEqqLOq1hK55h8HB9XnAjxe2h82XZi2Op3N6oXy_4';
        }

        
        const payload = {
            notification: {
                body: body,
                title: title,
                image: image,
            },
            priority: 'high',
            // to:token ? token: `/topics/all`,
            to:token ,
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                id: "120",
                status: "done",
                info: {
                    title: title,
                    link: link,
                    image: image,
                    body: body,
                    category:category,
                    
                },
            },
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `key=${fcmServerKey}`,
        };

        const axiosData = axios.post(url, payload, { headers })
            .then(response => {
                console.log('Successfully sent message:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error sending message:', error.message);
                return error.message;
            });
          return axiosData;

    }
      

    async NotificationJob(req,res) {
        
    
        try {
            const currentDate = new Date();
            const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
          
            const notificationData = await this.db.log_app_notification.getAllData();
            
            const transaction =await this.db.sequelize.transaction();
            
            try {
                            
                    const responses = [];
                 
                  
                    for (const notification of notificationData) 
                    { 

                        const notificationParam = {
                            id: notification.id,
                            token: notification.tokens,
                            title: notification.title,
                            body: notification.body,
                            image: notification.image,
                            link: notification.link,
                            app_id:notification.app_id,
                            category:notification.category,
                        }

                        const response= await this.sendNotification(notificationParam);
                        // const result ={
                        //     'axiosData': axiosData,
                        //     'payload': payload,
                        //     'headers': headers
                        // }
                        // return result;
                        const updatedStatus = await this.db.log_app_notification.UpdateData(
                            {
                                status:1,
                                updated_datetime:modified_on
                            },
                            {id:notification.id});
                            
                        responses.push(response);
                    }
                    
                    return responses;
                    //return res.status(200).json({ status: 200, message: 'SUCCESS', data:responses });
                
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in sending Notification :', err);
        }
    }

    async NotificationJobAdmin(req,res) {
        
        
        try {
            const currentDate = new Date();
            const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

            const whereClause={
                status:0
            };
            const Notification = await this.db.notification.getAllRecords(whereClause);
            
            const transaction =await this.db.sequelize.transaction();
            
            try {
                    const responses = [];                     
                    const notificationData = Notification.map((data) => ({
                        id: data.id,
                        token: `/topics/all`,
                        title: data.title,
                        body: data.body,
                        image: data.image,
                        link: data.link,
                        app_id: data.app_id
                       
                    }));
                        
                    for (const notification of notificationData) 
                    { 

                        const notificationParam = {
                            id: notification.id,
                            token: `/topics/all`,
                            title: notification.title,
                            body: notification.body,
                            image: notification.image,
                            link: notification.link,
                           
                        }
                        const response = await this.sendNotification(notificationParam);
                        
                        const updatedStatus = await this.db.notification.UpdateData(
                            {
                                status:1,
                                updated_datetime:modified_on
                            },
                            {id:notification.id});
                            
                        responses.push(response);
                    }
                   
                   
                    
                  return responses;
                  
                    
                   
                     //return res.status(200).json({ status: 200, message: 'SUCCESS', data:responses });
                    
                    
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in sending Notification :', err);
        }
    }



}

module.exports = new cronJobNotifocation();
