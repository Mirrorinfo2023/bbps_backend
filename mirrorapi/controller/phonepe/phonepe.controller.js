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
    
    
        async paymentRequest(req,res, ipAddress) {
	        const decryptedObject = utility.DataDecrypt(req.encReq);
            const {user_id, amount} = decryptedObject;
            
            const requiredKeys = Object.keys({user_id,amount});
                
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
             return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
            
            let t = await this.db.sequelize.transaction();
    
            try {


                const ref_id = 'M' + utility.generateUniqueNumeric(7); //merchant Transaction Id
                const order_id = utility.generateUniqueNumeric(7); // order id
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

                const inputData = {
                    user_id,
                    amount: amount,
                    transaction_id: order_id,
                    created_by:user_id,
                    order_id: ref_id,
                    response_status: 'PENDING'
                };

                const upi_orderData= {
                    user_id:user_id,
                    env:'PROD',
                    tran_type:'Credit',
                    tran_sub_type:'PHONEPE',
                    tran_for:'Add Money',
                    trans_amount:amount,
                    currency:'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on,
                    created_by:user_id,
                   ip_address: ipAddress
                };
                
                const newUpiAddMoney = await this.db.upi_order.insertData(upi_orderData);

                const generateUrlData = await this.db.phonepeTransaction.insertData(inputData); 
                
                if(generateUrlData){
                    // return res.status(200).json({ status: 200, message: 'Success', data: result });
                     return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: generateUrlData })));

                }else{
                    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to insert data', data: [] })));
                    // return res.status(404).json({ status: 404, message: 'Unable to insert data', data: [] });
                }
                
        
            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
                       //return res.status(500).json({ status: 500,errors: validationErrors});
                    }
                    //return res.status(500).json({ status: 500, message: err.message,data: []  }); 
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
                }
    
        }
        
        
        async paymentResponse(req,res) 
        {
            const result = `eyJzdWNjZXNzIjp0cnVlLCJjb2RlIjoiUEFZTUVOVF9TVUNDRVNTIiwibWVzc2FnZSI6IllvdXIgcGF5bWVudCBpcyBzdWNjZXNzZnVsLiIsImRhdGEiOnsibWVyY2hhbnRJZCI6Ik1JUlJPUklOT05MSU5FIiwibWVyY2hhbnRUcmFuc2FjdGlvbklkIjoiTTU0NTUwOTExIiwidHJhbnNhY3Rpb25JZCI6IlQyNDA1MzExNjUyNDA5NTIyMjk2NDMxIiwiYW1vdW50IjoxNjAwLCJzdGF0ZSI6IkNPTVBMRVRFRCIsInJlc3BvbnNlQ29kZSI6IlNVQ0NFU1MiLCJwYXltZW50SW5zdHJ1bWVudCI6eyJ0eXBlIjoiVVBJIiwidXRyIjoiNDUxODI4NTc1MDg3IiwidXBpVHJhbnNhY3Rpb25JZCI6IllCTGJlZmJlNjY2YjdjZTRmNjNiY2ZlY2IzYTBlZTNjZGI5IiwiY2FyZE5ldHdvcmsiOm51bGwsImFjY291bnRUeXBlIjoiU0FWSU5HUyJ9LCJmZWVzQ29udGV4dCI6eyJhbW91bnQiOjB9fX0=`
            //const jsonObject = JSON.parse(result);
            //const responseData = jsonObject.response;
            
            const decodedData = Buffer.from(result, 'base64').toString('utf-8');
            return JSON.parse(decodedData);
            
	       // const decryptedObject = utility.DataDecrypt(req.encReq);
        //     const { user_id, transaction_merchant_id, amount, payment_status, payment_response } = decryptedObject;
            
        //     const requiredKeys = Object.keys({ user_id, transaction_merchant_id, amount, payment_status });
                
        //     if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //         // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        //      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        //     }
          
        //     let t = await this.db.sequelize.transaction();
    
        //     try {
                
        //         const currentDate = new Date();
        //         const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                
        //         const ExistingRequest = await this.db.phonepeTransaction.getDataByTransaction(transaction_merchant_id,amount); 
                
        //         const transaction_id = ExistingRequest.transaction_id;
                
        //             if(ExistingRequest){
        //                 const updateData = {
        //                         response: JSON.stringify(payment_response),
        //                         response_status: payment_status,
        //                         status: (payment_status=='SUCCESS')?1:3,
        //                         modified_on: modified_on
        //                 }
        //                 const whereCondition={
        //                         order_id:transaction_merchant_id,
        //                         amount:amount
        //                 }
        //                 const saveResponse=await this.db.phonepeTransaction.UpdateData(updateData,whereCondition); 

        //                 if(payment_status=='SUCCESS'){

        //                     const updatedRow= await this.db.upi_order.update(
        //                         { order_status: payment_status},
        //                         { where: { user_id:user_id,order_id:transaction_id,order_status:'PENDING' } }
        //                     );

        //                     if(updatedRow){
        //                         let walletEntry = [];
        //                         const walletData={
        //                             transaction_id:transaction_id,
        //                             user_id:user_id,
        //                             env:'PROD',
        //                             type:'Credit',
        //                             amount:amount,
        //                             sub_type:'Add Money',
        //                             tran_for:'main'
        //                         };
                                
        //                          walletEntry = await this.db.wallet.insert_wallet(walletData);
        //                         //  return res.status(200).json({ status: 200, message: 'Updated Successfully', data: [] });
        //                          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Updated Successfully', data: [] })));

        //                     }else{
        //                          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Not Updated', data: [] })));
        //                         // return res.status(400).json({ status: 400, message: 'Not Updated', data: [] });
        //                     }

        //                 }else{
        //                       return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: jsonData.data.responseCode, data: [] })));
        //                     // return res.status(400).json({ status: 400, message: jsonData.data.responseCode, data: [] });
        //                 }

        //             }else{
        //                 return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to find Merchant Id', data: [] })));
        //                 // return res.status(400).json({ status: 400, message: 'Unable to find Merchant Id', data: [] });
        //             }
              

        //     } catch (err) {
        //             // logger.error(`Unable to find : ${err}`);
        //             if (err.name === 'SequelizeValidationError') {
        //               const validationErrors = err.errors.map((err) => err.message);
        //               return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
        //               //return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
        //             }
        //              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
        //               //return res.status(500).json({ status: 500, message: err.message,data: []  });
        //         }
    
        }
        
        
        
	
        async makePayment(req,res) {
	        const decryptedObject = utility.DataDecrypt(req.encReq);
            const {user_id, amount,mobile} = decryptedObject;
            
            const requiredKeys = Object.keys({user_id,amount,mobile});
                
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
             return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
            let t = await this.db.sequelize.transaction();
    
            try {


                const ref_id = 'M' + utility.generateUniqueNumeric(7); //merchant Transaction Id
                const order_id = utility.generateUniqueNumeric(7); // order id
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

                const Data = {
                    user_id,
                    amount: amount,
                    transaction_id: ref_id,
                    mobile: mobile,
                    created_by:user_id,
                    order_id
                };
                const type='Credit';
                const upi_orderData= {
                    user_id:user_id,
                    env:'PROD',
                    tran_type:type,
                    tran_sub_type:'PHONEPE',
                    tran_for:'Add Money',
                    trans_amount:amount,
                    currency:'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on,
                    created_by:user_id,
                   
                };
                const newUpiAddMoney = await this.db.upi_order.insertData(upi_orderData);

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
                                // return res.status(200).json({ status: 200, message: 'Success', data: result });
                                 return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: result })));
                            }
                          
                        
                    
                    }else{
                        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to insert data', data: [] })));
                        // return res.status(404).json({ status: 404, message: 'Unable to insert data', data: [] });
                    }
                
        
            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
                    //   return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                    //  return res.status(500).json({ status: 500, message: err.message,data: []  }); 
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
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
                                //  return res.status(200).json({ status: 200, message: 'Updated Successfully', data: [] });
                                 return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Updated Successfully', data: [] })));

                            }else{
                                 return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Not Updated', data: [] })));
                                // return res.status(400).json({ status: 400, message: 'Not Updated', data: [] });
                            }

                        }else{
                              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: jsonData.data.responseCode, data: [] })));
                            // return res.status(400).json({ status: 400, message: jsonData.data.responseCode, data: [] });
                        }

                    }else{
                        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to find Merchant Id', data: [] })));
                        // return res.status(400).json({ status: 400, message: 'Unable to find Merchant Id', data: [] });
                    }
              

            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
                    //   return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
                    //  return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }


        async checkStatus(req,res) {
	         const decryptedObject = utility.DataDecrypt(req.encReq);
            const {user_id, merchant_transaction_id } = decryptedObject;
            let t = await this.db.sequelize.transaction();
    
            try {
                 
                  const ExistingRequest=await this.db.phonepeTransaction.getExistingRequest(merchant_transaction_id,user_id); 
                    if(ExistingRequest){
                        const response= await phonepeUtility.checkStatus(merchant_transaction_id);
                        // const response={
                        //     success: true,
                        //     code: "PAYMENT_SUCCESS",
                        //     message: "Your request has been successfully completed.",
                        //     data: {
                        //       merchantId: "PGTESTPAYUAT",
                        //       merchantTransactionId: "MT7850590068188104",
                        //       transactionId: "T2111221437456190170379",
                        //       amount: 100,
                        //       state: "COMPLETED",
                        //       responseCode: "SUCCESS",
                        //       paymentInstrument: {
                        //         type: "UPI",
                        //         utr: "206378866112"
                        //       }
                        //     }
                        // }
                        if(response){
                            const savedData = {
                                    // callback_enc_response: response,
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
                                        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: jsonData.data.responseCode, data: [] })));
                                        // return res.status(400).json({ status: 400, message: jsonData.data.responseCode, data: [] });
                                    }
            
                                }else{
                                      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to find Merchant Id', data: [] })));
                                    // return res.status(400).json({ status: 400, message: 'Unable to find Merchant Id', data: [] });
                                }
                          
                        }
                   
                
        
        
            } catch (err) {
                    // logger.error(`Unable to find : ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                         return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
                    //   return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }
                     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
                    //  return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }

      
      
      async phonePeCallbackResponse(req,res, ipAddress) 
      {
        
    
            try {
                 
                const jsonString = req.response;
                const response_from = 'Phonepe';
                const query = `
                  INSERT INTO log_payment_gateway_callback (callback_response, response_from) VALUES (:jsonString, :response_from)
                `;
        
                const result = await this.db.sequelize.query(query, {
                  replacements: { jsonString, response_from},
                  type: this.db.sequelize.QueryTypes.INSERT,
                });
                
                
                const decodedData = Buffer.from(jsonString, 'base64').toString('utf-8');
                const callbackResData = JSON.parse(decodedData);
                
                if(callbackResData.success == true)
                {
                    const transaction_merchant_id = callbackResData.data.merchantTransactionId;
                    const amount = callbackResData.data.amount/100;
                    const currentDate = new Date();
                    const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                    const payment_status = callbackResData.code;
                    const ExistingRequest = await this.db.phonepeTransaction.getDataByTransaction(transaction_merchant_id,amount); 
                    if(ExistingRequest)
                    {
                        const transaction_id = ExistingRequest.transaction_id;
                        const user_id = ExistingRequest.user_id;
                        const userDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: user_id});
                        
                        const UPIorder = await this.db.upi_order.getPendingOrder(transaction_id,amount);
                        
                        
                        const updateData = {
                                response: JSON.stringify(callbackResData),
                                response_status: payment_status,
                                status: (payment_status=='PAYMENT_SUCCESS')?1:3,
                                modified_on: modified_on
                        }
                        const whereCondition={
                                order_id:transaction_merchant_id,
                                amount: amount,
                                user_id: user_id
                        }
                        const saveResponse=await this.db.phonepeTransaction.UpdateData(updateData,whereCondition);
                        
                        if(payment_status=='PAYMENT_SUCCESS')
                        {
                            const updatedRow= await this.db.upi_order.update(
                                { order_status: 'SUCCESS'},
                                { where: { user_id:user_id,order_id:transaction_id,order_status:'PENDING' } }
                            );
                            
                            await this.db.checkoutLog.update(
                                { payment_status: 'SUCCESS'},
                                { where: { user_id:user_id,transaction_id:transaction_id,payment_status:'PENDING' } }
                            );

                            if(updatedRow)
                            {
                                const walletData={
                                    transaction_id:transaction_id,
                                    user_id:user_id,
                                    env:'PROD',
                                    type:'Credit',
                                    amount:amount,
                                    sub_type:'Add Money',
                                    tran_for:'main'
                                };
                                
                                await this.db.wallet.insert_wallet(walletData);
                            }
                        }
                        
                        // const messages = {
                        //     user_id: user_id,
                        //     service: 'Add Money', 
                        //     message_id: `M${utility.generateUniqueNumeric(7)}`,
                        //     msg_notification: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} added to your wallet via Phonepe`,
                        //     msg_whatsup: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} added to your wallet via Phonepe`,
                        //     msg_email: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} added to your wallet via Phonepe`,
                        //     msg_sms: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${amount} added to your wallet via Phonepe`,
                        //     invoice_no: UPIorder.reference_no,
                        //     invoice_date: UPIorder.created_on,
                        //     transaction_id: UPIorder.order_id,
                        //     amount: amount,
                        //     getway: 'PHONEPE',
                        //     bank_ref_no: callbackResData.data.paymentInstrument.utr,
                        //     tracking_id: callbackResData.data.transactionId,
                        //     payment_date: UPIorder.created_on,
                        //     gateway_order_id: transaction_merchant_id,
                        //     order_id: transaction_merchant_id
                        // }

                        // await this.db.messagingService.insertData(messages);
                
                    }
                }
        
            } catch (err) {

                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);

                       return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
                    }

                    return res.status(500).json({ status: 500, message: err.message,data: []  });
                }
    
        }
    

}





module.exports = new Page();