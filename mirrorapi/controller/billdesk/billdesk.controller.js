const { connect,config } = require('../../config/db.config');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const billdeskUtility = require('../../utility/billdesk.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);



class BillDesk {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async billdesk_request(req,res, ipAddress) {  
      //const decryptedObject = utility.DataDecrypt(req.encReq);
		const decryptedObject = req;
      const { user_id, amount } = decryptedObject;
      const requiredKeys = Object.keys({ user_id, amount });

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      try
      {
        const redirect_url = `${config.baseurl}/api/bill_payment/billdesk-response`;

        const {result, reqData} = await billdeskUtility.BillDeskRequest(amount, redirect_url, ipAddress);
        
        if(result)
        {
          
          const order_id=utility.generateUniqueNumeric(7);
          const transaction_id = order_id;
          // Order Generate
          const orderData = {
              user_id:user_id,
              env:config.env, 
              tran_type:'Debit',
              tran_sub_type:'BILL DESK',
              tran_for:'Add Money',
              trans_amount:amount,
              currency:'INR',
              order_id,
              order_status:'PENDING',
              created_on:Date.now(),
              created_by:user_id,
              ip_address:ipAddress
          };
          
          const generateorder = await this.db.upi_order.insertData(orderData); 
          if(generateorder)
          {
            const inputData = {
                user_id,
                transaction_id,
                billdesk_order_id: result.orderid,
                bdorderid: result.bdorderid,
                order_date: Date.now(),
                order_amount: amount,
                redirect_url: redirect_url,
                status: result.status,
                order_response: JSON.stringify(result),
            }
            await this.db.billdeskRequest.insertData(inputData);
          }
        }

        //return res.status(200).json({ status: 200, message: 'Billdesk requested successfully', data: result });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Billdesk requested successfully', data: result })));
      } catch (error) {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: error })));
        //return res.status(500).json({ status: 500, message: error.message, data: error });
      }
    }
    
    
    async billdesk_request_test(req,res, ipAddress) {  
      const { user_id, amount } = req;
      const requiredKeys = Object.keys({ user_id, amount });

      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      try
      {
        const redirect_url = `${config.baseurl}/api/bill_payment/billdesk-response`;

        const {result, reqData} = await billdeskUtility.BillDeskRequest(amount, redirect_url, ipAddress);
        
        if(result)
        {
          
          const order_id=utility.generateUniqueNumeric(7);
          const transaction_id = order_id;
          // Order Generate
          const orderData = {
              user_id:user_id,
              env:config.env, 
              tran_type:'Debit',
              tran_sub_type:'BILL DESK',
              tran_for:'Bill Payment',
              trans_amount:amount,
              currency:'INR',
              order_id,
              order_status:'PENDING',
              created_on:Date.now(),
              created_by:user_id,
              ip_address:ipAddress
          };
          
          const generateorder = await this.db.upi_order.insertData(orderData); 
          if(generateorder)
          {
            const inputData = {
                user_id,
                transaction_id,
                billdesk_order_id: result.orderid,
                bdorderid: result.bdorderid,
                order_date: Date.now(),
                order_amount: amount,
                redirect_url: redirect_url,
                status: result.status,
                order_response: JSON.stringify(result),
            }
            await this.db.billdeskRequest.insertData(inputData);
          }
        }

        return res.status(200).json({ status: 200, message: 'Billdesk requested successfully', data: result });
      } catch (error) {

        return res.status(500).json({ status: 500, message: error.message, data: error });
      }
    }
    
    async billdesk_response(req,res) { 
        
      const jsonString = JSON.stringify(req);
        const response_from = 'Billdesk';
        const query = `
          INSERT INTO log_payment_gateway_callback (callback_response, response_from) VALUES (:jsonString, :response_from)
        `;
        
        const result = await this.db.sequelize.query(query, {
          replacements: { jsonString: jsonString, response_from: response_from},
          type: this.db.sequelize.QueryTypes.INSERT,
        });
    }
    
    
    async billdesk_status_check(req,res) { 
        
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id, order_id } = decryptedObject;
      const requiredKeys = Object.keys({ user_id, order_id });

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      try
      {

        const {result, reqData} = await billdeskUtility.BillDeskTransactionStatus(order_id);
        
        if(result)
        {
            const ExistingRequest = await this.db.billdeskRequest.getData({'billdesk_order_id': order_id, 'status': 'ACTIVE', 'user_id': user_id});
            if(ExistingRequest)
            {
                const transaction_id = ExistingRequest.transaction_id;
                const user_id = ExistingRequest.user_id;
                const updateData = {
                        txn_id: result.transactionid,
                        transaction_date: result.transaction_date,
                        payment_amount: result.amount,
                        bank_ref_no: result.bank_ref_no,
                        payment_method_type: result.payment_method_type,
                        transaction_error_desc: result.transaction_error_desc,
                        response_json: JSON.stringify(result),
                        payment_status: (result.transaction_error_type=='success')?1:0,
                        status: result.transaction_error_type.toUpperCase(),
                }
                const whereCondition={
                        id: ExistingRequest.id,
                        user_id: user_id
                }
                const saveResponse=await this.db.billdeskRequest.UpdateData(updateData,whereCondition);
                
                if(result.transaction_error_type.toUpperCase()=='SUCCESS')
                {
                    const updatedRow= await this.db.upi_order.update(
                        { order_status: 'SUCCESS', api_response: result.transactionid},
                        { where: { user_id:user_id,order_id:transaction_id,order_status:'PENDING' } }
                    );

                    if(updatedRow)
                    {
                        const walletData={
                            transaction_id:transaction_id,
                            user_id:user_id,
                            env:'PROD',
                            type:'Credit',
                            amount:result.amount,
                            sub_type:'Add Money',
                            tran_for:'main'
                        };
                        
                        await this.db.wallet.insert_wallet(walletData);
                    }
                    
                    //return res.status(200).json({ status: 200, message: 'Payment done successfully', data: result });
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Payment done successfully', data: result })));
                }else{
                    //return res.status(500).json({ status: 500, message: 'Payment failed', data: result });
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Payment failed', data: result })));
                }
                
        
            }else{
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Wrong order id', data: [] })));
                //return res.status(500).json({ status: 500, message: 'Wrong order id', data: [] });
            }
        }else{
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Transaction not found', data: [] })));
            //return res.status(500).json({ status: 500, message: 'Transaction not found', data: [] });
        }
        
      } catch (error) {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Transaction not found', data: error.message })));
        //return res.status(500).json({ status: 500, message: error.message, data: error });
      }
    }

   
}

module.exports = new BillDesk();