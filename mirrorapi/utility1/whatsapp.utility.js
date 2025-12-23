const axios = require('axios');
const  config  = require('../config/config.json');
require('dotenv').config();
const  utility  = require('../utility/utility');


async function registerWhatsappMessage(first_name, last_name, mobile ) {
    try {
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);
    

    const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*
                             
*Welcome to ${config.APP_NAME} Family...*

*You have successfully registered in ${config.APP_NAME} on `+created_on+`.*

*${config.APP_NAME} is committed to providing you guaranteed savings and great business opportunities from ${config.APP_NAME}.*

*You will get income and cashback on these services.*

1. Recharge and DTH 
(4% Cashback Guaranteed)
2. BBPS Bill Payment
(0.5% cashback guaranteed*)
3. IT Services
(Guaranteed 10% Income)
4. Insurance
(Guaranteed 10% Income)
5. Mayway Taxation Services
(Guaranteed 5% return)
6. Marketing Services
(Guaranteed 5% return)
7. Affiliate Partners
(1% to 2% cashback guaranteed*)
8. Attach the Mayway
(Guaranteed 25,000 to 50,000)
9. Mayway Financial Services
(Rs. 500* to Rs. 1000* assured)
10. Mayway Loan Service

*Start using ${config.APP_NAME} and start saving on your daily services.*

*If you have any kind of problem please don't hesitate to contact our support team they will support you properly.*

*Join our official social media links for latest updates.*

*Telegram*
*${config.TELEGEAM_LINK}*

*YouTube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Website*
*${config.WEBSITE}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;
    
                //   const whatsapp = {
                //   mobile:`91`+mobile,
                //   message:whatsappMessage,
                //   entry_datetime:created_on
                // }
        return whatsappMessage;
    } catch (err) {
            
           
        return err;
   }         
    
}



async function loginWhatsappMessage(first_name, last_name , address, mobile) {
   
    try {
                      
    const currentDate = new Date();
    let created_on = utility.formatDateTime(currentDate);
   

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*
*We detected a New login into your account from a new device on `+created_on+`*
                            
*Location :` +address+`.*
                                            
*If you think that somebody logged in to your account against your will, you can change your password immediately.*
                            
*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;



            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
           
            return whatsappMessage;
            //  msg = await whatsapp_notification.create(whatsapp);

            //  if(msg){
            //     return { status: 200, token: token, message: 'Login successful', data: whatsapp };
            //  }else{
            //     return { status: 401, token: token, message: 'failed to send message', data: [] };
            //  }



        } catch (err) {
            
           
             return err;
        }

    
}



async function referralUserMessage(referal_fname, referal_lname ,user_fname, user_lname, mobile,mlm_user_id ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+referal_fname+' '+referal_lname+`,*

*Mr/Ms/Mrs. `+user_fname+` `+user_lname+` has joined Mayway using your refer link.*

*Mobile no - `+mobile+`*
*MR ID - `+mlm_user_id+`*
*Joining Date -`+created_on+`*

*now he is your team member. take follow-up him and start a big business with him.*

*Remember every person is important in life and business thus take care of him..*

*Because ${config.APP_NAME} is a family community...*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
            
           
             return err;
        }

    
}



async function forgotPasswordMessage(first_name, last_name , mobile ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Your account password has just been changed on `+created_on+`*

*If you believe someone has logged into your account against your will, you can change your password immediately.*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
            
           
             return err;
        }

    
}


async function rechargeSuccessMessage(first_name, last_name , mobile, cbamount,main_amount,consumer_mobile,transactionID ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);
    
    let cashback = '';
    let cashbackText = '';
    if(parseFloat(cbamount) > 0)
    {
    
        cashback = `*CONGRATULATIONS!!!*
        *You Have Received Rs.`+cbamount+` Cashback...*`;
        cashbackText = ` and you got Rs `+cbamount+` cashback on this transaction...`
    }

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*
${cashback}

*Your recharge of Rs.`+main_amount+` on `+consumer_mobile+`  is successful from ${config.APP_NAME}${cashbackText}*

*Transaction Id - `+transactionID+`*
*Transaction Amount -`+main_amount+`*
*Transaction Date and Time - `+created_on+`*

*${config.APP_NAME} tries to provide you guaranteed cashback service on every transaction. So try to use ${config.APP_NAME} regularly and get the world best cashback benefits.*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
            
           
             return err;
        }

    
}




async function rechargeFailedMessage(first_name, last_name , mobile ,main_amount,consumer_mobile ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Recently, you were doing your Rs.`+main_amount+` recharge on your `+consumer_mobile+` number. But due to some technical problem this recharge failed. But don't worry. Your funds have been returned to your wallet. Please recharge after 10 to 15 minutes. Your recharge will be done. Sorry for the inconvenience.* 

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}




async function addMoneyRequestPendingMessage(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Congratulation...!!!!!*

*You have successfully Rs.`+amount+` is submitted add money request manually.*

*Now you can use this amount for all ${config.APP_NAME} utility services and shopping.*

*Please, wait for 2 hours. we will check this transaction and update you soon.*

*If you have any query issues plz let me know we will try to help you on priority.*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}




async function addMoneyRequestApprovedMessage(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Congratulation...*

*We are successfully Rs.`+amount+` is approve add money request manually.*

*Now you can use this amount for all ${config.APP_NAME}  utility services and shopping.*

*If you have any query issues plz let me know we will try to help you on priority.*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
         
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}


async function addMoneyRequestRejectMessage(first_name, last_name , mobile ,amount,rejection_reason ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Sorry for inconvenience...*

*We are  rejected  your add money request of Rs.`+amount+` because of `+rejection_reason+`.*

*If you have any query issues plz let us know we will try to help you on priority.*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}



async function insuranceRequestMessage(first_name, last_name , mobile ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Congratulation!!!!......*

*Your Insurance request has been suceessfully submitted.*

*let's get insurance from ${config.APP_NAME} and get Assured 10% commission on it.*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}



async function sendMoneyMessagetoUser(touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount) {
   
    try {
                      
        const currentDate = new Date();
        const created_on = utility.formatDateTime(currentDate);

const whatsappMessage_sender= `*Dear `+touserFirstName+' '+touserLastName+` ,*

*You have successfully Received Rs.`+amount+` from ${fromuserFirstName} ${fromuserLastName}*

*Date -`+created_on+`*

*Verify once that the transaction is done by you. If you have any queries regarding this transaction, please contact our ${config.SUPPORT_TEAM}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+to_mobile,
            // message:whatsappMessage_sender,
          
            // }
            
            return whatsappMessage_sender;
         

        } catch (err) {
             return err;
        }

    
}


async function sendMoneyMessageSender(touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount) {
   
    try {
                      
        const currentDate = new Date();
        const created_on = utility.formatDateTime(currentDate);

const whatsappMessage_sender= `*Dear `+fromuserFirstName+' '+fromuserLastName+` ,*

*You have successfully transferred Rs.`+amount+` to ${touserFirstName} ${touserLastName}*

*Date -`+created_on+`*

*Verify once that the transaction is done by you. If you have any queries regarding this transaction, please contact our ${config.SUPPORT_TEAM}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+to_mobile,
            // message:whatsappMessage_sender,
          
            // }
            
            return whatsappMessage_sender;
         

        } catch (err) {
             return err;
        }

    
}



async function kycApprovedMessage(first_name,last_name,mobile) {
   
    try {
                      
        const currentDate = new Date();
        let created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+` ,*

*Congratulations..!!!!*

*your kyc request is approved successfully. If you have any queries, please contact our ${config.SUPPORT_TEAM}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}


async function kycRequestMessage(first_name,last_name,mobile) {
   
    try {
                      
        const currentDate = new Date();
        let created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+` ,*

*your kyc request has been received successfully, Please contact our ${config.SUPPORT_TEAM}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
          
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}


async function kycRejectMessage(first_name, last_name , mobile,rejection_reason ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Sorry for inconvenience...*

*We are  rejected  your kyc request because of `+rejection_reason+`.*

*If you have any query issues plz let us know we will try to help you on priority.*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}



async function addMoney(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount} added to your wallet...*

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}



async function addmoney_fail(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount} not added to your account due to the transaction is incomplete....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}



async function redeem_request(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount}, redeem request was added successfully. your redemption gets in your account within 24 hours....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

    
}


async function redeem_reject(first_name, last_name , mobile ,amount, reason ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount}, redeem request is rejected because of ${reason}*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}

async function redeem_approve(first_name, last_name , mobile ,amount ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount}, redeem request is approved successfully. ....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}


async function feedback(first_name, last_name  ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*your feedback has been added successfully. we will review it and try to provide you best of best service. ....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}


async function admin_incomecredit(first_name, last_name, amount, wallet_type  ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`*

*Rs.${amount} is credited to your ${wallet_type} via admin ....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}

async function id_autoblock(first_name, last_name  ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);

const whatsappMessage= `*Dear `+first_name+' '+last_name+`,*

*Due to multiple signups / mpin attempted your id is blocked. plz contact to support team. 9112421742....*


*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}

async function prime_purchase(name, plan_name ) {
   
    try {
                      
    const currentDate = new Date();
    const created_on = utility.formatDateTime(currentDate);


    const whatsappMessage= `*Dear `+name+`,*

    * Congratulations! You have successfully purchased Mayway `+plan_name+` *
    
    

*Please, join our ${config.APP_NAME}  social media platform for Latest Update.*

*${config.APP_NAME} Web site*
*${config.WEBSITE}*
*${config.WEBSITE_HUB}*

*Telegram*
*${config.TELEGEAM_LINK}*

*Youtube*
*${config.YOUTUBE_LINK}*

*Facebook*
*${config.FACEBOOK_LINK}*

*Thanks and Regards,*
*${config.SUPPORT_TEAM}*`;

            // const whatsapp = {
            // mobile:`91`+mobile,
            // message:whatsappMessage,
           
            // }
            
            return whatsappMessage;
         

        } catch (err) {
             return err;
        }

}


function ApiWhatsappMsg(mobile_no, message, media_url = null, instance_id, access_token) {
    const whatsappSendMagURL = 'https://cashbridge.live/api/send'; 
    
    return new Promise((resolve, reject) => {
        const reqData = {
            "number": parseInt(`91${mobile_no}`),
            "instance_id": `${instance_id}`,
            "access_token": `${access_token}`
        };
        
        if (media_url) {
            reqData.type = "media";
            reqData.message = "";
            reqData.media_url = media_url;
        } else {
            reqData.type = "text";
            reqData.message = `${message}`;
        }

        axios.post(whatsappSendMagURL, reqData, { timeout: 100000000 })  // Set timeout to 100000 seconds (100000000 ms)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                if (error.code === 'ECONNABORTED') {
                    console.error('Request timeout:', error.message);
                } else if (error.response) {
                    console.error('Status Code:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if (error.request) {
                    console.error('Request made but no response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                reject(error);
            });
    });
}




module.exports = {
    registerWhatsappMessage,
    loginWhatsappMessage,
    referralUserMessage,
    forgotPasswordMessage,
    rechargeSuccessMessage,
    rechargeFailedMessage,
    addMoneyRequestPendingMessage,
    addMoneyRequestApprovedMessage,
    addMoneyRequestRejectMessage,
    insuranceRequestMessage,
    sendMoneyMessagetoUser,
    sendMoneyMessageSender,
    kycApprovedMessage,
    kycRequestMessage,
    kycRejectMessage,

    addMoney,
    addmoney_fail,
    redeem_request,
    redeem_approve,
    redeem_reject,
    feedback,
    admin_incomecredit,
    id_autoblock,
    prime_purchase,
    ApiWhatsappMsg

};