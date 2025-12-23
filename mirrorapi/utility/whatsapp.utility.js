const axios = require('axios');
const  config  = require('../config/config.json');
require('dotenv').config();
const  utility  = require('../utility/utility');
const db = require('../config/db.config').connect();
 

async function registerWhatsappMessage(first_name, last_name, mobile) {
    return await getWhatsappMessage("register", { first_name, last_name, mobile });
}


async function loginWhatsappMessage(first_name, last_name, address, mobile) {
  return await getWhatsappMessage(
    "login",
    {
      first_name,
      last_name,
      address,
      mobile,
    },
  );
}


async function referralUserMessage(referal_fname, referal_lname ,user_fname, user_lname, mobile,mlm_user_id ) {
   return await getWhatsappMessage(
    "referral",{referal_fname, referal_lname ,user_fname, user_lname, mobile,mlm_user_id});
}



async function forgotPasswordMessage(first_name, last_name , mobile ) {
    return await getWhatsappMessage("password_reset",{first_name, last_name , mobile });
}


async function rechargeSuccessMessage(first_name, last_name , mobile, cbamount,main_amount,consumer_mobile,transactionID ) {
    return await getWhatsappMessage("recharge_success",{first_name, last_name , mobile, cbamount,main_amount,consumer_mobile,transactionID });
}




async function rechargeFailedMessage(first_name, last_name , mobile ,main_amount,consumer_mobile ) {
    return await getWhatsappMessage("recharge_failed",{first_name, last_name , mobile ,main_amount,consumer_mobile });
}




async function addMoneyRequestPendingMessage(first_name, last_name , mobile ,amount ) {
    return await getWhatsappMessage("addmoney_request_pending",{first_name, last_name , mobile ,amount });
}




async function addMoneyRequestApprovedMessage(first_name, last_name , mobile ,amount ) {
    return await getWhatsappMessage("addmoney_request_approved",{first_name, last_name , mobile ,amount });
}


async function addMoneyRequestRejectMessage(first_name, last_name , mobile ,amount,rejection_reason ) {
   return await getWhatsappMessage("addmoney_request_reject",{first_name, last_name , mobile ,amount,rejection_reason });
}



async function insuranceRequestMessage(first_name, last_name , mobile ) {
    return await getWhatsappMessage("insurance_request",{first_name, last_name , mobile });
}



async function sendMoneyMessagetoUser(touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount) {
 return await getWhatsappMessage("send_money_user",{touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount });    
}


async function sendMoneyMessageSender(touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount) {
   return await getWhatsappMessage("send_money_sender",{touserFirstName,touserLastName,to_mobile,fromuserFirstName,fromuserLastName,amount });
}



async function kycApprovedMessage(first_name,last_name,mobile) {
    return await getWhatsappMessage("kyc_approved",{first_name,last_name,mobile});
}


async function kycRequestMessage(first_name,last_name,mobile) {
   return await getWhatsappMessage("kyc_request",{first_name,last_name,mobile}); 
}


async function kycRejectMessage(first_name, last_name , mobile,rejection_reason ) {
    return await getWhatsappMessage("kyc_reject",{first_name, last_name , mobile,rejection_reason });    
}



async function addMoney(first_name, last_name , mobile ,amount ) {
 return await getWhatsappMessage("addmoney",{first_name, last_name , mobile ,amount });    
}



async function addmoney_fail(first_name, last_name , mobile ,amount ) {
    return await getWhatsappMessage("addmoney_fail",{first_name, last_name , mobile ,amount });    
}

async function redeem_request(first_name, last_name , mobile ,amount ) {
   return await getWhatsappMessage("redeem_request",{first_name, last_name , mobile ,amount });
}


async function redeem_reject(first_name, last_name , mobile ,amount, reason ) {
    return await getWhatsappMessage("redeem_reject",{first_name, last_name , mobile ,amount, reason });
}

async function redeem_approve(first_name, last_name , mobile ,amount ) {
    return await getWhatsappMessage("redeem_approve",{first_name, last_name , mobile ,amount });
}


async function feedback(first_name, last_name  ) {
    return await getWhatsappMessage("feedback",{first_name, last_name  });
}


async function admin_incomecredit(first_name, last_name, amount, wallet_type  ) {
    return await getWhatsappMessage("admin_incomecredit",{first_name, last_name, amount, wallet_type  });
}

async function id_autoblock(first_name, last_name  ) {
    return await getWhatsappMessage("id_autoblock",{first_name, last_name  });
}

async function prime_purchase(name, plan_name ) {
   return await getWhatsappMessage("prime_purchase",{name, plan_name  });
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


async function getWhatsappMessage(templateType, placeholders = {}, ignoreList = []) {
  try {
    // Fetch latest active template
    const template = await db.marketing_content.findOne({
      where: { templateType, status: 1 ,type: 'whatsapp'},
      order: [["created_on", "DESC"]],
    });

    if (!template) {
      console.warn(`No template found for type: ${templateType}`);
      return null;
    }

    let message = template.body || "";

    message = message.replace(/{{(.*?)}}|\$\{(.*?)\}/g, (_, key1, key2) => {
      const key = (key1 || key2).trim();

      // skip replacement if in ignoreList
      if (ignoreList.includes(key)) {
        return `{{${key}}}`;
      }

      const replacement = placeholders[key];
      return replacement !== undefined ? replacement : `{{${key}}}`;
    });

    return message;
  } catch (err) {
    console.error("Error fetching WhatsApp message:", err.message);
    return null;
  }
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
    ApiWhatsappMsg,
    getWhatsappMessage

};