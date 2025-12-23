const ccavenuModule = require('../config/ccavenue.config');
const axios = require('axios');
const ccavenueConfig = ccavenuModule.ccavenue();
const utility = require('../utility/utility'); 



function paymentRequest(request_id, amount, name, email, mobile, description) {
    return new Promise((resolve, reject) => {
        const apiUrl = 'https://apis.xtream.mayway.in/api/payment_gateway/payment-request';
        const accessToken = 'bcb7c9ef-0f07-4c54-a9bd-4014f7891984';

        const reqData = {
            order_id: request_id,
            amount: amount,
            name: name,
            cust_email: email,
            cust_phone: mobile,
            description: description,
            success_url: 'https://apis.xtream.mayway.in/api/payment_gateway/response',
            cancel_url: 'https://apis.xtream.mayway.in/api/payment_gateway/response'
        };

        axios.post(apiUrl, reqData, {
            headers: {
                'token': accessToken,
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            if (error.response) {
                console.error('Response data:', error.response.data);
                reject(new Error(`Error: ${error.response.data.message || 'Unknown error'}`));
            } else if (error.request) {
                console.error('No response received:', error.request);
                reject(new Error('No response received from the server.'));
            } else {
                console.error('Error making payment request:', error.message);
                reject(new Error(`Error making payment request: ${error.message}`));
            }
        });
    });
}

// function paymentCheckStatus(order_id) {
    
//     return new Promise((resolve, reject) => {
//         let apiUrl = `https://mirrorhub.in/api/payment-status-check`;
//         const accessToken = `287361e0df4ace9544746640fac82b5760e057ac`;
//         const merchantId = 1;
//         const workingKey = `935ebb99ca6c1176510704808791f36b7261c4e4`;
//         const API_KEY = `ZX2IN3P6MW8ASCVHT4YPBMJIKER9DF5OL1GL8MTRUB0GH7`;
//         const reqData = {
//             'order_id': order_id,
//             'accessToken': accessToken,
//             'merchantId': merchantId,
//             'workingKey': workingKey,
//         }
    
//         axios.post(apiUrl, reqData, {
//             headers: {
//                 'apitoken': `${API_KEY}`,
//             }
//         })
//         .then((response) => {
//             resolve({ response: response.data});
//         })
//         .catch((error) => {
//             if (error.response) {
//                 console.error('Response data:', error.response.data);
//             }
//             console.error('Error while payment check status:', error);
//             reject(error);
//         });
//     });
// }



module.exports = {
  paymentRequest,
//   paymentCheckStatus
};