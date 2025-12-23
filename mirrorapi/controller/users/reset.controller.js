const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const whatsappUtility = require('../../utility/whatsapp.utility');
const notificationUtility = require('../../utility/fcm_notification.utitlity');
const messagingService = require('../../router/whatsapp/messagingService');


class Reset {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	
    async resetPassword(req,res) {
	    
	    const decryptedObject = utility.DataDecrypt(req.encReq);
            
		let results = {};
		const {
		    mobile,
		    password,
            confirmPassword
		} = decryptedObject;
	
		    const requiredKeys = Object.keys({  mobile,password,confirmPassword});
            
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined ) ) {
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
            
            if(req.password!=req.confirmPassword){
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Password & confirm password are not match' })));
            }
            
        try {
            
                let date = new Date();
                let modified_date = utility.formatDateTime(date);
                
                const userCount = await this.db.user.count({
                                  where: {
                                    mobile: mobile
                                  }
                                });

                if(userCount>0){
                    
                     const userRow = await this.db.user.findOne({
                                            where: {
                                            mobile: mobile
                                            },
                                            //limit: 1, // Limit the result to one row
                                            logging: sql => console.log(sql) // Log the SQL query
                                         });
                                         
                                         
                        const user_token=await this.db.fcm_notification.getFcmToken(userRow.id);
                        const fcmTokens = user_token ? user_token.token : '';
                                         
                         const updateData = {       password: bcrypt.hashSync(password, 10),
                                                    modified_by: userRow.id,
                                                    modified_on: modified_date,
                                            };
                                            
                              // Update the row in the database
                           const results= await this.db.user.update(updateData, {
                                where: {
                                   id: userRow.id
                                },
                              });
              
                       
			
		
        				if (results) {
        				    
        				    
        				        //const regdt=userRow.created_on;
                                
                                const registration = userRow.created_on;//regdt.match(/^\d{4}-\d{2}-\d{2}/)[0];
                                const registrationDate = new Date(registration);
                                const currentDate = new Date();
                                const differenceInMilliseconds = currentDate.getTime() - registrationDate.getTime();
                                const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);



                                if(differenceInDays>60 )
                                {
                                    await this.deductRequest(userRow.id);
                                }
                                
                                //send whatsapp message
                                try {
                                   const message = await whatsappUtility.forgotPasswordMessage(userRow.first_name, userRow.last_name, mobile);
                                   const emailMsg = await emailUtility.passwordResetEmail(userRow.first_name, userRow.last_name, mobile);
                                   messagingService.sendMessage(userRow.mobile, message,null,userRow.email,"Password Reset Alert",emailMsg);
                                    
                                     } catch (error) {
                                     console.log('Error in whatsapp message', error);
                                  }
                                

                             if(fcmTokens.length > 0) {
                                const notification = await notificationUtility.forgotPasswordNotification(fcmTokens,userRow.first_name,userRow.last_name,userRow.id);
                                await this.db.log_app_notification.insertData(notification);
                             }
                             
                             const passwordLog = {
                                user_id: userRow.id,
                                service_type: 'Forgot Password', 
                              }
                              await this.db.userService.insertData(passwordLog);
        				    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message: 'Updated successfuly' })));
        				} else {
        				    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Failed to update' })));
        				}
        				
        				
                        }else{
                                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Not Exist' })));
                                //return res.status(500).json({ status: 500,error: 'Not Exist' });
                			}
                 
				
            
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
			if (error.name === 'SequelizeValidationError') {
			  const validationErrors = error.errors.map((err) => err.message);
			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
			  //return res.status(500).json({ status: 500,errors: validationErrors });
			}
			
			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
			//return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
		return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));
    }
   
	
    async deductRequest(user_id)
    {
        try 
        {
            
          const order_id=utility.generateUniqueNumeric(7);
            const orderData = {
                user_id:user_id,
                env:config.env, 
                tran_type:'Debit',
                tran_sub_type:'Change Password',
                tran_for:'Change Password',
                trans_amount:1,
                currency:'INR',
                order_id,
                order_status:'SUCCESS',
                created_on:Date.now(),
                created_by:user_id,
                ip_address:0
            };
              
            const generateorder = await this.db.upi_order.insertData(orderData); 
            if(generateorder)
            {
              //entry in wallet for deduction
              const walletData = {
                transaction_id:order_id,
                user_id:user_id,
                env:config.env,
                type:'Debit',
                amount:1,
                sub_type:'Change Password',
                tran_for:'main'
            };
            
            await this.db.wallet.insert_wallet(walletData);
            }
            
            return  true;
        } catch (error) {
            console.error(error.message);
            return  false;
        }
    }

    async adminResetPassword(req,res) 
        {  
          let results = {};
          const {
              userid,
              oldpassword,
              password
          } = req;
    
          const requiredKeys = Object.keys({  userid,password,oldpassword});
              
          if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined ) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }
              
          try {
              
              let date = new Date();
              let modified_date = utility.formatDateTime(date);
              let old_password = bcrypt.hashSync(oldpassword, 10)
              const userRow = await this.db.user.findOne({
                where: {
                id: userid
                },
              });
    
              if(userRow){
                    
                    const passwordMatch = await bcrypt.compare(oldpassword, userRow.password);
                    if(passwordMatch) {
                      const updateData = {       
                        password: bcrypt.hashSync(password, 10),
                        modified_by: userid,
                        modified_on: modified_date,
                      };
                                        
                          // Update the row in the database
                      const results= await this.db.user.update(updateData, {
                          where: {
                              id: userid
                          },
                        });
                        return res.status(200).json({ status: 200,  message: 'Updated successfully' });
                    }else{
                      return res.status(500).json({ status: 500,error: 'Wrong! Old Password' });
                    }
    
              }else{
                return res.status(500).json({ status: 500,error: 'User not found' });
              }
    
                  
              } catch (error) {
                  logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
            
                   return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
            return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
          }


	

	}





module.exports = new Reset();