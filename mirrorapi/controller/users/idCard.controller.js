const { connect,config } = require('../../config/db.config');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 

class IdCard {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async idCard_purchase(req,res, ipAddress) {
	     const decryptedObject = utility.DataDecrypt(req.encReq);
	    const { user_id, mlm_id, name, city, state, address_type, pincode, mobile_no, address } = decryptedObject;
        
        const requiredKeys = Object.keys({user_id, mlm_id, name, city, state, address_type, pincode, address});
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
	  
        let t = await this.db.sequelize.transaction();
        try {
            const amount = 99; 
            const transaction_id = utility.generateUniqueNumeric(7);
            const order_id = `ID-${mlm_id}-${transaction_id}`;
            let flag = 0;
            let idEntry = [];
            let walletbalance = await this.db.wallet.getWalletAmount(user_id);
            
            const getIdCardData = await this.db.userIdCard.getData(['id', 'status'], {user_id: user_id, status: [1,2]});

            if(getIdCardData!=null)
            {
                if(getIdCardData.status==1)
                {
                    return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Your Id card is already requested', data: []})));
                    //return res.status(201).json({ status: 201, error: 'Your Id card is already requested', data: []});
                }
                if(getIdCardData.status==2)
                {
                    return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Your Id card is Issued', data: []})));
                    //return res.status(201).json({ status: 201, error: 'Your Id card is Issued', data: []});
                }
                
            }

            if(walletbalance==null || walletbalance == 0 || walletbalance < amount)
            {
                //return res.status(201).json({ status: 201, error: 'You do not have sufficient wallet balance', data: []});
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'You do not have sufficient wallet balance', data: []})));
            }
            
            const orderData = {
                user_id,
                env:config.env, 
                tran_type:'Debit',
                tran_sub_type:'Id Card',
                tran_for:'Id Card',
                trans_amount: amount,
                currency:'INR',
                order_id:transaction_id,
                order_status:'PENDING',
                created_on: Date.now(),
                created_by: user_id,
                ip_address: ipAddress
            };
            
            const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t }); 
            
            if(generateorder)
            {
                const inputData = {
                    user_id,
                    shipping_name:name,
                    address_type,
                    shipping_city:city,
                    shipping_state:state,
                    shipping_pincode:pincode,
                    shipping_mobile_no:mobile_no,
                    shipping_address:address,
                    transaction_id,
                    order_id
                }

                idEntry = await this.db.userIdCard.insertData(inputData, { transaction: t });
                
                if(idEntry)
                {
                    const walletData={
                        transaction_id:transaction_id,
                        user_id,
                        env:config.env,
                        type:'Debit',
                        amount:amount,
                        sub_type:'Id Card',
                        tran_for:'main'
                    };
                
                    await this.db.wallet.insert_wallet(walletData, { transaction: t });
                    await this.db.upi_order.update(
                        {order_status: 'SUCCESS' },
                        { where: { user_id:user_id,order_id:transaction_id }, t }
                      );

                      flag = 1;
                }
                
            }

            if(flag == 1)
            {
                await t.commit();
                //return res.status(200).json({ status: 200, message: 'Id Care purchase successfully', data: idEntry});
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Id Card purchase successfully', data: idEntry})));

            }else{
                await t.rollback();
                //return res.status(201).json({ status: 201, message: 'Somthing went wrong', data: idEntry});
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: 'Somthing went wrong', data: idEntry})));
            }
            
           
        }
        catch (err) {
            await t.rollback();
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                //return res.status(500).json({ status: 500,errors:'Internal Server Error' ,data:validationErrors });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error' ,data:validationErrors })));
            }
                //return res.status(500).json({ status: 500, message: err.message ,data: []  });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message ,data: []  })));
        }
	

    }
    
    
}




module.exports = new IdCard();