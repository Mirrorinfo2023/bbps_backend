const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

class Mpin {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	async getMpin(req,res){
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { mpin,user_id,action,app_id,token} = decryptedObject;
    	  
        const requiredKeys = Object.keys({ mpin,user_id,app_id});
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined ) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        try {
           
            let date = new Date();
            let modified_on = utility.formatDateTime(date);

            const logMpinData = { 
                user_id: user_id, 
                mpin, 
                status:1, 
                created_by:user_id,
                created_on:modified_on,
                app_id
               
            };
            const mpinLog = await this.db.mpin.insertData(logMpinData);
            
            // Token Register
            if(token)
            {
                 await this.db.fcm_notification.insertData(
                    {
                        user_id,
                        token,
                        app_id,
                    },
                  );
            }
            
            if(mpinLog){
                const userRow = await this.db.user.getDataExistingUser(['id','mpin', 'status','created_on'], {id: user_id });
                if(userRow){
                    
                    if(userRow.status == 1 || userRow.status=='1')
                    {
              
                        if( userRow.mpin==null)
                        {
                            await this.setMpin(user_id, mpin);
                            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,token:'',message: 'MPIN set successful',data: [] })));
                            // return res.status(200).json({ status: 200,token:'',message: 'MPIN set successful',data: [] });
                        }
                        if( userRow.mpin!=null){
    
                            if(action=='Update'){
                                const upmpin = await this.forgotMpin(user_id, mpin);
                                
                                const regdt=userRow.created_on;
                                
                                const registration = regdt.match(/^\d{4}-\d{2}-\d{2}/)[0];
                                const registrationDate = new Date(registration);
                                const currentDate = new Date();
                                const differenceInMilliseconds = currentDate.getTime() - registrationDate.getTime();
                                const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);



                                if(upmpin && differenceInDays>45 )
                                {
                                    await this.deductRequest(user_id);
                                }
                                
                                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,token:'',message: 'MPIN set successful',data: [] })));
                                // return res.status(200).json({ status: 200,token:'',message: 'MPIN set successful',data: [] });
                            }else{
                                const result = await this.checkMpin(user_id, mpin,mpinLog.id);
                                if(result.status==true){
                                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,token:'',message: result.text,data: [] })));
                                    // return res.status(200).json({ status: 200,token:'',message: result.text,data: [] });
                                }else{
                                    if(result.attempt==5){
                                        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401,token:'',message: result.text,data: [] })));
                                    }else{
                                        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,token:'',message: result.text,data: [] })));
                                        // return res.status(400).json({ status: 400,token:'',message: result.text,data: [] });
                                    }
                                }
                            }
                        }

                    }else{
                            return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401,token:'',message: 'You are temporarily blocked. Please contact the Support Team at 9112421742.',data: [] })));
                        }
                }else{
                    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 200,token:'',message: 'User Not Found',data: [] })));
                    // return res.status(400).json({ status: 200,token:'',message: 'User Not Found',data: [] });
                }
            }




        }catch (err) {
                logger.error(`Unable to find user: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			//   return res.status(500).json({ status: 500,errors: validationErrors });
    			}
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			//  return res.status(500).json({ status: 500,token:'', message: err,data: []  });
        }
  

    }
  
  
  
    async setMpin(user_id, mpin){


        let date = new Date();
        let modified_on = utility.formatDateTime(date);
        const updateData = {       
            mpin,
            modified_by: user_id,
            modified_on,
        };
        return   await this.db.user.updateData(updateData, user_id );


    }

    async checkMpin(user_id, mpin, mpinLogId){
            let msg=[];

            let whereCondition ;
            let date = new Date();
            let modified_on = utility.formatDateTime(date);

            const userRow = await this.db.user.getData(['id','mpin'], {id: user_id });
            
            if(userRow.mpin==mpin){
                msg.status=true;
                msg.text='MPIN MATCH SUCCESSFULLY';

                return msg;
              
            }

        
            const startDate =new Date(modified_on);
            startDate.setHours(0, 0, 0);

            const endDate =new Date(modified_on);
            endDate.setHours(23, 59, 59);
         

            whereCondition = {
                'created_on': {
                  [Op.between]: [startDate, endDate]
                },
                user_id: user_id,
                status:0,
            }
          
            const mpinLogCount = await this.db.mpin.getWrongMpinCount(whereCondition);

            msg.status=false;
            msg.attempt = 0;
            msg.text='MPIN Not Match.';
            
            if(mpinLogCount==0){
                msg.attempt = 1;
                msg.text = 'MPIN Not Match 4 attempt Remaining';
            }
            if(mpinLogCount==1){
                msg.attempt = 2;
                msg.text = 'MPIN Not Match 3 attempt Remaining';
            }
            if(mpinLogCount==2){
                msg.attempt = 3;
                msg.text = 'MPIN Not Match 2 attempt Remaining';
            }
            if(mpinLogCount==3){
                msg.attempt = 4;
                msg.text = 'MPIN Not Match 1 attempt Remaining';
            }

            

            if(mpinLogCount>=4){
                const id=user_id;
                const data=  {
                    id :user_id,         
                    status:0,
                    modified_on:modified_on
                };
               const updatedUserStatus = await this.db.user.updateData(data,user_id);
               msg.attempt = 5;
               msg.status=false;
               msg.text='Dear user, You have a cross limit of unsuccessful mpin login. Your account is freez. Please contact the Support Team at 9112421742.';

            }
            

            const updateLog = {       
                                               
                status:0, 
                modified_by:user_id,
                modified_on:modified_on,
                action: msg.text,
             
            };

            const whereCond={
                id: mpinLogId
            }
            const resultsLog= await this.db.mpin.UpdateData(updateLog, whereCond );
            return msg;


    }
  

    async forgotMpin(user_id, mpin){


        let date = new Date();
        let modified_on = utility.formatDateTime(date);
        const updateData = {       
            mpin,
            modified_by: user_id,
            modified_on,
        };
        return await this.db.user.updateData(updateData, user_id );


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
                tran_sub_type:'Change Mpin',
                tran_for:'Change Mpin',
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
                sub_type:'Change Mpin',
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
  
  
  


}




module.exports = new Mpin();