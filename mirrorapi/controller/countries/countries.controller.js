const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class Countries {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async getCountries(req,res) {
	     
	   
        try {
                 const country = await this.db.countries.findAll({
                                      where: {
                                        flag: 1,
                                      },
                                      order: [['name', 'ASC']],
                                    });
                                    
                return res.status(200).json({ status: 200, message: 'success', data: country });
	
        } catch (err) {
                logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
    			 return res.status(500).json({ status: 500, message: err.message,data: []  });
            }

    }


}




module.exports = new Countries();