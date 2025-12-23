const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 
const path = require('path');
require('dotenv').config();
// const baseUrl = process.env.API_BASE_URL;
class Graphics {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async getCategoryList(req,res) {
        
        const { from_date, to_date} = req; 

            try {
            
                let whereCondition ;

                const startDate =new Date(from_date);
                const endDate =new Date(to_date);
                endDate.setHours(23, 59, 59);

                whereCondition = {
                    'status': {
                        [Op.or]: [1, 2]
                        },
                    'created_on': {
                        [Op.between]: [startDate, endDate]
                    },
                }
        
           
            let graphicsCategories = await this.db.graphicsCategory.getAllData(whereCondition);

              const graphicsResult= graphicsCategories.map((item) => ({
                  
                  id: item.id,
                  image: baseurl+item.image,
                  description: item.description,
                  category: item.category_name,
                  created_on:item.created_on,
                  status:item.status,

                }));

              if (graphicsResult.length > 0) {
                // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: graphicsResult })));
                return res.status(200).json({ status: 200, message: 'Category Found', data: graphicsResult });
              } else {
                // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
                return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
              }
              
            
          }
        catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
                //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
                // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
	
        }

    
        async addCategory(filename, req, res) {
          
            const { category_name, description } = req;
          
            try {
              const filePath = `uploads/graphics/category/`+filename;
            
              const existingCategory = await this.db.graphicsCategory.getDataWithClause(category_name);
          
              if (!existingCategory) {
                const categoryData = {
                  category_name,
                  description,
                  image:filePath
                };
          
                const newCategory = await this.db.graphicsCategory.insertData(categoryData);
                    return res.status(201).json({ status: 201, message: 'Category added successfully', data: newCategory });
                } else {
                    return res.status(500).json({ status: 500, error: 'Already Exist' });
                }
            } catch (error) {
                logger.error(`Error in addCategory: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors: validationErrors });
                }
                return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
               
        }  



        async updateCategoryStatus(req, res) {
            const {id,action,status} = req;

            const requiredKeys = Object.keys({ id,action,status});
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
  
            let t;
  
            try {
                const currentDate = new Date();
                const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
        
                const updatedStatus = await this.db.graphicsCategory.UpdateData(
                    {
                      status,
                      modified_on:modified_on
                    },
                    
                    {id:id}
                    
                  );
                    
                  if (updatedStatus > 0) {
                    return res.status(200).json({ status: 200, message: 'Category Status Updated Successful.'});
                  } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                  }
                
            } catch (error) {
                logger.error(`Unable to find Category: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
          }
              

      async getGraphicsCategory(req,res) {

          const { id } = req;
                
          const requiredKeys = Object.keys({ id });
        
          if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }
        
    
        try {
            let whereCondition='';
              whereCondition = {
                'id': id,
                }
                
                let graphics = await this.db.graphicsCategory.getCategoryData(whereCondition);
            
         
                if (graphics) {
                return res.status(200).json({ status: 200, message: 'Graphics found', data: graphics });
                } else {
                return res.status(401).json({ status: 401, token: '', message: 'Graphics Not Found', data: [] });
                }
                
            
            }
            catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: validationErrors });
                }
                    return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
    
        }
    
    

        async updateGraphicsCategory(filename,req, res) {
            const {id,category_name, description} = req;

            const requiredKeys = Object.keys({ id,category_name,});
                  
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
          
            let t;
          
            try {
                
                const filePath = `uploads/graphics/category/`+filename;
          
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

                const existingCategory = await this.db.graphicsCategory.getDataWithClause(category_name);
          
                if (!existingCategory) {
                    const updatedMoneyStatus = await this.db.graphicsCategory.UpdateData(
                        {
                            category_name,
                            description,
                            image:filePath,
                            modified_on:created_on
                        },
                        {id:id}
                        );
                            
                          if (updatedMoneyStatus > 0) {
                            return res.status(200).json({ status: 200, message: ' Updated Successful.'});
                          } else {
                            return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                          }
                    }
                    } catch (error) {
                        logger.error(`Unable to find Category: ${error}`);
                        if (error.name === 'SequelizeValidationError') {
                          const validationErrors = error.errors.map((err) => err.message);
                          return res.status(500).json({ status: 500,errors: validationErrors });
                        }
                      
                        return res.status(500).json({ status: 500,  message: error ,data:[]});
                    }
                  }
                  
                  
                  
            async getGraphicsCategoryAdmin(req,res) {

              try {
                  
                  let graphicsCategories = await this.db.graphicsCategory.getGraphicsCategory();
                
                  const graphicsResult= graphicsCategories.map((item) => ({
                      
                      id: item.id,
                      image: baseurl+item.image,
                      description: item.description,
                      category: item.category_name,
                      created_on:item.banner_date,
                      status:item.status,
      
                    }));
                    
                     
      
                    if (graphicsResult.length > 0) {
                      //   return res.status(200).json({ status: 200, message: 'Category Found', data: graphicsResult });
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: graphicsResult })));
                      
                    } else {
                      //   return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
                        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
                      
                    
                    }
                    
                  
                }
              catch (err) {
                      logger.error(`Unable to find Banner: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                  const validationErrors = err.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                  
                  }
        
              }
                  
                  
                  
            
                
          

}




module.exports = new Graphics();