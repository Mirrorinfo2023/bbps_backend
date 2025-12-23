const billdeskModule = require('../config/billdesk.config');
const axios = require('axios');
const billdeskConfig = billdeskModule.billdesk();
const utility = require('../utility/utility'); 
const crypto = require('crypto');
const os = require('os');
const networkInterfaces = os.networkInterfaces();

const ipAddresses = Object.keys(networkInterfaces).reduce((result, interfaceName) => {
    const addresses = networkInterfaces[interfaceName].filter(info => info.family === 'IPv4').map(info => info.address);
    return addresses[0];
}, []);


function BillDeskRequest(amount, redirect_url, ip_address) {
    return new Promise((resolve, reject) => {

        const orderDate = utility.getCurrentDate();
        const secretKey = billdeskConfig.secrateKey;
        const apiUrl = billdeskConfig.url;

        const header = {
            "alg": "HS256",
            "clientid": billdeskConfig.clientId
        };

        const headers = {
            'Content-Type': 'application/jose', // Change content type if sending JSON payload
            'Accept': 'application/jose',
            'BD-Traceid': utility.generateRequestId(),
            'BD-Timestamp': Math.floor(Date.now() / 1000)
        };

        const payload = {
            "mercid": billdeskConfig.marchantId,
            "orderid": utility.generateRequestId(),
            "amount": amount,
            "order_date": orderDate,
            "currency": "356",
            "ru": redirect_url,
            "itemcode": "DIRECT",
            "device": {
                "init_channel": "internet",
                "ip": ip_address,
                "user_agent": "Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101Firefox/51.0",
                "accept_header": "text/html",
                "fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
                "browser_tz": "-330",
                "browser_color_depth": "32",
                "browser_java_enabled": "false",
                "browser_screen_height": "601",
                "browser_screen_width": "657",
                "browser_language": "en-US",
                "browser_javascript_enabled": "true"
            }
        };

        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
        const concatenatedData = `${encodedHeader}.${encodedPayload}`;
        const signature = crypto.createHmac('sha256', secretKey).update(concatenatedData).digest('base64').replace(/=/g, '');
        const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_');
        const encRequest = `${concatenatedData}.${encodedSignature}`;

        const reqData = {
            'header': header,
            'headers': headers,
            'payload': payload,
            'encRequest': encRequest
        };

        axios.post(apiUrl, encRequest, { headers })
            .then(response => {
                let result = [];
                const encodedToken = response.data;
                if (utility.verifySignature(encodedToken, secretKey)) {
                    const [, encodedPayload] = encodedToken.split('.');
                    result = utility.decryptPayload(encodedPayload);
                }
                resolve({ result: result, reqData: reqData });
            })
            .catch(error => {
                const encodedToken =  error;
                let result = [];
                if (utility.verifySignature(encodedToken, secretKey)) {
                    const [, encodedPayload] = encodedToken.split('.');
                   result = utility.decryptPayload(encodedPayload);
                } 
                reject({ result: result, reqData: reqData });
            });
    });
}


function BillDeskTransactionStatus(order_id) {
    return new Promise((resolve, reject) => {

        const orderDate = utility.getCurrentDate();
        const secretKey = billdeskConfig.secrateKey;
        const apiUrl = 'https://api.billdesk.com/payments/ve1_2/transactions/get';

        const header = {
            "alg": "HS256",
            "clientid": billdeskConfig.clientId
        };

        const headers = {
            'Content-Type': 'application/jose', // Change content type if sending JSON payload
            'Accept': 'application/jose',
            'BD-Traceid': utility.generateRequestId(),
            'BD-Timestamp': Math.floor(Date.now() / 1000)
        };

        const payload = {
            "mercid": billdeskConfig.marchantId,
            "orderid": order_id,
        };

        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
        const concatenatedData = `${encodedHeader}.${encodedPayload}`;
        const signature = crypto.createHmac('sha256', secretKey).update(concatenatedData).digest('base64').replace(/=/g, '');
        const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_');
        const encRequest = `${concatenatedData}.${encodedSignature}`;

        const reqData = {
            'header': header,
            'headers': headers,
            'payload': payload,
            'encRequest': encRequest
        };

        axios.post(apiUrl, encRequest, { headers })
            .then(response => {
                let result = [];
                const encodedToken = response.data;
                if (utility.verifySignature(encodedToken, secretKey)) {
                    const [, encodedPayload] = encodedToken.split('.');
                    result = utility.decryptPayload(encodedPayload);
                }
                resolve({ result: result, reqData: reqData });
            })
            .catch(error => {
                const encodedToken =  error;
                let result = [];
                // if (utility.verifySignature(encodedToken, secretKey)) {
                //     const [, , encodedPayload] = encodedToken.split('.');
                //   result = utility.decryptPayload(encodedPayload);
                // } 
                reject({ result: encodedToken, reqData: reqData });
            });
    });
}




module.exports = {
    BillDeskRequest,
    BillDeskTransactionStatus
    
};