const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class State {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async getState(req,res) {
           const decryptedObject = utility.DataDecrypt(req.encReq);
	      const input_values = decryptedObject;
	      console.log(`input_values:${JSON.stringify(input_values)}`);
	      const requiredKeys = ['country_id'];
	      console.log(`input_values['state_name']:${input_values['state_name']}`);
            /*if ( !requiredKeys.every(key => key in decryptedObject)  && decryptedObject[key] !== '' && decryptedObject[key] !== undefined ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
              
            }*/
	   
        try {
            let states;
          
            if(input_values['state_name'] !== undefined){
                 
                  let statesmst = await this.db.state.findAll({
                                  where: {
                                    status: 1,
                                    name:input_values['state_name']
                                  },
                                  order: [['name', 'ASC']],
                                });
                                
                    states= [ {
                                  country_id: [],
                                  states: statesmst || [],
                                }];
                
            }else{
                
                
                 const statesData = await this.db.state.findAll({
                                  where: {
                                    status: 1
                                  },
                                  order: [['name', 'ASC']],
                                });
                                    
               
                
                const countryIds = input_values.country_id.split(',').map(Number);
                
                  states = countryIds.map((countryId) => {
                                const countryStates = statesData.filter(state => state.country_id === countryId);
                                return {
                                  country_id: countryId,
                                  states: countryStates || [],
                                };
                              });
                
            }
            
                 
                return res.status(200).json(  utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: states })));                  
	
        } catch (err) {
                logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			}
    			return res.status(500).json( utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })) );
            }

    }
    
    
    
    async getStateTest(req,res) {
        
            // const requiredKeys = ['country_id'];
	      
            // if ( !requiredKeys.every(key => key in req)  && req[key] !== '' && req[key] !== undefined ) {
            //     return res.status(400).json({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys});
              
            // }
	   
        try {
          
                 
                  let statesmst = await this.db.state.findAll({
                                  where: {
                                    status: 1,
                                    country_id:req.country_id
                                  },
                                  order: [['name', 'ASC']],
                                });
                                
                  
                
       
            
                 
                return res.status(200).json(  { status: 200, message: 'success', data: statesmst } );                  
	
        } catch (err) {
                logger.error(`Unable to find : ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
    			return res.status(500).json( { status: 500, message: err.message,data: []  });
            }

    }


}




module.exports = new State();