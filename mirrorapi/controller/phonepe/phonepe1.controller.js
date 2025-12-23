const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const cheerio = require('cheerio');
const phonepeUtility = require('../../utility/phonepe.utility'); 
const utility = require('../../utility/utility'); 

require('dotenv').config();
const baseUrl = process.env.API_BASE_URL;

class Page {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
        async makePayment(req,res) {
	     
            const {user_id, amount,mobile} = req;
            
            const requiredKeys = Object.keys({user_id,amount,mobile});
                
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            //  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
            let t = await this.db.sequelize.transaction();
    
            try {
                const ref_id = 'M' + utility.generateUniqueNumeric(7);
                const Data = {
                    user_id,
                    amount: amount,
                    transaction_id: ref_id,
                    mobile: mobile,
                    created_by:user_id,
                };

                const generateUrlData = await this.db.phonepeTransaction.insertData(Data); 
                
                    if(generateUrlData){
    
                        const {request,result}= await phonepeUtility.pay_api(ref_id,user_id,amount,mobile);
                        
                        const updateData = { 
                                request_id:generateUrlData.id,
                                request:  JSON.stringify(request),
                                response: JSON.stringify(result),
                                response_code:result.code,
                                redirectUrl: result.data.instrumentResponse.redirectInfo.url,
                            }
                            const whereClause= {
                                user_id:user_id,
                                transaction_id:ref_id
                                }
                            
                            const savedResult = await this.db.phonepeTransaction.UpdateData(updateData,whereClause);
                            if(savedResult){
                                return res.status(200).json({ status: 200, message: 'Success', data: result });
                            }
                          
                        
                    
                    }else{
                        return res.status(404).json({ status: 404, message: 'Unable to insert data', data: [] });
                    }
                
        
            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                     return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }


       
        async phonepayRedirect(req,res,queryParam) {
	     
          
            let t = await this.db.sequelize.transaction();
    
            try {
                
                const { response } = queryParam;
                const decodedString = Buffer.from(response, 'base64').toString('utf-8');
                const jsonData= JSON.parse(decodedString);
                const callbackData = {
                    callback_enc_response: response,
                    decrypt_resonse:decodedString,
                    response_status:jsonData.code,
                    response_code:jsonData.data.responseCode,
                    response_message:jsonData.message,
                    merchant_id:jsonData.data.merchantId,
                    merchant_trancsaction_id:jsonData.data.merchantTransactionId,
                    transaction_id:jsonData.data.transactionId,
                    amount:jsonData.data.amount,
                    state:jsonData.data.state,
                    payment_details :JSON.stringify(jsonData.data.paymentInstrument),
                    payment_mode:jsonData.data.paymentInstrument.type,
                    response_from:'callback_redirect'
                };
                const generateUrlData = await this.db.phonepeCallback.insertData(callbackData); 
                const merchant_trancsaction_id= jsonData.data.merchantTransactionId;
                const amount= jsonData.data.amount;
                
                const ExistingRequest=await this.db.phonepeTransaction.getDataByTransaction(merchant_trancsaction_id,amount); 
                const order_id = ExistingRequest.order_id;
                const user_id = ExistingRequest.user_id;
                
                    if(ExistingRequest){
                        const Data ={
                                callback_response: decodedString,
                                response_code:jsonData.code
                        }
                        const whereCondition={
                                transaction_id:merchant_trancsaction_id,
                                amount:amount
                        }
                        const saveResponse=await this.db.phonepeTransaction.UpdateData(Data,whereCondition); 

                        if(jsonData.data.responseCode=='SUCCESS'){

                            const updatedRow= await this.db.upi_order.update(
                                {order_status:jsonData.data.responseCode},
                                { where: { user_id:user_id,order_id:order_id,order_status:'PENDING' } }
                            );

                            if(updatedRow){
                                let walletEntry = [];
                                const walletData={
                                    transaction_id:order_id,
                                    user_id:user_id,
                                    env:'PROD',
                                    type:'Credit',
                                    amount:amount,
                                    sub_type:'Add Money',
                                    tran_for:'main'
                                };
                                
                                 walletEntry = await this.db.wallet.insert_wallet(walletData);
                                 return res.status(200).json({ status: 200, message: 'Updated Successfully', data: [] });

                            }else{
                                return res.status(400).json({ status: 400, message: 'Not Updated', data: [] });
                            }

                        }else{
                            return res.status(400).json({ status: 400, message: jsonData.data.responseCode, data: [] });
                        }

                    }else{
                        return res.status(400).json({ status: 400, message: 'Unable to find Merchant Id', data: [] });
                    }
              

            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                     return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }


        async checkStatus(req,res) {
	     
            const {user_id, merchant_transaction_id } = req;
            let t = await this.db.sequelize.transaction();
    
            try {
                 
                  const ExistingRequest=await this.db.phonepeTransaction.getExistingRequest(merchant_transaction_id,user_id); 
                    if(ExistingRequest){
                        const response= await phonepeUtility.checkStatus(merchant_transaction_id);
                       
                        if(response){
                            const savedData = {
                                  
                                    decrypt_resonse:JSON.stringify(response),
                                    response_status:response.code,
                                    response_code:response.data.responseCode,
                                    response_message:response.message,
                                    merchant_id:response.data.merchantId,
                                    merchant_trancsaction_id:response.data.merchantTransactionId,
                                    transaction_id:response.data.transactionId,
                                    amount:response.data.amount,
                                    state:response.data.state,
                                    payment_details :JSON.stringify(response.data.paymentInstrument),
                                    payment_mode:response.data.paymentInstrument.type,
                                    response_from:'check_status'
                            };
                            const generateUrlData = await this.db.phonepeCallback.insertData(savedData); 
                            const merchant_trancsaction_id= response.data.merchantTransactionId;
                            const amount= response.data.amount;
                            
                            const ExistingRequest=await this.db.phonepeTransaction.getDataByTransaction(merchant_trancsaction_id,amount); 
                            const order_id = ExistingRequest.order_id;
                            const user_id = ExistingRequest.user_id;
                            
                                if(ExistingRequest){
                                    const Data ={
                                            callback_response: decodedString,
                                            response_code:response.code
                                    }
                                    const whereCondition={
                                            transaction_id:merchant_trancsaction_id,
                                            amount:amount
                                    }
                                    const saveResponse=await this.db.phonepeTransaction.UpdateData(Data,whereCondition); 
            
                                    // if(response.data.responseCode=='SUCCESS'){
                                        // const updatedRow= await this.db.upi_order.update(
                                        //     {order_status:response.data.responseCode},
                                        //     { where: { user_id:user_id,order_id:order_id,order_status:'PENDING' } }
                                        // );
            
                                        // if(updatedRow){
                                        //     let walletEntry = [];
                                        //     const walletData={
                                        //         transaction_id:order_id,
                                        //         user_id:user_id,
                                        //         env:'PROD',
                                        //         type:'Credit',
                                        //         amount:amount,
                                        //         sub_type:'Add Money',
                                        //         tran_for:'main'
                                        //     };
                                            
                                        //      walletEntry = await this.db.wallet.insert_wallet(walletData);
                                        //  return res.status(200).json({ status: 200, message: 'Updated Successfully', data: [] });
                                        // }else{
                                        //     return res.status(400).json({ status: 400, message: 'Not Updated', data: [] });
                                        // }
            
                                    }else{
                                        return res.status(400).json({ status: 400, message: jsonData.data.responseCode, data: [] });
                                    }
            
                                }else{
                                    return res.status(400).json({ status: 400, message: 'Unable to find Merchant Id', data: [] });
                                }
                          
                        }
                   
                
        
        
            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                     return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }

      

      
    
    


	

}





module.exports = new Page();