const ccavenuModule = require('../config/ccavenue.config');
const axios = require('axios');
const ccavenueConfig = ccavenuModule.ccavenue();
const utility = require('../utility/utility'); 



function paymentRequest(amount, redirect_url, cancel_url, name, mobile, address, email) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = ccavenueConfig.url;
        const workingkey = ccavenueConfig.workingKey;
        const merchantId = ccavenueConfig.merchantId;
        const requestId = utility.generateRequestId();
        const currency = 'INR';
        const tid  = Math.floor(Date.now() / 1000);
    
        // const reqData = `tid=${tid}&merchant_id=${merchantId}&order_id=${requestId}&amount=${amount}&currency=${currency}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&language=EN&billing_name=${name}&billing_address=${address}&billing_tel=${mobile}&billing_email=${email}`;
    
        // const encRequest = utility.bbpsEncrypt(reqData, workingkey).toString();
    
        axios.get(apiUrl)
          .then((response) => {
            resolve({ response: response.data});
          })
          .catch((error) => {

            if (error.response) {
                console.error('Response data:', error.response.data);
              }
            console.error('Error making payment request:', error);
            reject(error);
          });
      });
}


module.exports = {
  paymentRequest    
};