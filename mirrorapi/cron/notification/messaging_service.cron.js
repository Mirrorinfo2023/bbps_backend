const { connect,config } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const messagingUtility = require('../../utility/messaging.utility'); 
const utility = require('../../utility/utility');
const fs = require('fs');

class messagingService {
 
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
       
        this.db = connect();
    }

    async shootMessages() {
        
        try {
            
            const services = await this.db.messagingService.getAllData({status: 0});

                
            for (const Data of services)
            {
                
                const fcmData = await this.db.fcm_notification.findOne({
                    where:{
                        user_id: Data.user_id
                    },
                    order:[['id', 'DESC']],
                    limit: 1
                });
                if(fcmData)
                {
                    const inputData = {

                        user_id: Data.user_id,
                        tokens: fcmData.token,
                        title: Data.service,
                        body: Data.msg_notification,
                        image: config.APP_IMG,
                        link: config.APP_LINK,
                        category: 1,
                        app_id: fcmData.app_id
                    }
                    await this.db.log_app_notification.insertData(inputData);
                    
                }

                const whereChk={id:Data.user_id};
                const UserAttribute=['id','first_name','last_name','mobile', 'email'];
                const userRow = await this.db.user.getData(UserAttribute,whereChk);
                
                const itemDescription = { 
                    item_name: Data.service, 
                    unit:'1', 
                    amount: Data.amount, 
                    order_id: Data.order_id 
                }
                const billingAddress = { 
                    name: `${userRow.first_name} ${userRow.last_name}`, 
                    mobile: userRow.mobile, 
                    mlm_id: userRow.mlm_id, 
                    email: userRow.email, 
                    invoice_no: Data.invoice_no, 
                    invoice_date: Data.invoice_date?utility.formatDate(Data.invoice_date):null
                }
                const paymentDetails = { 
                    gateway: Data.getway, 
                    bank_ref_no: Data.bank_ref_no, 
                    tracking_id: Data.tracking_id, 
                    payment_date: Data.payment_date?utility.formatDate(Data.payment_date):null
                }

                const messages = {
                    'email': Data.msg_email,
                    'whatsup': Data.msg_whatsup,
                    'msg_sms': Data.msg_sms
                }
                
                const messaging = await messagingUtility.messaging(itemDescription, billingAddress, paymentDetails, messages);
                if(messaging && messaging.status==true)
                {
                    await this.db.messagingService.update(
                        {'status': 1, 'email_response': JSON.stringify(messaging.email_data) }, 
                        { where: { id:Data.id }
                    });
                }
            }

            
        } catch (err) {
            console.error('Error in referalids job :', err);
        }
    }
}

module.exports = new messagingService();
