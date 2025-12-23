const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

class RechargeServices {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	
    async services(req,res) {
	    
	  
            
		let results = {};
		const {
		    service_name,
		    service_url,
            callback_url
		} = req;
	
		    const requiredKeys = Object.keys({
                service_name,
		        service_url,
                callback_url });
            
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
            
        try {
                const getService = await this.db.rechargeServices.findOne({where: {service_name: service_name }});

                    if(!getService){
                            
                            const results = await this.db.sequelize.transaction(async (t) => {
        					  const newService = await this.db.rechargeServices.create(
        						{
                                    service_name,
                                    service_url,
                                    callback_url,
                                    status: ['1']
        						
        						},
        						 { validate: true, transaction: t,logging: sql => logger.info(sql),  }
        					  );
        					  return newService;
        					});
				
			
		
        				if (results) {
        				  return res.status(201).json({ status: 201,  message: 'Service add successfully' ,data:results});
        				} else {
        				  return res.status(500).json({ status: 500,error: 'Failed to create' });
        				}
        				
        				
                        }else{
                			 return res.status(500).json({ status: 500,error: 'Already Exist' });
                		}
                 
				
            
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
			if (error.name === 'SequelizeValidationError') {
			  const validationErrors = error.errors.map((err) => err.message);
			  return res.status(500).json({ status: 500,errors: validationErrors });
			}
			
             return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
		return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }
   
	
    async getServices(req,res) {
         
          try {
              
                  const getServices = await this.db.rechargeServices.findAll({
                                    where: {
                                      status: 1,
                                    },
                                    order: [['service_name', 'ASC']],
                                  });
                  
                  return res.status(200).json({ status: 200, message: 'success', data: getServices });
      
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





module.exports = new RechargeServices();