const phonepeModule = require('../config/phonepe.config');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const phonepeConfig = phonepeModule.phonepe();


    function pay_api(ref_id,user_id,amount,mobile, redirect_url) {

        return new Promise((resolve, reject) => {

        const data = {
                merchantId: phonepeConfig.paymentGatewayMerchantId,
                merchantTransactionId: ref_id,
                merchantUserId: user_id,
                amount: amount * 100,
                redirectUrl: redirect_url,
                redirectMode: 'POST',
                callbackUrl: phonepeConfig.paymentGatewaycallbackUrl,
                mobileNumber: mobile,
                paymentInstrument: {
                    type: 'PAY_PAGE'
                }
            };
           
            const payload = JSON.stringify(data);
            const payloadMain = Buffer.from(payload).toString('base64');
            const keyIndex = phonepeConfig.key_index;
            const string = payloadMain + '/pg/v1/pay' + phonepeConfig.paymentGatewayApiKey;
            const sha256 = crypto.createHash('sha256').update(string).digest('hex');
            const checksum = sha256 + '###' + keyIndex;
            const prod_URL =  phonepeConfig.prod_host_url;
            const request_data = {
                request: payloadMain
                }
                headers= {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum
                }
           
                axios.post(prod_URL, request_data, { headers })
                .then(response => {
                        const req_data = {
                            payload : data,
                            request: request_data
                        }
                    resolve({ request: req_data ,  result:response.data });
                   
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);
                  
                });

        });
    }







function checkStatus(ref_id) {

    return new Promise((resolve, reject) => {

       
        const merchantTransactionId = ref_id;
        const merchantId = phonepeConfig.paymentGatewayMerchantId;
        const keyIndex = 1;
       
        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}`+ phonepeConfig.paymentGatewayApiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const url= `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`;
        const headers= {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': `${merchantId}`
        }
 
        axios.get(url,{headers})
        .then(response => {
       
            resolve({ result: response.data}); 
        })
        .catch(error => {
          
            reject(error);
        });
      
    });

}






module.exports = {
    pay_api,
    checkStatus
    
};