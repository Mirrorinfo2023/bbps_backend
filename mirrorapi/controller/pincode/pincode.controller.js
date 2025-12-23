const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class Pincode {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async getPincode(req,res) {
	       const decryptedObject = utility.DataDecrypt(req.encReq);
	    const { pincode } = decryptedObject;

	    if (!pincode) {
	        //return res.status(400).json({ error: 'Pass pincode' });
	        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ error: 'Pass pincode' })));
          }

        try {
            
                const response = await this.db.pincode.getData(pincode);
                const postOfficeData = [];

                if(response)
                {
                  for (const data of response) {
                    postOfficeData.push({
                      id: data.id,
                      Circle: data.circle,
                      Region: data.region,
                      Division: data.division,
                      Office_name: data.office_name,
                      Pincode: data.pincode,
                      office_type: data.office_type,
                      District: data.district,
                      State: data.state_name,
                    });
                  }
                }
                else{
                    postOfficeData.push({
                      id: 147790,
                      Circle: 'Maharashtra',
                      Region: 'Pune',
                      Division: 'Pune City East',
                      Office_name: 'N I B M S.O',
                      Pincode: '411048',
                      office_type: 'PO',
                      District: 'PUNE',
                      State: 'MAHARASHTRA',
                    });
                }
                if (postOfficeData.length > 0) {
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: postOfficeData })));
                  //return res.status(200).json({ status: 200, message: 'Success', data: postOfficeData });
                } else {
                  //return res.status(404).json({ status: 404, message: 'Details not found', data: [] });
                  return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Wrong Pincode! try again', data: [] })));
                }
                // const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
               
                // if ( response.data[0].Status=== 'Success') {
                //       const postOfficeData = response.data[0].PostOffice;
                //       if (postOfficeData) {
                //           return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: postOfficeData })));
                //       } else {
                //           return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Details not found', data: [] })));
                //       }
           
                // }else{
                //     return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Details not found', data: [] })));
                // }
       
	
        } catch (err) {
                logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			  
    			}
    			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
            }

    }
    


}




module.exports = new Pincode();