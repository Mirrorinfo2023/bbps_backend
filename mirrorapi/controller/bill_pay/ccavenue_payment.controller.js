const { connect,config } = require('../../config/db.config');
const ccavenuModule = require('../../config/ccavenue.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const ccavenueUtility = require('../../utility/ccavenue.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);



class CCAvenuePayment {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    

    async generateOrder(req,res, ipAddress) {  
        
        //const decryptedObject = utility.DataDecrypt(req.encReq);
        
        const { amount, user_id } = req;
        const requiredKeys = Object.keys({ amount, user_id });

        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
        
        let t = await this.db.sequelize.transaction();

        try {
            
            
            let date = new Date();
            const requestId = utility.ccgenerateRequestId();
            const ccavenueConfig = ccavenuModule.ccavenue();
            
            const merchant_id = ccavenueConfig.merchantId;
            const redirect_url = `${config.baseurl}api/payment/ccavenue-callback-response`;
            const cancel_url = `${config.baseurl}api/payment/ccavenue-callback-response`;

            const whereChk={id:user_id};
            const UserAttribute=['first_name','last_name','mobile', 'email', 'circle', 'district', 'country'];
            const userRow = await this.db.user.getData(UserAttribute,whereChk);
            const address = `${userRow.district} ${userRow.circle} ${userRow.country}`;
            const userName = `${userRow.first_name} ${userRow.last_name}`;
            const mobile = userRow.mobile;
            const email = userRow.email;

            const { response, encRequest } = await ccavenueUtility.paymentRequest(amount, redirect_url, cancel_url, userName, mobile, address, email);
            
            
           
            let result = [];
            if(response.status_message == 'SUCCESS'){
                const transaction_id=utility.generateUniqueNumeric(7);
                // Order Generate
                const orderData = {
                    user_id:user_id,
                    env:config.env, 
                    tran_type:'Credit',
                    tran_sub_type:'CCAVENUE',
                    tran_for:'Add Money',
                    trans_amount:amount,
                    currency:'INR',
                    order_id:transaction_id,
                    order_status:'PENDING',
                    created_on:Date.now(),
                    created_by:user_id,
                    ip_address:ipAddress
                };

                const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t }); 

                if(generateorder)
                {   
                    const inputData = {
                        user_id,
                        transaction_id,
                        merchant_id,
                        order_id:requestId,
                        amount,
                        status: 2,
                        encrequest:encRequest,
                        created_on: date.getTime(),
                        created_by: user_id,
                        redirect_url,
                        cancel_url
                    }
                    result = await this.db.ccAvenueRequest.insertData(inputData, { transaction: t });

                }

                
                
                if(result!=null)
                {
                    result.dataValues.first_name = userRow.first_name;
                    result.dataValues.last_name = userRow.last_name;
                    result.dataValues.full_name = userName;
                    result.dataValues.mobile = userRow.mobile;
                    result.dataValues.email = userRow.email;
                    result.dataValues.address = address;
                    result.dataValues.access_code = response.access_code;
                    await t.commit();
                    return res.status(200).json({ status: 200, message: 'Ccavenue requested successfully', data: result });
                    //return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ccavenue requested successfully', data: result })));
                }else{
                    await t.rollback();
                    //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Somthing went wrong', data: result })));
                    return res.status(500).json({ status: 500, message: 'Somthing went wrong', data: result });
                }
            }
          } catch (error) {
            await t.rollback();
            //console.error('An error occurred:', error);
            //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: error.message })));
            return res.status(500).json({ status: 500, error: error.message });
          }
    }


    async ccAvenueResponse(req,res) {  
        let t = await this.db.sequelize.transaction();
        try
        {
            const ccavenueConfig = ccavenuModule.ccavenue();
            const { encResp } = req;
            const working_key = ccavenueConfig.workingKey;
            const decryptedData = utility.bbpsDecrypt(encResp, working_key);
            const resultArray = utility.convertArray(decryptedData);
            const merchant_id = ccavenueConfig.merchantId;
            const requestCheck = await this.db.ccAvenueRequest.getData({'order_id': resultArray.order_id, 'amount': resultArray.amount});
            let status = 0;
            if(resultArray.order_status=='Success'){
                status=1;
            }else if(resultArray.order_status=='Failure'){
                status=2;
            }else if(resultArray.order_status=='Aborted'){
                status=3;
            }else if(resultArray.order_status=='Invalid'){
                status=4;
            }else if(resultArray.order_status=='Timeout'){
                status=5;
            }else{
                status=0;
            }

            const inputData = {
                user_id:requestCheck.user_id,
                transaction_id: requestCheck.transaction_id,
                merchant_id,
                order_id: resultArray.order_id,
                amount: resultArray.amount,
                status: status,
                res_status: resultArray.order_status,
                encrequest:encResp,
                created_on: date.getTime(),
                created_by: user_id,
            }
            const responseEntry = await this.db.ccAvenueResponse.insertData(inputData, t);

            if(responseEntry)
            {
                await this.db.upi_order.update(
                    {order_status: 'SUCCESS' },
                    { where: { user_id:requestCheck.userId,order_id:requestCheck.transaction_id }, t }
                );

                await this.db.ccAvenueRequest.update(
                    {status: (resultArray.order_status=='Success')?1: 3},
                    { where: { order_id:resultArray.order_id }, t }
                );

                if(resultArray.order_status == 'Success')
                {
                    const walletData = {
                        transaction_id:requestCheck.transaction_id,
                        user_id:requestCheck.userId,
                        env:config.env,
                        type:'Credit',
                        amount:resultArray.amount,
                        sub_type:'Add Money',
                        tran_for:'main'
                    };
                    
                    await this.db.wallet.insert_wallet(walletData, t);

                    return res.status(200).json({ status: 200, message: 'Payment done successfully', data: responseEntry});
                }
                else{
                    return res.status(500).json({ status: 500, message: 'Payment failed! please try again', data: responseEntry});
                }
                
            }

        }catch (error) {
            //console.error('An error occurred:', error);
            return res.status(500).json({ status: 500, error: error.message });
        }

    }

   
}

module.exports = new CCAvenuePayment();