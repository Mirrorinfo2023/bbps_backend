const ccavenuModule = require('../config/ccavenue.config');
const axios = require('axios');
const ccavenueConfig = ccavenuModule.ccavenue();
const utility = require('../utility/utility'); 



function paymentRequest(encRequest) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = `https://mirrorhub.in/api/payment-order-generate`;
        const accessToken = `287361e0df4ace9544746640fac82b5760e057ac`;
        const merchantId = 1;
        const workingKey = `935ebb99ca6c1176510704808791f36b7261c4e4`;
        const API_KEY = `ZX2IN3P6MW8ASCVHT4YPBMJIKER9DF5OL1GL8MTRUB0GH7`;
        const reqData = {
            'encReq': encRequest,
            'accessToken': accessToken,
            'merchantId': merchantId,
            'workingKey': workingKey,
        }
    
        axios.post(apiUrl, reqData, {
            headers: {
                'apitoken': `${API_KEY}`,
            }
        })
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

function paymentCheckStatus(order_id) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = `https://mirrorhub.in/api/payment-status-check`;
        const accessToken = `287361e0df4ace9544746640fac82b5760e057ac`;
        const merchantId = 1;
        const workingKey = `935ebb99ca6c1176510704808791f36b7261c4e4`;
        const API_KEY = `ZX2IN3P6MW8ASCVHT4YPBMJIKER9DF5OL1GL8MTRUB0GH7`;
        const reqData = {
            'order_id': order_id,
            'accessToken': accessToken,
            'merchantId': merchantId,
            'workingKey': workingKey,
        }
    
        axios.post(apiUrl, reqData, {
            headers: {
                'apitoken': `${API_KEY}`,
            }
        })
        .then((response) => {
            resolve({ response: response.data});
        })
        .catch((error) => {
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
            console.error('Error while payment check status:', error);
            reject(error);
        });
    });
}


module.exports = {
  paymentRequest,
  paymentCheckStatus
};