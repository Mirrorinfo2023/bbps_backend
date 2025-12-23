const mPlan = require('../config/mplan.config');
const iPayment = require('../config/ipayment.config');
const axios = require('axios');
const mplanConfig = mPlan.plan();
const iPaymentConfig = iPayment.ipayment();


function getPlan(operator, circle, mobile){
   
    return new Promise((resolve, reject) => {
        
    let apiUrl = mplanConfig.url;
    const key = mplanConfig.key;

    if(mobile)
    {
        apiUrl += `plans.php?apikey=${key}&offer=roffer&tel=${mobile}&operator=${operator}`;
    }else{
        apiUrl += `plans.php?apikey=${key}&cricle=${circle}&operator=${operator}`;
    }

    
    axios.get(apiUrl) 
    .then((response) => {
        resolve({ result: response.data }); 
        })
        .catch((error) => {
            console.log(error);
            reject(error); 
        });
        
    });
    
}

function checkOperator(mobile){
   
    return new Promise((resolve, reject) => {
        
    let apiUrl = mplanConfig.operatorurl;
    const key = mplanConfig.key;

    if(mobile)
    {
        apiUrl += `operatorinfo.php?apikey=${key}&tel=${mobile}`;
    }

    
    axios.get(apiUrl) 
    .then((response) => {
        resolve({ result: response.data }); 
        })
        .catch((error) => {
            console.log(error);
            reject(error); 
        });
        
    });
    
}

function getIpaymentPlan(circle_id, recharge_type_id, operator_id){
   
    return new Promise((resolve, reject) => {
        
        let apiUrl = iPaymentConfig.rechargePlanUrl;
        const username = iPaymentConfig.clientId;
        const password = iPaymentConfig.clientSecret;

        const params = {
            circleId: circle_id,
            rechargeTypeId: recharge_type_id,
            operatorId: operator_id,
          };
      
          const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
      
          axios.get(apiUrl, {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': basicAuth,
            },
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.error('Error:', error);
            reject(error);
          });
    });
}

module.exports = {
    getPlan,
    checkOperator,
    getIpaymentPlan
};