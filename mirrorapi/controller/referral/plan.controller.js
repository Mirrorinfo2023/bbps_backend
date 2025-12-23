const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
class Referralplan {
  db = {};

  constructor() {
    this.db = connect();
  }

  async getReferralPlan( req, res) {
            
            const {is_product} = req
            try {
             
                const isProduct = is_product?is_product:0;
                  const result = await this.db.cashbackPlan.getAllPlan({is_product: isProduct});
                  
                  
                 
                  const updatedData = result.map(plan => {
                      
                    
                    if (plan.plan_details) {
                        
                      const cleanedPlanDetails = plan.plan_details.replace(/^'|'$/g, '');
                     
                      const planDetailsObject = JSON.parse(cleanedPlanDetails);
                      
                      const planDetailsValuesArray = Object.values(planDetailsObject);
                     
                      plan.plan_details  = planDetailsValuesArray;
                     
                    }
                    return plan;
                  });

                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: updatedData })));
                
             
            } 
            catch (err) {
                
            			if (err.name === 'SequelizeValidationError') {
            			  const validationErrors = err.errors.map((err) => err.message);
            			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            	}
            	return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
            	
            	
            	
            }
    
    
    
  }
  
  
    async getReferralPlanProduct( req, res) {
            
            try {
             
             
                const [prime, primeProduct ] = await Promise.all([
                                                  this.db.cashbackPlan.getAllPlan({is_product: 0}),
                                                  this.db.cashbackPlan.getAllPlan({is_product: 1})
                                                ]);

                 
                  const primeData = prime.map(plan => {
                      
                    
                    if (plan.plan_details) {
                        
                      const cleanedPlanDetails = plan.plan_details.replace(/^'|'$/g, '');
                     
                      const planDetailsObject = JSON.parse(cleanedPlanDetails);
                      
                      const planDetailsValuesArray = Object.values(planDetailsObject);
                     
                      plan.plan_details  = planDetailsValuesArray;
                     
                    }
                    return plan;
                  });
                  
                  
                  const primeProductData = primeProduct.map(plan => {
                      
                    
                    if (plan.plan_details) {
                        
                      const cleanedPlanDetails = plan.plan_details.replace(/^'|'$/g, '');
                     
                      const planDetailsObject = JSON.parse(cleanedPlanDetails);
                      
                      const planDetailsValuesArray = Object.values(planDetailsObject);
                     
                      plan.plan_details  = planDetailsValuesArray;
                     
                    }
                    return plan;
                  });
                  
                  
                const result = {
                    'prime': primeData,
                    'primeProduct': primeProductData
                }

                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Success', data: result })));
                
             
            } 
            catch (err) {
                
            			if (err.name === 'SequelizeValidationError') {
            			  const validationErrors = err.errors.map((err) => err.message);
            			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            	}
            	return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
            	
            	
            	
            }
    
    
    
  }


  
  
}

module.exports = new Referralplan();