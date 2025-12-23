const { connect,config } = require('../../config/db.config');
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const phonePeUtility = require('../../utility/phonepe.utility'); 
const pino = require('pino');



class CheckoutPayment {

    db = {};

    constructor() {
        this.db = connect();
    }
    
    async paymentRequest(req,res, ipAddress) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id, amount, service} = decryptedObject;
        
        const requiredKeys = Object.keys({user_id, amount, service});
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
         return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        const services = ['Recharge', 'Send Money', 'Bill Payment', 'Prime'];

        if(!services.includes(service))
        {
            //return res.status(400).json({ status: 400, message: 'Please provide correct service', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Please provide correct service', columns: requiredKeys })));
        }
        
        let t = await this.db.sequelize.transaction();

        try {


            const ref_id = 'M' + utility.generateUniqueNumeric(7); //merchant Transaction Id
            const order_id = utility.generateUniqueNumeric(7); // order id
            const currentDate = new Date();
            const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');


            const logEntry = {
                user_id,
                amount: amount,
                transaction_id: order_id,
                service,
                order_id: ref_id,
                payment_getway: 'Phonepe',
                payment_status: 'PENDING'
            }

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
            
            const cheoutEntry = await this.db.checkoutLog.insertData(logEntry, { transaction: t });
            if(cheoutEntry)
            {
                const newUpiAddMoney = await this.db.upi_order.insertData(upi_orderData, { transaction: t });

                const generateUrlData = await this.db.phonepeTransaction.insertData(inputData, { transaction: t }); 
                
                if(generateUrlData){
                    await t.commit();
                    //return res.status(200).json({ status: 200, message: 'Success', data: cheoutEntry });
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: cheoutEntry })));

                }else{
                    await t.rollback();
                    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Unable to insert data', data: [] })));
                     //return res.status(404).json({ status: 404, message: 'Unable to insert data', data: [] });
                }
            }else{
                await t.rollback();
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Somthing went wrong', data: [] })));
                //return res.status(404).json({ status: 404, message: 'Somthing went wrong', data: [] });
            }
            
    
        } catch (err) {
            await t.rollback();
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


}

module.exports = new CheckoutPayment();