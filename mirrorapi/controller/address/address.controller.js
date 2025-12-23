const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
  
    // Optional depending on the providers
    //fetch: customFetchImplementation,
    apiKey: 'AIzaSyC_2gkuZ9Yu4I0rupcdV9Z4s89MJh7WOys', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
const geocoder = NodeGeocoder(options);

class Address {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async getAddress(req,res) {
	       const input_values = req;
	       const requiredKeys = ['latitude', 'longitude'];
            
            if ( !requiredKeys.every(key => key in req)  && req[key] !== '' && req[key] !== undefined ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys});
            }
	   
        try {
            
                const geocode = await geocoder.reverse({ lat: input_values.latitude, lon: input_values.longitude });
                 
                                    
                return res.status(200).json({ status: 200, message: 'success', data: geocode });
	
        }catch (err) {
                logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
    			 return res.status(500).json({ status: 500, message: err.message,data: []  });
            }

    }


}




module.exports = new Address();