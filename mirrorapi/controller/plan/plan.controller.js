const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const utility = require('../../utility/utility'); 
const planUtility = require('../../utility/mplan.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

class ServicesOperator {

    db = {};

    constructor() {
        this.db = connect();
        
    }

	
    async browsePlan(req, res) {
      const decryptedObject = utility.DataDecrypt(req.encReq);
    //   const { operator, circle, mobile_no } = decryptedObject;
      
      const { operator_id, circle_id, recharge_type_id } = decryptedObject;
    
      const requiredKeys = Object.keys({ operator_id, circle_id, recharge_type_id });
    
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }
    
      try {
        
        if(planUtility.getIpaymentPlan)
        {
            const result = await planUtility.getIpaymentPlan(circle_id, recharge_type_id, operator_id);
            // const planPromise = planUtility.getPlan(operator, circle, null);
            //const planOfferPromise = planUtility.getPlan(operator, circle, mobile_no);

            // const [planResponse] = await Promise.all([planPromise]);
            
            // if (planResponse.error) {
            //      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Plan Error' })));
            // }
        
            if (result.status == 'SUCCESS') {
                //planResponse.result.records.OFFER = planResponseOffer.result.records;
            
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: result.data })));
              } else {
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Invalid Plan Response' })));
              }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'DB Error' })));
        }else{
            return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Plan not Received' })));
        }
        
      } catch (error) {
       
        logger.error(`Error in getPlan: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
        }
        
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
      }
    
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));
    }  
    
    
    
    async rofferPlan(req, res) {
      const decryptedObject = utility.DataDecrypt(req.encReq);
      const { operator, circle, mobile_no } = decryptedObject;
    
      const requiredKeys = Object.keys({ operator, circle, mobile_no });
    
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }
    
      try {
        
        if(planUtility.getPlan)
        {
            const planOfferPromise = planUtility.getPlan(operator, circle, mobile_no);
        
            // Use Promise.all to wait for both promises to resolve
            const [planResponse] = await Promise.all([planOfferPromise]);
            
            if (planResponse.error) {
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Plan Error' })));
            }
        
            if (planResponse.result) {
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: planResponse.result.records })));
              } else {
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Invalid Plan Response' })));
              }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'DB Error' })));
        }else{
            return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Plan not Received' })));
        }
        
      } catch (error) {
       
        logger.error(`Error in getPlan: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500, errors: validationErrors });
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal server error' })));
        }
    
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
        //return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
      }
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));
      //return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
    } 
    
    
    async checkOperator(req, res) {
      
      const { mobile_no } = req;
    
      const requiredKeys = Object.keys({ mobile_no });
    
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
    
      try {
        
        if(planUtility.checkOperator)
        {
            const operators = await planUtility.checkOperator(mobile_no);
            
            if (operators.error) {
                return res.status(500).json({ status: 500, message: 'Operator not found' });
            }
        
            if (operators.result) {
            
                return res.status(200).json({ status: 200, message: 'success', data: operators.result.records });
              } else {
                return res.status(500).json({ status: 500, message: 'Invalid operator Response' });
              }
            
            return res.status(500).json({ status: 500, message: 'DB Error' });
        }else{
            return res.status(404).json({ status: 404, message: 'Operator not found' });
        }
        
      } catch (error) {
       
        logger.error(`Error in checkOperator: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500, errors: validationErrors });
        }
    
        return res.status(500).json({ status: 500, message: 'Failed to fetch', data: [] });
      }
    
      return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
    }  

}





module.exports = new ServicesOperator();