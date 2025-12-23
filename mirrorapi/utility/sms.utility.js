	const smsModule = require('../config/sms.config');
	const axios = require('axios');
	const crypto = require('crypto');
	const smsConfig = smsModule.sms();
	
	function generateOTP() {

         let otp = '000000'; 
        
          while (otp.replace(/0/g, '').length < 4) {
            // Generate a new OTP
            otp = crypto.randomBytes(3).toString('hex');
            otp = otp.replace(/[^0-9]/g, '').padStart(6, '0');
          }
        
          return otp;
        }

	
	function SendOtp(mobileNo, otp){
	   
			return new Promise((resolve, reject) => {
			    
			    
			const url = smsConfig.sms_url;
            const user = smsConfig.username;
            const password = smsConfig.password;
            const mobilenumbers = mobileNo;
            const senderid = smsConfig.senderid;
            const messagetype = smsConfig.messagetype;
            const t_id = smsConfig.template_id;
            //const otp = generateOTP();
            
            const sms_data = {
              //sms: `${otp} is your verification code. Please do not share it with anyone. ${smsConfig.company}`
              sms: `${otp} is your verification code. plz do not share anyone. From Mirror Global`
              //sms: `${otp} is your OTP for proceeding with JOBBERSHUB App. Plz don't share this with anyone. JOBBERSHUB MARKETING`
            };
            
            
            const message = encodeURIComponent(sms_data.sms);
            //const data = `type=${messagetype}&user=${user}&pass=${password}&sender=${senderid}&to_mobileno=${mobilenumbers}&sms_text=${message}&t_id=${t_id}`;
            const data = `User=${user}&passwd=${password}&mobilenumber=${mobilenumbers}&message=${message}&sid=${senderid}&mtype=${messagetype}`;
            
            axios.post(url, data, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              httpsAgent: { rejectUnauthorized: false }, // To disable SSL verification
            })
              .then((response) => {
                console.log(otp); // Handle the response data as needed
                resolve({ data: response.data, otp }); 
               
              })
              .catch((error) => {
                console.log(error);
                 reject(error); 
              });
              
			});
			
		}
		
		
		
		function countrySendOtp(mobileNo, otp){
	        // sms country
			return new Promise((resolve, reject) => {
			    
			    
    			let url = smsConfig.ssms_url;
                const mobilenumbers = mobileNo;
                const senderid = smsConfig.ssenderid;
                const authToken = Buffer.from(`${smsConfig.auth_key}:${smsConfig.auth_token}`).toString('base64');
    
                const sms = `${otp} is your Mirror Hub verification code. plz, don't share with anyone. if you have any query plz call on helpline number 9112421742`
    
                const reqBody = {
                  "Text" : sms,
                  "Number" : mobilenumbers,
                  "SenderId" : senderid,
                  "DRNotifyUrl" : smsConfig.notifyUrl,
                  "DRNotifyHttpMethod" : "POST",
                  "Tool":"API"
                }
                
                
                // const message = encodeURIComponent(sms_data.sms);
    
                axios.post(url, reqBody, {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization' : `Basic ${authToken}`
                    }
                  })
                    .then((response) => {
                      resolve({ data: response.data, otp: otp, authToken: authToken }); 
                     
                    })
                    .catch((error) => {
                      console.log(error);
                       reject(error); 
                  });
              
			});
			
		}
			
	

module.exports = {
  SendOtp,
  generateOTP,
  countrySendOtp
};