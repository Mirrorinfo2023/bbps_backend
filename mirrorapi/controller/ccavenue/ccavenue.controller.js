const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
//const pino = require('pino');
//const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const fs = require('fs');
var http = require('http');
var ccav = require('../../utility/ccavutil.js');
var crypto = require('crypto');
var  qs = require('querystring');

class CCAvenue {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async payment(request,response) {
    
    return new Promise((resolve, reject) => {    
        
    var body = '',
    workingKey = '',	//Put in the 32-Bit key shared by CCAvenues.
    accessCode = '',			//Put in the Access Code shared by CCAvenues.
    encRequest = '',
    formbody = '';

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

    request.on('data', function (data) {
	body += data;
	encRequest = ccav.encrypt(body, keyBase64, ivBase64); 
	formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });
				
    request.on('end', function () {
        response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
	 resolve();
    });
    
    
    request.on('error', function (error) {
        reject(error); 
    });
        
        
    });
 
   
   
          

    }
    
    
    async paymentResponse(request,response) {
    
    
     return new Promise((resolve, reject) => {  
         
    var ccavEncResponse='',
	ccavResponse='',	
	workingKey = '',	//Put in the 32-Bit key shared by CCAvenues.
	ccavPOST = '';
	
    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

        request.on('data', function (data) {
	    ccavEncResponse += data;
	    ccavPOST =  qs.parse(ccavEncResponse);
	    var encryption = ccavPOST.encResp;
	    ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
        });

	request.on('end', function () {
	    var pData = '';
	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'	
	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
	    pData = pData + '</td></tr></table>'
            htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
            response.writeHeader(200, {"Content-Type": "text/html"});
	    response.write(htmlcode);
	    response.end();
	    resolve();
	}); 
	
	 
    request.on('error', function (error) {
        reject(error); 
    });
    
    
    
    
     }); 
	
	
	
	
     }
     
     


}




module.exports = new CCAvenue();