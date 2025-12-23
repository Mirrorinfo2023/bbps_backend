// controllers/customer_address.controller.js
const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const CustomerAddress = require('../../model/customer_address/customer_address.model');

class CustomerAddressController {

    db = {};

    constructor() {
      this.db = connect();
    }


    async addAddress(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { first_name, last_name, user_id, mobile_number, address1, address2, address3, pincode, city } = decryptedObject;
        
        const requiredKeys = Object.keys({ first_name, last_name, user_id, mobile_number, address1, pincode, city });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        try {
            const newAddress = await this.db.CustomerAddress.createAddress({ first_name, last_name,userid, mobile_number, address1, address2, address3, pincode, city });

            if (newAddress.error === 0) {
                // return res.status(201).json({ status: 201, message: 'Address Created Successfully', data: newAddress.result });
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: 'Address Created Successfully', data: newAddress.result })));
            } else {
                // return res.status(500).json({ status: 500, message: 'Failed to Create Address', data: [] });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Create Address', data: [] })));
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
    }


    async getAddress(req,res) {
	  
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { page } = decryptedObject;
    
        try {
     
            const pages = parseInt(page) || 1;
            const pageSize =  10;
            
            const result = await this.db.CustomerAddress.getCustomer(pages,pageSize);
        
            if(result) {
                // return res.status(200).json({ status: 200, message: 'Order Found', data: result });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Order Found', data: result })));
            } else {
                // return res.status(403).json({ status: 403, token: '', message: 'Order Not Found', data: [] });
                return res.status(403).json(utility.DataEncrypt(JSON.stringify({ status: 403, message: 'Order Found', data: result })));
            }
        
      
        } catch (err) {
         
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                // return res.status(500).json((JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
            }
            // return res.status(500).json((JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
        }
    
    }
    
}
    
    
module.exports = new CustomerAddressController();
