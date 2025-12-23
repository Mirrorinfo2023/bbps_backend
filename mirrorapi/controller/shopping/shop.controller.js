const { connect,config } = require('../../config/db.config');

//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const utility = require('../../utility/utility');
const axios = require('axios');
// const shipRocketUtility = require('../../utility/shiprocket.utility'); 



class ShipRocket{

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async updateWalletBalance(req,res) {
	     const decryptedObject = utility.DataDecrypt(req.encReq);
	    const { user_id, transaction_type, main_amount, cashback_amount, tran_for } = decryptedObject;
        
        const requiredKeys = Object.keys({user_id,transaction_type,main_amount,cashback_amount, tran_for});
            
          if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
          }
  
        let t = await this.db.sequelize.transaction();

        try {
            const order_id=utility.generateUniqueNumeric(7);
            let walletbalance = await this.db.wallet.getWalletAmount(user_id);
           
            if(walletbalance!==null && walletbalance > 0 && walletbalance >= main_amount)
            {
                const orderData = {
                    user_id,
                    env: config.env,
                    tran_type: transaction_type,
                    tran_sub_type:tran_for,
                    tran_for: tran_for,
                    trans_amount: main_amount,
                    currency: 'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on: Date.now(),
                    created_by: user_id,
                    ip_address: 0
                };
               
                const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });
                    let walletEntry = [];

                    const walletData={
                        transaction_id:order_id,
                        user_id:user_id,
                        env: config.env,
                        type:transaction_type,
                        amount:main_amount,
                        sub_type:tran_for,
                        tran_for:'main'
                    };
                    
                     walletEntry = await this.db.wallet.insert_wallet(walletData,{ transaction: t });
                     if(walletEntry && cashback_amount > 0)
                     {
                            const cashbackData={
                            transaction_id:order_id,
                            user_id:user_id,
                            env:config.env,
                            type:transaction_type,
                            amount:cashback_amount,
                            sub_type:tran_for,
                            tran_for:'cashback'
                        };
                        const cashbackEntry = await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
                    }

                     await this.db.upi_order.update(
                        {order_status:'SUCCESS' },
                        { where: { user_id:user_id,order_id:order_id,order_status:'PENDING' }, t }
                      );

                    t.commit();
                    
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message: 'purchase successfully' ,data: walletEntry})));
                //return res.status(200).json({ status: 200,message: 'purchase successfully' ,data: walletEntry});
            }else{
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'You do not have sufficient wallet balance' })));
                //return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
            }
            
            } catch (err) {
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  //return res.status(500).json({ status: 500,errors: 'Internal Server Error.'});
    			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error.'})));
    			}
    			 //return res.status(500).json({ status: 500, message: err.message,data: []  });
    			 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
            }

    }


  

}




module.exports = new ShipRocket();