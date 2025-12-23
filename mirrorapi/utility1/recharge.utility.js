//const rechargeModule = require('../config/recharge.config');
const axios = require('axios');
const crypto = require('crypto');
//const pbmsConfig = rechargeModule.pbms();
const iPayment = require('../config/ipayment.config');
const iPaymentConfig = iPayment.ipayment();

function pbms(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl;
        // if(ConsumerNumber !== null){
        //     apiUrl += `&OperatorID=${operatorId}&APIUserRequestID=${requestId}&ConsumerNumber=${ConsumerNumber}&Amount=${amount}`;
        // }else{
        //     apiUrl += `&OperatorID=${operatorId}&APIUserRequestID=${requestId}&ConsumerNumber=${mobile_no}&Amount=${amount}`;
        // }
        apiUrl += `&OperatorID=${operatorId}&APIUserRequestID=${requestId}&ConsumerNumber=${mobile_no}&Amount=${amount}`;
        
        axios.get(apiUrl) 
            .then((response) => {
                if(response.data.status == 'SUCCESS' || response.data.status == 'PROCESS')
                {
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    //reject(new Error(response.data.status));
                   //resolve({ result: response.data, panel_id:panel_id });
                    reject({ result: response.data, panel_id:panel_id });
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}

function omega(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl+"&Account="+mobile_no+"&Amount="+amount+"&SPKey="+operatorId+"&APIRequestID="+requestId;

        axios.get(apiUrl) 
            .then((response) => {
                response.data.transactionID=response.data.rpid;
                response.data.message = response.data.msg;
                
                if(response.data.status == 1 || response.data.status == 2)
                {
                    if(response.data.status == 1){response.data.status = 'PROCESS';}
                    if(response.data.status == 2){response.data.status = 'SUCCESS';}
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    //reject(new Error(response.data.msg));
                    response.data.status = 'FAILURE';
                    reject({ result: response.data, panel_id: panel_id });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}

function tkdig(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl+"&Account="+mobile_no+"&Amount="+amount+"&SPKey="+operatorId+"&APIRequestID="+requestId;

        axios.get(apiUrl) 
            .then((response) => {
                response.data.transactionID=response.data.rpid;
                if(response.data.status == '1' || response.data.status == '2')
                {
                    if(response.data.status == 1){response.data.status = 'PROCESS';}
                    if(response.data.status == 2){response.data.status = 'SUCCESS';}
                    response.data.message = response.data.msg;
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    //resolve({ result: response.data, panel_id:panel_id }); 
                    response.data.status = 'FAILURE';
                    response.data.message = response.data.msg;
                    reject({ result: response.data, panel_id: panel_id });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}

function kpps(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl+"&number="+mobile_no+"&amount="+amount+"&operator="+operatorId+"&ref_id="+txnId;
        
        axios.get(apiUrl) 
            .then((response) => {
                response.data.transactionID=response.data.txn_id;
                if(response.data.status == 'Success' || response.data.status == 'Pending' || response.data.status == 'Accepted')
                {
                    if(response.data.status == 'Pending'){response.data.status = 'PROCESS';}
                    if(response.data.status == 'Success'){response.data.status = 'SUCCESS';}
                    if(response.data.status == 'Accepted'){response.data.status = 'ACCEPTED';}
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    response.data.status = 'FAILURE';
                    reject({ result: response.data, panel_id: panel_id });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function ambika(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl+"&Account="+mobile_no+"&Amount="+amount+"&SPKey="+operatorId+"&APIRequestID="+requestId;

        axios.get(apiUrl) 
            .then((response) => {
                response.data.transactionID=response.data.rpid;
                response.data.message = response.data.msg;
                
                if(response.data.status == 1 || response.data.status == 2)
                {
                    if(response.data.status == 1){response.data.status = 'PROCESS';}
                    if(response.data.status == 2){response.data.status = 'SUCCESS';}
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    //reject(new Error(response.data.msg));
                    response.data.status = 'FAILURE';
                    reject({ result: response.data, panel_id: panel_id });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}

function omega_test()
{
    return new Promise((resolve, reject) => {
        let transaction_id = Date.now();
        let apiUrl = "http://omega9.in/API/TransactionAPI?UserID=554&Token=29e042333b81c046ba066470dc80d4a6&GEOCode=81,91&Pincode=2&Format=1&Account=8709937704&Amount=19&SPKey=116&APIRequestID="+transaction_id;
        
        axios.get(apiUrl) 
            .then((response) => {
                response.data.transactionID=response.data.rpid;
                response.data.message = response.data.msg;
                //resolve({ result: response.data, panel_id:4 });
                if(response.data.status == 1 || response.data.status == 2)
                {
                    if(response.data.status == 1){response.data.status = 'PROCESS';}
                    if(response.data.status == 2){response.data.status = 'SUCCESS';}
                    resolve({ result: response.data, panel_id:4 }); 
                }else{
                    //reject(new Error(response.data.msg));
                    response.data.status = 'FAILURE';
                    reject({ result: response.data, panel_id: 4 });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });
}


function kppsbbps(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, inputParam ) {
    
    let inputParamElemet = '';

    const jsonArray =  JSON.parse(inputParam);
    
    let i=1;
    
    for(const element of jsonArray.input)
    {
        const item = element;
        
        inputParamElemet += `&field${i}=${item.paramValue}`;
        i++;
    }
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl+"&number="+mobile_no+"&amount="+amount+"&operator="+operatorId+"&ref_id="+txnId+inputParamElemet;
        
        axios.get(apiUrl) 
            .then((response) => {
                
                response.data.transactionID=response.data.txn_id;
                if(response.data.status == 'Success' || response.data.status == 'Pending' || response.data.status == 'Accepted')
                {
                    if(response.data.status == 'Pending'){response.data.status = 'PROCESS';}
                    if(response.data.status == 'Success'){response.data.status = 'SUCCESS';}
                    if(response.data.status == 'Accepted'){response.data.status = 'ACCEPTED';}
                    resolve({ result: response.data, panel_id:panel_id }); 
                }else{
                    reject({ result: response.data, panel_id: panel_id });
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function ipayment(endpointUrl, requestId, txnId, operatorId, mobile_no, ConsumerNumber, amount, panel_id, circle_id ) {
    
    return new Promise((resolve, reject) => {
        let apiUrl = endpointUrl;
        const username = iPaymentConfig.clientId;
        const password = iPaymentConfig.clientSecret;

        const params = {
            circleId: circle_id,
            operatorId: operatorId,
            phone: mobile_no,
            amount: amount,
            clientRefId: requestId
          };
      
          const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
      
          axios.post(apiUrl, JSON.stringify(params), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': basicAuth,
            },
          })
          .then(response => {
            response.data.transactionID=response.data.data.txnId;
            if(response.data.status == 'PENDING' || response.data.status == 'SUCCESS')
            {
                if(response.data.status == 'PENDING'){response.data.status = 'PROCESS';}
                resolve({ result: response.data, panel_id:panel_id }); 
            }else{
                reject({ result: response.data, panel_id: panel_id });
            }
            
          })
          .catch(error => {
            console.error('Error:', error);
            reject(error);
          });   
    });

}



module.exports = {
    pbms,
    omega,
    tkdig,
    kpps,
    omega_test,
    ambika,
    kppsbbps,
    ipayment
};