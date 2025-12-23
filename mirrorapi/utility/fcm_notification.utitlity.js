const whatsapp_notification = require('../model/whatsapp/whatsapp.model');
const axios = require('axios');
const  config  = require('../config/config.json');
require('dotenv').config();

async function loginNotification( token, first_name, last_name , user_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        const Message= `Dear `+first_name+' '+last_name+`, You are successfully Login into Mirror."`;
        // tokens:JSON.stringify(token),

            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:Message,
            }
            return msg;
           
        } catch (err) {
            return err;
        }

    
}

async function forgotPasswordNotification( token, first_name, last_name , user_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        const Message = `Dear `+first_name+' '+last_name+`, Your Password Successfully Updated.`;
        
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:Message,
            }
            return msg;
           
        } catch (err) {
            return err;
        }

}



async function addMoneyRequestPendingNotification( token, first_name, last_name , user_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        const Message = `Dear `+first_name+' '+last_name+`, Your add Money request received successfully.`;
        
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:Message,
            }
            return msg;
           
        } catch (err) {
            return err;
        }

}


async function addMoneyRequestApprovedNotification( token, first_name, last_name , user_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        const Message = `Dear `+first_name+' '+last_name+`, Your add Money request approved successfully.`;
        
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:Message,
            }
            return msg;
           
        } catch (err) {
            return err;
        }

}



async function addMoneyRequestRejectNotification( token, first_name, last_name , user_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        const Message = `Dear `+first_name+' '+last_name+`, Add Money Request Rejected.`;
        
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:Message,
            }
            return msg;
           
        } catch (err) {
            return err;
        }

}


async function incomeNotification( token, message,user_id,app_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
        // const Message=message;
  
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:message,
                category:'Voice',
                app_id
            }

          
            return msg;
           
        } catch (err) {
            return err;
        }

    
}

async function planPurchaseNotification( token, user_id ,message,app_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
  
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:message,
                // category:'Voice',
                app_id
            }

          
            return msg;
           
        } catch (err) {
            return err;
        }

    
}

/// function can user all 
async function messageShootNotification( token, message,user_id,app_id) {
   
    try {
        const title = config.APP_NAME;
        const link = config.APP_LINK;
        const image = config.APP_IMG;
      
            const msg = {
                title,
                link,
                image,
                tokens:token,
                user_id,
                body:message,
                app_id
            }
       
            return msg;
           
        } catch (err) {
            return err;
        }

}


module.exports = {
    
    loginNotification,
    // RegisterNotification,
    // referralUserNotification,
    forgotPasswordNotification,
    // rechargeSuccessNotification,
    // rechargeFailedNotification,
    addMoneyRequestPendingNotification,
    addMoneyRequestApprovedNotification,
    addMoneyRequestRejectNotification,
    // insuranceRequestNotification,
    incomeNotification,
    planPurchaseNotification,
    messageShootNotification
  

};