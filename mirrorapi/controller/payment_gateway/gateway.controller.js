const { connect,config } = require('../../config/db.config');
const { connectshop } = require('../../config/shopdb.config');
const { connectpartner } = require('../../config/partner.config');
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op, literal } = require('sequelize');
const utility = require('../../utility/utility'); 
const gatewayUtility = require('../../utility/gateway.utility'); 
const phonepeUtility = require('../../utility/phonepe.utility'); 
const metapayUtility = require('../../utility/metapay.utility'); 
const bbpsUtility = require('../../utility/bbps.utility'); 

const pino = require('pino');



class GatewayPayment {

    db = {};
    shopdb = {};
    partnerdb = {};

    constructor() {
        this.db = connect();
        this.shopdb = connectshop();
        this.partnerdb = connectpartner();
    }
    
    async payment_request(req,res, ipAddress) {  
      const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id, amount } = decryptedObject;
      const requiredKeys = Object.keys({ user_id, amount });
      
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Sorry! Payment cannot be processed due to gateway inconvenience', data: [] })));
      

    //   if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
    //     //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    //      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    //   }

    //   try
    //   {

    //     const whereChk={id:user_id};
    //     const UserAttribute=['first_name','last_name','mobile', 'email', 'state', 'country', 'pincode', 'district', 'division', 'address'];
    //     const userRow = await this.db.user.getData(UserAttribute,whereChk);
    //     const order_id=utility.generateUniqueNumeric(7);
    //     const transaction_id = order_id;

    //     const reqData = {
    //         'user_id': user_id,
    //         'name': userRow.first_name + ' ' + (userRow.last_name?userRow.last_name:''),
    //         'mobile': userRow.mobile,
    //         'email': userRow.email,
    //         'city': userRow.district? userRow.district:'Pune',
    //         'state': userRow.division? userRow.division : 'Maharashtra',
    //         'country': userRow.country? userRow.country : 'India',
    //         'pincode': userRow.pincode? userRow.pincode: '411048',
    //         'district': userRow.district? userRow.district: 'Pune',
    //         'address': userRow.address?userRow.address:'314, 3rd Floor, BRAHMA MAJESTIC, NIBM Rd, Kondhwa',
    //         'amount': amount,
    //         'transaction_id': transaction_id
    //     };

    //     const encData = utility.DataEncrypt(JSON.stringify(reqData));
        
        
    //     // Order Generate
    //     const orderData = {
    //         user_id:user_id,
    //         env:config.env, 
    //         tran_type:'Credit',
    //         tran_sub_type:'CCAVENUE',
    //         tran_for:'Add Money',
    //         trans_amount:amount,
    //         currency:'INR',
    //         order_id,
    //         order_status:'PENDING',
    //         created_on:Date.now(),
    //         created_by:user_id,
    //         ip_address:ipAddress
    //     };
        
    //     const generateorder = await this.db.upi_order.insertData(orderData); 

    //     if(generateorder)
    //     {
    //         const response = await gatewayUtility.paymentRequest(encData);
    //         if(response.response.code == 200)
    //         {
    //             //return res.status(200).json({ status: 200, message: 'Order generated successfully', data: response.response.response });
    //             return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Order generated successfully', data: response.response.response })));
    //         }else{
    //             //return res.status(500).json({ status: 500, message: 'Order not generated', data: [] });
    //             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Order not generated', data: [] })));
    //         }
            
    //     }else{
    //         return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Order not generated', data: [] })));
    //         //return res.status(500).json({ status: 500, message: 'Order not generated', data: [] });
    //     }
    
    //   } catch (error) {
    //     //console.error('An error occurred:', error);
    //     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
    //     //return res.status(500).json({ status: 500, message: error.message, data: error });
    //   }
    }
    
    
     async getLastTransaction(req,res) {  
         const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id } = decryptedObject;
        const requiredKeys = Object.keys({ user_id });
  
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Sorry! Payment cannot be processed due to gateway inconvenience', data: [] })));
        // if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //   //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        //   return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        // }
  
        // try
        // {
  

        //   const getlastData = await this.shopdb.gateway.findOne({
        //       where:{
        //           status: 1,
        //           vendor_id: 1,
        //           payment_status: 0,
        //           order_status: { [Op.not]: 'Success' },
        //           request_jons: {
        //             [Op.like]: '%"user_id":"'+user_id+'"%'
        //           }
        //       },
        //         order: [['created_on', 'DESC']]
        //     });


        //     //return res.status(200).json({ status: 200, message: 'Data Found', data: getlastData });
        //     return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: getlastData })));
                    
        // } catch (error) {
        //   //console.error('An error occurred:', error);
        //   //return res.status(500).json({ status: 500, message: error.message, data: error });
        //   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: error })));
        // }
      }
      
      
      
      async phonepeRequest(req,head,res) {  
          const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, amount, name, mobile,email, transaction_id, redirect_url} = decryptedObject;
        const { working_key, access_token } = head

        const requiredKeys = Object.keys({ user_id, amount, name, mobile, email, transaction_id, redirect_url });
  
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
        
        let t = await this.db.sequelize.transaction();

        try
        {

          const whereChk={ working_key: working_key, access_token: access_token};
          const UserAttribute=['id','name','short_name'];
          
          const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

          if(getPartner==null)
          {
            return res.status(403).json({ status: 403, message: 'Invalid token' });
          }

          const uniqueUserId = `${getPartner.short_name}${utility.generateUniqueNumeric(7)}`;
          const order_id = `${getPartner.short_name}${utility.generateUniqueNumeric(10)}`;
          const reqJson = {
              'user_id': user_id,
              'name': name,
              'mobile': mobile,
              'email': email,
              'amount': amount,
              'transaction_id': transaction_id,
              'redirect_url': redirect_url
          };
  
          //const encData = utility.DataEncrypt(JSON.stringify(reqData));

          const inputData = {
            user_id: getPartner.id,
            order_id,
            order_amount:amount,
            request_json: JSON.stringify(reqJson),
            order_status: 'PENDING',
            gateway: 'Phonepe'
          }

          const reqData = await this.partnerdb.gatewayReqRes.insertData(inputData, { transaction: t });
          
          if(reqData)
          {
            const {request, result} = await phonepeUtility.pay_api(order_id, uniqueUserId, amount, mobile, redirect_url);
            
            if(result.success === true)
            {
                  const updateData = { 
                    response_json: JSON.stringify(result),
                    status_message: result.message,
                    status_code: result.code,
                    request_response_json: JSON.stringify(result)
                  };


                const updatePayment = await this.partnerdb.gatewayReqRes.updateData(updateData, reqData.id, { transaction: t });

                  await t.commit();

                // return res.status(200).json({ status: 200, message: 'Order generated successfully', data: result });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Order generated successfully', data: result })));
            }else{
                await t.rollback();
                // return res.status(500).json({ status: 500, message: 'Request not initialted, Please try again', data: [] });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Request not initialted, Please try again', data: [] })));
            }

          }else{
            await t.rollback();
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Order not generated, please try again', data: reqJson })));
            // return res.status(500).json({ status: 500, message: 'Order not generated, please try again', data: reqJson });
          }
      
        } catch (error) {
          await t.rollback();
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: error })));
        //   return res.status(500).json({ status: 500, message: error.message, data: error });
        }
      }


      async phonePecallBack(req,res, ipAddress) 
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
                  const payment_mode = callbackResData.data.paymentInstrument.type;
                  const bank_ref_no = callbackResData.data.paymentInstrument.utr;
                  const status_message = callbackResData.message;
                  const status_code = callbackResData.code;
                  const ExistingRequest = await this.this.partnerdb.gatewayReqRes.getData({order_id:transaction_merchant_id,order_amount: amount}); 
                  if(ExistingRequest)
                  {

                        const user_id = ExistingRequest.user_id
                      const updateData = {
                          response_json: JSON.stringify(callbackResData),
                          order_status: payment_status,
                          payment_status: (payment_status=='PAYMENT_SUCCESS')?1:2,
                          payment_mode: payment_mode,
                          bank_ref_no: bank_ref_no,
                          status_message: status_message,
                          status_code: status_code,
                          modified_on: modified_on
                      }
                      const whereCondition={
                              order_id:transaction_merchant_id,
                              order_amount: amount,
                              user_id: user_id
                      }
                      const saveResponse=await this.this.partnerdb.gatewayReqRes.UpdateData(updateData,whereCondition);
              
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

        async phonepePaymentCheck(req,head,res) {  
            const decryptedObject = utility.DataDecrypt(req.encReq);
          const { merchant_transaction_id } = decryptedObject;
          const requiredKeys = Object.keys({ merchant_transaction_id });
          
          const { working_key, access_token } = head
    
          if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
          }
    
          try
          {
              const whereChk={ working_key: working_key, access_token: access_token};
              const UserAttribute=['id','name','short_name'];
              
              const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);
    
              if(getPartner==null)
              {
                return res.status(403).json({ status: 403, message: 'Invalid token' });
              }
        
              const result = await this.this.partnerdb.gatewayReqRes.getData({order_id:merchant_transaction_id}); 
              if(result)
              {
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Payment Status', data: result })));
                //   return res.status(200).json({ status: 200, message: 'Payment Status', data: result });
              }else{
                //   return res.status(500).json({ status: 500, message: 'Sorry no data found of that merchant transaction id', data: [] });
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Sorry no data found of that merchant transaction id', data: [] })));
              }
                      
          } catch (error) {
            //console.error('An error occurred:', error);
            // return res.status(500).json({ status: 500, message: error.message, data: error });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: error })));
          }
        }
        
        
        
        async metapay_payment_request(req,res, ipAddress) 
        {  
          const { user_id, amount } = req;
          const requiredKeys = Object.keys({ user_id, amount });
    
          if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }
    
          try
          {
    
            const whereChk={id:user_id};
            const UserAttribute=['first_name','last_name','mobile', 'email', 'state', 'country', 'pincode', 'district', 'division', 'address'];
            const userRow = await this.db.user.getData(UserAttribute,whereChk);
            const name = `${userRow.first_name} ${userRow.last_name}`;
            const order_id = utility.generateUniqueNumeric(7);
            const request_id = `ORDER${utility.generateUniqueNumeric(7)}`;
            const transaction_id = order_id;
            const description = `Add Money to wallet`;

             // Order Generate
             const orderData = {
              user_id:user_id,
              env:config.env, 
              tran_type:'Debit',
              tran_sub_type:'METAPAY',
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
                const result = await metapayUtility.paymentRequest(order_id, amount, name, userRow.email, userRow.mobile, description);
                if(result)
                {
                    return res.status(200).json({ status: 200, message: 'Order generated successfully', data: result });
                }else{
                    return res.status(500).json({ status: 500, message: 'Order not generated', data: [] });
                }
                
            }else{
                return res.status(500).json({ status: 500, message: 'Order not generated', data: [] });
            }
        
          } catch (error) {
            //console.error('An error occurred:', error);
            return res.status(500).json({ status: 500, message: error.message, data: error });
          }
        }


      async metapaycallBack(req,res) 
      {
        
          try {
                
              const jsonString = JSON.stringify(req);
              const response_from = 'Metapay';
              const query = `
                INSERT INTO log_payment_gateway_callback (callback_response, response_from) VALUES (:jsonString, :response_from)
              `;
      
              const result = await this.db.sequelize.query(query, {
                replacements: { jsonString, response_from},
                type: this.db.sequelize.QueryTypes.INSERT,
              });
              

              if(jsonString)
              {
                const checkExists = await this.db.upi_order.findOne({
                  where: {
                    order_id: req.order_id,
                    order_status: 'PENDING'
                  }
                });
                
                if(req.txn_status == 'SUCCESS' && checkExists)
                {

                    const transactionData={
                      transaction_id: checkExists.order_id,
                      user_id: checkExists.user_id,
                      env:'PROD',
                      type:'Credit',
                      amount: checkExists.trans_amount,
                      sub_type:'Add Money',
                      tran_for:'main'
                  };
                  
                  const wallet = await this.db.wallet.insert_wallet(transactionData);
                  
                  if(wallet && wallet.error !== undefined && wallet.error === 0)
                  {
                      
                      await this.db.upi_order.update(
                          { order_status: 'SUCCESS', api_response: req.bank_ref_no},
                          { where: { id: checkExists.id } }
                      );
                      
                  }
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
        
        
    /**
     * All Bbps apis
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

    async getBillerCategory(header, req, res)
    {

        const whereChk={ working_key: header.working_key, access_token: header.token};
        const UserAttribute=['id','name','short_name'];
      
        const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

        if (getPartner==null) {
          return res.status(403).json({ status: 403, message: 'Unauthorized access' });
        }

        try
        {

            const getOperatorCategory = await this.db.serviceOperator.findAll({
                attributes: ['category'],
                where: {
                    status: 1,
                    biller_id: {
                      [Op.not]: null,
                      [Op.ne]: ''
                    }
                },
                group: ['category']
            });

            const getAllCategory = [];
            getOperatorCategory.forEach(item => {
              getAllCategory.push(item.category);
            });

            return res.status(200).json({ status: 200, message: 'success', data: getAllCategory });
        }catch(error){
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: 'Internal server error', data:validationErrors });
              }
              return res.status(500).json({ status: 500, message: err.message, data: []  });
        }

    }

    async getBiller(header, req, res)
    {
        const whereChk={ working_key: header.working_key, access_token: header.token};
        const UserAttribute=['id','name','short_name'];
      
        const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

        if (getPartner==null) {
          return res.status(403).json({ status: 403, message: 'Unauthorized access' });
        }

        const { category } = req;
        const requiredKeys = Object.keys({ category });

        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        try{
            let filter = '';
            if(category)
            {
                filter = {
                    category: category
                }
            }
            const getOperator = await this.db.serviceOperator.findAll({
                where: {
                    status: 1,
                    ...filter
                }
            });

            let getOperatorWithPath = getOperator.map(operator => {
                return {
                  operator_name: operator.operator_name,
                  category: operator.category,
                  description: operator.description,
                  biller_id: operator.biller_id
                };
            });

            return res.status(200).json({ status: 200, message: 'SUCCESS', data: getOperatorWithPath });
        }catch(error){
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: 'Internal server error', data:validationErrors });
              }
              return res.status(500).json({ status: 500, message: err.message, data: []  });
        }

    }
    
    async billerInfo(header, req,res) {  

      const whereChk={ working_key: header.working_key, access_token: header.token};
      const UserAttribute=['id','name','short_name'];
    
      const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

      if (getPartner==null) {
        return res.status(403).json({ status: 403, message: 'Unauthorized access' });
      }

      const { biller_id } = req;
      const requiredKeys = Object.keys({ biller_id });
      let date = new Date();

      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      try {
        let billerArray = [];
        billerArray.push(biller_id);
        
        const checkData = await this.db.bbpsBillerInfo.count({where: { biller_id: billerArray }, });
        
        if(checkData == 0)
        {
          const {result, reqData} = await bbpsUtility.bbpsBillerInfo(billerArray);

            if(result && result.billerInfoResponse)
            {
              
              const base = result.billerInfoResponse.biller;
              
              const billerId = base.billerId;
              const billerName = base.billerName;
              const billerCategory = base.billerCategory;
              const billerInputParams = base.billerInputParams;
              const billerFetchRequiremet = base.billerFetchRequiremet;
              
              let consumerNumber = '';
              let distributorId = '';
              let mobileNo = '';
              let consumerId = '';
  
              const fetchData = {
                biller_id: billerId,
                biller_name: billerName,
                biller_category: billerCategory,
                consumer_number: consumerNumber,
                distributor_id: distributorId,
                mobile_no: mobileNo,
                consumer_id: consumerId,
                status: 1,
                input_params: JSON.stringify(billerInputParams),
                response_json: JSON.stringify(result),
                created_on: date.getTime(),
                biller_fetch_requiremet: billerFetchRequiremet
              }
  
              await this.db.bbpsBillerInfo.insertData(fetchData);
              
            }
          
        }

        const resultData = await this.db.bbpsBillerInfo.getData({biller_id: biller_id});
        let billerSendData = [];
        if(resultData)
        {
          billerSendData = {
            biller_id: resultData.biller_id,
            biller_name: resultData.biller_name,
            biller_category: resultData.biller_category,
            input_param: resultData.input_params?JSON.parse(resultData.input_params).paramInfo:'',
            biller_fetch: resultData.biller_fetch_requiremet
          }
        }
        
        
        return res.status(200).json({ status: 200, message:'SUCCESS', data: billerSendData });
    
      } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors: 'Internal server error', data:validationErrors });
          }
          return res.status(500).json({ status: 500, message: err.message, data: []  });
      }
    }



    async billFetch(header, req,res, ipAddress) {  

        const whereChk={ working_key: header.working_key, access_token: header.token};
        const UserAttribute=['id','name','short_name'];
      
        const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

        if (getPartner==null) {
          return res.status(403).json({ status: 403, message: 'Unauthorized access' });
        }

        let t = await this.db.sequelize.transaction();
        try {

            const user_id = getPartner.id;
            const { biller_id, input_param, mobile_no, email_id } = req;
            const requiredKeys = Object.keys({ biller_id, input_param, mobile_no, email_id });
            let date = new Date();

            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
          

              const { result, reqData } = await bbpsUtility.bbpsBillFetch(biller_id, input_param, mobile_no, email_id);
              
              if(result.billFetchResponse.responseCode=='000')
              {
                  const base = result.billFetchResponse.billerResponse;
                  const amount = parseFloat(base.billAmount) / 100;
                  const amount_option = base.billAmount;
                  const consumer_name = base.customerName;
                  const bill_date = base.billDate?base.billDate:null;
                  const bill_period = base.billPeriod;
                  const due_date = base.dueDate?base.dueDate:null;
                  const bill_number = base.billNumber;
                  const request_id = reqData.requestId;
                  const request_data = reqData.encRequest;
                  const response_data = reqData.encResponse;
                  const consumer_no = '';
                  const inputParams = result.billFetchResponse.inputParams;
                  const addtionalInfo = result.billFetchResponse.additionalInfo;

                  let late_fine = 0;
                  let fixed_charge = 0;
                  let additional_charge = 0

                  const order_id=utility.generateUniqueNumeric(7);
                  const transaction_id = order_id;
                  
                  // Order Generate
                  const orderData = {
                      user_id:user_id,
                      env:config.env, 
                      tran_type:'Debit',
                      tran_sub_type:'Bill Payment',
                      tran_for:'Bill Payment',
                      trans_amount:amount,
                      currency:'INR',
                      order_id,
                      order_status:'PENDING',
                      created_on:Date.now(),
                      created_by:user_id,
                      ip_address:ipAddress
                  };
                  
                  const generateorder = await this.partnerdb.transOrder.insertData(orderData, { transaction: t }); 
                  
                  const fetchData = {
                      user_id,
                      transaction_id,
                      biller_id,
                      request_id,
                      request_data,
                      response_data,
                      consumer_no,
                      consumer_name,
                      bill_amount: amount,
                      late_fine,
                      fixed_charge,
                      additional_charge,
                      bill_period,
                      bill_number,
                      status: 2,
                      created_on: date.getTime(),
                      created_by: user_id,
                      response_json: JSON.stringify(result),
                      input_params: JSON.stringify(inputParams),
                      biller_response: JSON.stringify(base),
                      additional_info: JSON.stringify(addtionalInfo),
                      mobile:mobile_no,
                      email:email_id
                      
                  }
                  
                    if(bill_date!=null){
                        fetchData.bill_date = new Date(bill_date);
                    }
                    if(due_date!=null){
                        fetchData.due_date = new Date(due_date);
                    }
                    
                  const billFetchEntery = await this.partnerdb.bbpsBillFetch.insertData(fetchData, { transaction: t });
                    
                  const sendFetchData = {
                      biller_id: billFetchEntery.biller_id,
                      request_id: billFetchEntery.request_id,
                      transaction_id: transaction_id,
                      consumer_no: billFetchEntery.consumer_no,
                      consumer_name: billFetchEntery.consumer_name,
                      bill_amount: billFetchEntery.bill_amount,
                      late_fine: billFetchEntery.late_fine,
                      fixed_charge: billFetchEntery.fixed_charge,
                      additional_charge: billFetchEntery.additional_charge,
                      bill_date: bill_date,
                      bill_period: billFetchEntery.bill_period,
                      due_date: due_date,
                      bill_number: billFetchEntery.bill_number,
                      status: billFetchEntery.status,
                      input_params: JSON.parse(billFetchEntery.input_params),
                      additional_info: JSON.parse(billFetchEntery.additional_info),
                      
                  }

                  if(sendFetchData)
                  {
                      await t.commit();
                      return res.status(200).json({ status: 200, message: 'Bill Fetched Successfully', data: sendFetchData });
                  }else{
                      await t.rollback()
                      return res.status(500).json({ status: 500, message: 'Somthing went wrong', data: [] });
                  }
              }else{
                return res.status(500).json({ status: 500, message: result.billFetchResponse.errorInfo.error.errorMessage, data: result.billFetchResponse.errorInfo.error});
              }


          } catch (err) {
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json({ status: 500, errors: 'Internal server error', data:validationErrors });
            }
            return res.status(500).json({ status: 500, message: err.message, data: []  });
          }
    }
    
    
    async billPay(header, req,res, ipAddress) { 

      const whereChk={ working_key: header.working_key, access_token: header.token};
      const UserAttribute=['id','name','short_name'];
    
      const getPartner = await this.partnerdb.partner.getData(UserAttribute,whereChk);

      if (getPartner==null) {
        return res.status(403).json({ status: 403, message: 'Unauthorized access' });
      }

      const {amount, biller_id, transaction_id} = req;
      const requiredKeys = Object.keys({ amount, biller_id, transaction_id });
            
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      let t = await this.db.sequelize.transaction();

      try {
          let userId = getPartner.id;
          let env = config.env;
          let date = new Date();
          let crdate = utility.formatDate(date);
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          firstDay = utility.formatDate(firstDay);
          lastDay = utility.formatDate(lastDay);
          let walletbalance = await this.partnerdb.wallet.getWalletAmount(userId);
          let d_amount = amount;
        
          const biller_info = await this.db.bbpsBillerInfo.getData({biller_id: biller_id});
          const resultData = await this.partnerdb.bbpsBillFetch.getData({biller_id: biller_id, user_id: userId, transaction_id: transaction_id, status:2});
          
          if((resultData == null || resultData.length==0) || (biller_info == null))
          {
            return res.status(500).json({ status: 500, message: 'No bill dues or biller does not exists', data:resultData });
          }


          if(parseFloat(resultData.bill_amount) != parseFloat(amount))
          {
            return res.status(500).json({ status: 500, message: 'Amount should be equal to bill amount', data:resultData });
          }
          
          
          
          if(walletbalance!==null && walletbalance > 0 && walletbalance >= amount)
          {

            const email = resultData.email;
            const mobile = resultData.mobile;
            let transaction_id= resultData.transaction_id;
            let request_id= resultData.request_id;
            let consumer_name= resultData.consumer_name;
            //let bill_amount= resultData.bill_amount;
            let bill_amount= amount;
            let input_params= resultData.input_params;
            let bill_date= resultData.bill_date;
            let bill_period= resultData.bill_period;
            let due_date= resultData.due_date;
            let bill_number= resultData.bill_number;
            let biller_response= resultData.biller_response;
            let additional_info= resultData.additional_info;
            
            

            const {result, reqData} = await bbpsUtility.bbpsBillPay(bill_amount, biller_id, request_id, biller_info.biller_adhoc, mobile, email, input_params, biller_response, additional_info);
            
          
            if(result.ExtBillPayResponse.responseCode == '000')
            {
              
              const base = result.ExtBillPayResponse;
              //entry in bill payment
              const inputData = { 
                consumer_name: base.RespCustomerName, 
                biller_id: biller_id,  
                amount: d_amount,
                env: env,
                main_amount: amount,
                payment_status: 'SUCCESS',
                user_id: userId,
                transaction_id: transaction_id,
                response_code: base.responseCode,
                status: 1,
                resp_amount: base.RespAmount/100,
                bill_no: bill_number,
                bill_date: base.RespBillDate,
                bill_preriod: base.RespBillPeriod,
                bill_due_date: base.RespDueDate,
                input_params: JSON.stringify(base.inputParams),
                trax_id: base.txnRefId,
                response_code: base.responseCode,
                cust_conv_fee: base.CustConvFee,
              };
              const paymentEntry = await this.partnerdb.bbpsBillPayment.insertData(inputData, { transaction: t });

              if(paymentEntry)
              {
                //entry in wallet for deduction
                const walletData = {
                    transaction_id:transaction_id,
                    user_id:userId,
                    env:env,
                    type:'Debit',
                    amount:d_amount,
                    sub_type:'Bill Payment',
                    tran_for:'main'
                };
                
                const walletEntry = await this.partnerdb.wallet.insert_wallet(walletData, { transaction: t });


                await this.partnerdb.bbpsBillFetch.update(
                  { status: 1 }, 
                  { where: {transaction_id:transaction_id}, t }
                );
  
                await this.partnerdb.transOrder.update(
                  {order_status: 'SUCCESS' },
                  { where: { user_id:userId,order_id:transaction_id }, t }
                );
                
              }

              return res.status(200).json({ status: 200, message: 'Payment done successfully', data: paymentEntry });
            }else{
              return res.status(402).json({ status: 402, message: 'Payment failed', data: result });
            }
            
          }else{
            return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
          }
      
        } catch (error) {
          await t.rollback();
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

module.exports = new GatewayPayment();