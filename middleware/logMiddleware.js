const { connect } = require('../config/db.config');
const utility = require('../utility/utility');
const logMiddleware = (req, res, next) => {

  //console.log(connect())
  const db = connect();

   //onsole.log(db.log);

	const { method, originalUrl } = req;
	 let responseSent = false;
   
	 const originalJson = res.json;
   
	 res.json = function (data) {
	   if (!responseSent) {
		 responseSent = true;
		const status = res.statusCode;
		const success = status >= 200 && status < 400;
		const response_message = success ? 'Success' : 'Failure';
	
		const response_header = JSON.stringify(res._headers);
	
		const request_header = JSON.stringify(req.headers);
        const original_url=originalUrl;
        const log_date = new Date().toISOString().slice(0, 10);
        const client_ip = req.headers['x-device-ip'] || req.ip;
        
        let request_body = JSON.stringify(req.body);
        let  response_body = JSON.stringify(res.body);
        
        if (req.body.encReq) {
            
            request_body = JSON.stringify(utility.DataDecrypt(req.body.encReq)) ;
            
        }
        
       
        
        
        
     const logdata={method,original_url,status,success,response_message,response_header,response_body,request_body,request_header,log_date,client_ip};
  
     try{
   

    db.log.create(logdata, (error, createdLog) => {
      if (error) {
        console.log('Error creating log entry:', error);
      } 
    });
      
     }catch(err){
         
      console.log(err.message);

     }

    
    }
   
	   originalJson.call(this, data); // Call the original res.json method
	 };
   
	 next();
   };
   
   module.exports = logMiddleware;