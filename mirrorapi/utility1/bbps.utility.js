const bbpsModule = require('../config/bbps.config');
const axios = require('axios');
const crypto = require('crypto');
const bbpsConfig = bbpsModule.bbps();
const utility = require('../utility/utility'); 
const fs = require('fs');
//const certificate = fs.readFileSync('../../billavenueUATCertificate.crt');
const os = require('os');
const { parseString } = require('xml2js');
const xmlbuilder = require('xmlbuilder');

const networkInterfaces = os.networkInterfaces();

// Extract IP addresses
const ipAddresses = Object.keys(networkInterfaces).reduce((result, interfaceName) => {
    const addresses = networkInterfaces[interfaceName].filter(info => info.family === 'IPv4').map(info => info.address);
    //return result.concat(addresses);
    return addresses[0];
}, []);

const macAddresses = Object.keys(networkInterfaces).reduce((result, interfaceName) => {
    const addresses = networkInterfaces[interfaceName].map(info => info.mac);
    //return result.concat(addresses);
    return addresses[0];
  }, []);



function bbpsBillerInfo(billerIds) {

    return new Promise((resolve, reject) => {

        let apiUrl = bbpsConfig.billerInfoUrl;
        const workingkey = bbpsConfig.workingkey;

        const accessCode = bbpsConfig.accesscode;
        const requestId = utility.generateRequestId();
        const ver = bbpsConfig.ver;
        const instituteId = bbpsConfig.instituteId;
        
        //const billerId= 'OTME00005XXZ43';

        const encRequest = billerInfoXML(billerIds, workingkey).toString();
        apiUrl += `?accessCode=${accessCode}&ver=${ver}&requestId=${requestId}&instituteId=${instituteId}`;
        const postData = {
            accessCode,
            requestId,
            ver,
            instituteId
          };
          

        const reqData = {
            'accessCode': accessCode,
            'requestId': requestId,
            'ver': ver,
            'instituteId': instituteId,
            'billerId': billerIds,
            'encRequest': encRequest,
            'url': apiUrl
        };
                
        axios.post(apiUrl, encRequest,  {
          headers: {
            'Content-Type': 'text/plain', // Set the content type to JSON
          }})
        .then((response) => {
                if (isHTML(response.data)) {
                    resolve({ result: response.data, reqData:reqData });
                } else {
                    reqData.encResponse = response.data;
                    //resolve({ result: utility.bbpsDecrypt(response.data, workingkey),  reqData:reqData});
                    const xmlString = utility.bbpsDecrypt(response.data, workingkey).toString();
                    parseString(xmlString, { explicitArray: false }, (err, result) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                        reject(err);
                        } else {
                            response.data = result;
                            resolve({ result: result, reqData: reqData });
                        }
                    });
                    
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function bbpsBillFetch(biller_id, inputParam, mobile_no, email) {

    return new Promise((resolve, reject) => {

        let apiUrl = bbpsConfig.billFetchUrl;
        const workingkey = bbpsConfig.workingkey;

        const accessCode = bbpsConfig.accesscode;
        const requestId = utility.generateRequestId();
        const ver = bbpsConfig.ver;
        const instituteId = bbpsConfig.instituteId;

        //const agentId = 'CC01CC01513515340681';
        // const billerId= 'OTME00005XXZ43';
        // const mobile_no = '8102159764';
        // const email = '0365shashikumar@gmail.com';

        const encRequest = billFetchXML(biller_id, inputParam, mobile_no, email, ipAddresses, macAddresses, workingkey).toString();
        //resolve({ result: encRequest, reqData:'' });
        apiUrl += `?accessCode=${accessCode}&ver=${ver}&requestId=${requestId}&instituteId=${instituteId}&encRequest=${encRequest}`;
        const postData = {
            accessCode,
            requestId,
            ver,
            instituteId,
            encRequest
          };
        const reqData = {
            'accessCode': accessCode,
            'requestId': requestId,
            'ver': ver,
            'instituteId': instituteId,
            'billerId': biller_id,
            'mobile_no': mobile_no,
            'email': email,
            'encRequest': encRequest,
            'url': apiUrl
        };
        
        
        axios.post(apiUrl, postData)
        .then((response) => {
                if (isHTML(response.data)) {
                    resolve({ result: response.data, reqData:reqData });
                    
                } else {
                    reqData.encResponse = response.data;
                    const xmlString = utility.bbpsDecrypt(response.data, workingkey).toString();
                    parseString(xmlString, { explicitArray: false }, (err, result) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                        reject(err);
                        } else {
                            response.data = result;
                            resolve({ result: result, reqData: reqData });
                        }
                    });
                    
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function bbpsBillPay(bill_amount, billerId, request_id, biller_adhoc, mobile_no, email, inputParams, biller_response, additional_info) {

    return new Promise((resolve, reject) => {

        let apiUrl = bbpsConfig.billPayUrl;
        const workingkey = bbpsConfig.workingkey;

        const accessCode = bbpsConfig.accesscode;
        const requestId = request_id;
        const ver = bbpsConfig.ver;
        const instituteId = bbpsConfig.instituteId;

        const encRequest = billPayXML(bill_amount, billerId, biller_adhoc, mobile_no, email, ipAddresses, macAddresses, workingkey, inputParams, biller_response, additional_info).toString();

        // resolve({ result: encRequest, reqData:'' });
        apiUrl += `?accessCode=${accessCode}&ver=${ver}&requestId=${requestId}&instituteId=${instituteId}&encRequest=${encRequest}`;
        const postData = {
            accessCode,
            requestId,
            ver,
            instituteId,
            encRequest
          };
        const reqData = {
            'accessCode': accessCode,
            'requestId': requestId,
            'ver': ver,
            'instituteId': instituteId,
            'billerId': billerId,
            'mobile_no': mobile_no,
            'email': email,
            'encRequest': encRequest,
            'url': apiUrl
        };
        
        
        axios.post(apiUrl, postData)
        .then((response) => {
                if (isHTML(response.data)) {
                    resolve({ result: response.data, reqData:reqData });
                } else {
                    reqData.encResponse = response.data;
                    const xmlString = utility.bbpsDecrypt(response.data, workingkey).toString();
                    parseString(xmlString, { explicitArray: false }, (err, result) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                        reject(err);
                        } else {
                            response.data = result;
                            resolve({ result: result, reqData: reqData });
                        }
                    });
                    
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function bbpsQuickPay(bill_amount, billerId, biller_adhoc, mobile_no, email, inputParams) {

    return new Promise((resolve, reject) => {

        let apiUrl = bbpsConfig.billPayUrl;
        const workingkey = bbpsConfig.workingkey;
        const requestId = utility.generateRequestId();
        const accessCode = bbpsConfig.accesscode;
        const ver = bbpsConfig.ver;
        const instituteId = bbpsConfig.instituteId;

        const encRequest = quickPayXML(bill_amount, billerId, biller_adhoc, mobile_no, email, ipAddresses, macAddresses, workingkey, inputParams).toString();

        //resolve({ result: encRequest, reqData:'' });
        apiUrl += `?accessCode=${accessCode}&ver=${ver}&requestId=${requestId}&instituteId=${instituteId}&encRequest=${encRequest}`;
        const postData = {
            accessCode,
            requestId,
            ver,
            instituteId,
            encRequest
          };
        const reqData = {
            'accessCode': accessCode,
            'requestId': requestId,
            'ver': ver,
            'instituteId': instituteId,
            'billerId': billerId,
            'mobile_no': mobile_no,
            'email': email,
            'encRequest': encRequest,
            'url': apiUrl
        };
        
        
        axios.post(apiUrl, postData)
        .then((response) => {
                if (isHTML(response.data)) {
                    resolve({ result: response.data, reqData:reqData });
                } else {
                    reqData.encResponse = response.data;
                    const xmlString = utility.bbpsDecrypt(response.data, workingkey).toString();
                    parseString(xmlString, { explicitArray: false }, (err, result) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                        reject(err);
                        } else {
                            response.data = result;
                            resolve({ result: result, reqData: reqData });
                        }
                    });
                    
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function isHTML(data) {
    // Check if the data contains HTML tags
    return /<\/?[a-z][\s\S]*>/i.test(data);
}



function billerInfoXML(billerIds, working_key)
{   
    let idElement = '';
    if(billerIds.length > 0)
    {
        for(const billid of billerIds)
        {
            idElement += `<billerId>${billid}</billerId>`;
        }
    }
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <billerInfoRequest>
    ${idElement}
    </billerInfoRequest>`;
        
    return utility.bbpsEncrypt(xmlString, working_key);
}

function billFetchXML(billerId, inputParam, mobile_no, email, ipAddress, macAddresses, working_key)
{
    let inputParamElemet = '';
    
    let jsonArray = inputParam;
    if (!Array.isArray(jsonArray)) {
        jsonArray = [jsonArray];
      }
    
    for(const element of jsonArray)
    {
        const item = element;
        
        inputParamElemet += `<input>
            <paramName>${item.paramName}</paramName>
            <paramValue>${item.paramValue}</paramValue>
        </input>`;
    }


    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <billFetchRequest>
       <agentId>CC01CV23MOBU00000001</agentId>
       <agentDeviceInfo>
          <ip>${ipAddress}</ip>
          <initChannel>MOB</initChannel>
          <imei>355882069700468</imei>
          <app>AIAPP</app>
          <os>Android</os>
       </agentDeviceInfo>
       <customerInfo>
          <customerMobile>${mobile_no}</customerMobile>
          <customerEmail>${email}</customerEmail>
          <customerAdhaar></customerAdhaar>
          <customerPan></customerPan>
       </customerInfo>
       <billerId>${billerId}</billerId>
       <inputParams>
            ${inputParamElemet}
       </inputParams>
    </billFetchRequest>`;
    return utility.bbpsEncrypt(xmlString, working_key);
}



function billPayXML(bill_amount, billerId, biller_adhoc, mobile_no, email, ipAddresses, macAddresses, working_key, inputParams, biller_response, additional_info)
{

  const inputParamsXml = xmlbuilder.create({ inputParams: JSON.parse(inputParams) }, { headless: true }).end({ pretty: true });
  const biller_responseXml = xmlbuilder.create({ billerResponse: JSON.parse(biller_response) }, { headless: true }).end({ pretty: true });
  const additional_infoXml = xmlbuilder.create({ additionalInfo: JSON.parse(additional_info) }, { headless: true }).end({ pretty: true });

    
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <billPaymentRequest>
            <agentId>CC01CV23MOBU00000001</agentId>
            <billerAdhoc>${biller_adhoc}</billerAdhoc>
            <agentDeviceInfo>
                <ip>${ipAddresses}</ip>
                <initChannel>MOB</initChannel>
                <imei>355882069700468</imei>
                <app>AIAPP</app>
                <os>Android</os>
            </agentDeviceInfo>
            <customerInfo>
                <customerMobile>${mobile_no}</customerMobile>
                <customerEmail>${email}</customerEmail>
                <customerAdhaar></customerAdhaar>
                <customerPan></customerPan>
            </customerInfo>
            <billerId>${billerId}</billerId>
        ${inputParamsXml}
        ${biller_responseXml}
        ${additional_infoXml}
            <amountInfo>
                <amount>${bill_amount*100}</amount>
                <currency>356</currency>
                <custConvFee>0</custConvFee>
                <amountTags></amountTags>
            </amountInfo>
            <paymentMethod>
                <paymentMode>Internet Banking</paymentMode>
                <quickPay>N</quickPay>
                <splitPay>N</splitPay>
            </paymentMethod>
            <paymentInfo>
                <info>
                    <infoName>IFSC</infoName>
                    <infoValue>ICIC0000104</infoValue>
                </info>
                <info>
                    <infoName>AccountNo</infoName>
                    <infoValue>AIPL5084CV231838</infoValue>
                </info>
            </paymentInfo>
        </billPaymentRequest>`;
       
    return utility.bbpsEncrypt(xmlString, working_key);
}


function quickPayXML(bill_amount, billerId, biller_adhoc, mobile_no, email, ipAddresses, macAddresses, working_key, inputParams)
{

    let inputParamElemet = '';
    
    let jsonArray = inputParams;
    if (!Array.isArray(jsonArray)) {
        jsonArray = [jsonArray];
      }
    
    for(const element of jsonArray)
    {
        const item = element;
        
        inputParamElemet += `<input>
            <paramName>${item.paramName}</paramName>
            <paramValue>${item.paramValue}</paramValue>
        </input>`;
    }

    
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <billPaymentRequest>
            <agentId>CC01CV23MOBU00000001</agentId>
            <billerAdhoc>${biller_adhoc}</billerAdhoc>
            <agentDeviceInfo>
                <ip>${ipAddresses}</ip>
                <initChannel>MOB</initChannel>
                <imei>355882069700468</imei>
                <app>AIAPP</app>
                <os>Android</os>
            </agentDeviceInfo>
            <customerInfo>
                <customerMobile>${mobile_no}</customerMobile>
                <customerEmail>${email}</customerEmail>
                <customerAdhaar></customerAdhaar>
                <customerPan></customerPan>
            </customerInfo>
            <billerId>${billerId}</billerId>
            <inputParams>
                ${inputParamElemet}
            </inputParams>
            <amountInfo>
                <amount>${bill_amount*100}</amount>
                <currency>356</currency>
                <custConvFee>0</custConvFee>
                <amountTags></amountTags>
            </amountInfo>
            <paymentMethod>
                <paymentMode>Internet Banking</paymentMode>
                <quickPay>Y</quickPay>
                <splitPay>N</splitPay>
            </paymentMethod>
            <paymentInfo>
                <info>
                    <infoName>IFSC</infoName>
                    <infoValue>ICIC0000104</infoValue>
                </info>
                <info>
                    <infoName>AccountNo</infoName>
                    <infoValue>AIPL5084CV231838</infoValue>
                </info>
            </paymentInfo>
        </billPaymentRequest>`;

    return utility.bbpsEncrypt(xmlString, working_key);
}


module.exports = {
    bbpsBillerInfo,
    bbpsBillFetch,
    bbpsBillPay,
    bbpsQuickPay
    
};