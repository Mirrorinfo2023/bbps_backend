const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const multer = require('multer');

class RechargeServicesOperator {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	
    async mapServiesOperator(req,  res) {
	    
	  
            
		let results = {};
		const {
		    service_id,
		    operator_id,
            code
		} = req;
	
		    const requiredKeys = Object.keys({
                service_id,
                operator_id,
                code});
            
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
            
        try {
                const getRechargeServiceOperator = await this.db.rechargeServiceOperator.findOne({where: {service_id: service_id, operator_id:operator_id, code:code, status:1}});

                    if(!getRechargeServiceOperator){

                            const results = await this.db.sequelize.transaction(async (t) => {
        					  const addNew = await this.db.rechargeServiceOperator.create(
        						{
                                    service_id,
                                    operator_id,
                                    code,
                                    status: 1
        						
        						},
        						 { validate: true, transaction: t,logging: sql => logger.info(sql),  }
        					  );
        					  return addNew;
        					});
				
			
		
        				if (results) {
        				  return res.status(201).json({ status: 201,  message: 'recharge service Operator mapped successfully' ,data:results});
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
   
	
    async getRechargeServiesOperator(req,res) {
         
          try {
              
                  const getRechargeServiesOperator = await this.db.rechargeServiceOperator.findAll({
                                    where: {
                                      status: 1,
                                    },
                                    include: [{
                                        model: rechargeServices,
                                        where: ["id = rechargeServiceOperator_service_id"]
                                    }],
                                    order: [['id', 'ASC']],
                                  });
                  
                  return res.status(200).json({ status: 200, message: 'success', data: getRechargeServiesOperator });
      
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





module.exports = new RechargeServicesOperator();