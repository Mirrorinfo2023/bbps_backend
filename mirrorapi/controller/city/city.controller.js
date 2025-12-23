const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
//const pino = require('pino');
//const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class City {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async getCity(req,res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
	      const input_values= decryptedObject;
	       const requiredKeys = ['country_id', 'state_id'];
            
           /* if ( !requiredKeys.every(key => key in decryptedObject)  && decryptedObject[key] !== '' && decryptedObject[key] !== undefined ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
            }
	       */
        try {
            
            let citys;
            if(input_values.district!=null  && input_values.district!== undefined && input_values.state_id !== undefined){
                
                
                 let citysdata = await this.db.city.findAll({
                  where: {
                    flag: 1,
                    name: input_values.district,
                    state_id: input_values.state_id
                  },
                  order: [['name', 'ASC']],
                });
                
                
                 citys=[ {
                    country_id: [],
                    cities: citysdata || [],
                  }];
            }
            else{
                
                 const countryIds = input_values.country_id.split(',').map(Number);
                const stateIds = input_values.state_id.split(',').map(Number);
                
                const cityData = await this.db.city.findAll({
                  where: {
                    flag: 1,
                    country_id: countryIds,
                    state_id: stateIds
                  },
                  order: [['name', 'ASC']],
                });
                //return res.status(200).json({ status: 200, message: 'success', data: cityData });
                
                
                
                 citys = countryIds.map((countryId) => {
                  const citiesData = cityData.filter((city) => city.country_id === countryId && stateIds.includes(city.state_id));
                  return {
                    country_id: countryId,
                    cities: citiesData || [],
                  };
                });
                
                
            }
               
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: citys })));
	
        }catch (err) {
                //logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			}
    			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
            }

    }


}




module.exports = new City();