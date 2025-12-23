const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();
const whatsappUtility = require('../../utility/whatsapp.utility');

class Insuarnce {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
  

            async getAffiliateCategory(req,res) {
                

              try {
                  
                  const report={
                        totalAffilatelinkListCount:await this.db.affiliateLinkCategories.count(),
                        totalDeleteAffilatelinkList:await this.db.affiliateLinkCategories.count({  where:{ status:`0` } }),
                        totalActiveAffilatelinkList:await this.db.affiliateLinkCategories.count({  where:{ status:`1` } }),
                        totalInactiveAffilatelinkList:await this.db.affiliateLinkCategories.count({  where:{ status:`2` } }),
                    }
               
                  const category= await this.db.affiliateLinkCategories.getCategory();
                 if(category){
                 return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found successfully', data: category, report })));
                    // return res.status(200).json({ status: 200, message: 'Category Found successfully', data: category });
                 }else{
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Not Found', data: [] })));
                    // return res.status(200).json({ status: 200, message: 'Category Not Found', data: [] });
                 }
                 
                }
              catch (err) {
                      logger.error(`Unable to find Insuarnce: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                  const validationErrors = err.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                  // return res.status(500).json({ status: 500,errors: validationErrors });
                }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                  }

              }
              
              
               async addCategory( req, res) {
                let t;
                
                const { category_name } = req;
              
                try {
               
                
                  t = await this.db.sequelize.transaction();
               
                  const existingCategory = await this.db.affiliateLinkCategories.getDataWithClause(category_name);
                  
                  if (existingCategory.length == 0) {
                    const categoryData = {
                      category_name
                    };
              
                    const newCategory = await this.db.affiliateLinkCategories.insertData(categoryData, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
                    });
              
                    await t.commit();
              
                    return res.status(201).json({ status: 201, message: 'Category added successfully', data: newCategory });
                  } else {
                    await t.rollback();
                    return res.status(500).json({ status: 500, error: 'Already Exist' });
                  }
                } catch (error) {
                  if (t) {
                    await t.rollback();
                  }
              
                  logger.error(`Error in addCategory: ${error}`);
              
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors: validationErrors });
                  }
              
                  return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
                }
              
                return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
               } 
             

          async getCategory(req, res) {

                const {id} = req;
      
                const requiredKeys = Object.keys({ id});   
                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                  return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
      
                let t;
      
              try {
                        const whereCondition = {
                          'id': id
                      }
                        const link = await this.db.affiliateLinkCategories.findOne({
                          where: whereCondition,
                        });
                        
                            if (link) {
                              return res.status(200).json({ status: 200, message: 'Status Updated Successful.', data: link});
                            } else {
                              return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                            }
                          
                      } catch (error) {
                          logger.error(`Unable to find link: ${error}`);
                          if (error.name === 'SequelizeValidationError') {
                            const validationErrors = error.errors.map((err) => err.message);
                            return res.status(500).json({ status: 500,errors: validationErrors });
                          }
                        
                          return res.status(500).json({ status: 500,  message: error ,data:[]});
                      }
        }

}




module.exports = new Insuarnce();