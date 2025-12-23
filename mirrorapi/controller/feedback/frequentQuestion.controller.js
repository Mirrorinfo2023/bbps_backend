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
class AskedQuestion {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	

    async getFAQList(req,res) {
          const decryptedObject = utility.DataDecrypt(req.encReq);
        const { category_id } = decryptedObject;
      
        const requiredKeys = Object.keys({ category_id });
      
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        
        try {

              const whereCondition = {
                'category_id': category_id,
                'status':1
              }

              let FAQ = await this.db.frequentQuestion.getData(whereCondition);
              
              if (FAQ.length > 0) {
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'FAQ Found', data: FAQ })));
                // return res.status(200).json({ status: 200, message: 'FAQ Found', data: FAQ });
              } else {
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'FAQ Not Found', data: [] })));
                // return res.status(401).json({ status: 401, token: '', message: 'FAQ Not Found', data: [] });
              }
              
            
          }
        catch (err) {
                logger.error(`Unable to find FAQ: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			 // return res.status(500).json({ status: 500,errors: validationErrors });
    			}
    				return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			 //return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
	
        }



            async addFAQ( req, res) {
                
                const { category_id, question, answer  } = req;
                
                const requiredKeys = Object.keys({ category_id, question, answer });
              
                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
                  return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
              
                // try {
                 
                
                  let date = new Date();
                  let created_on = utility.formatDateTime(date);
      
                    const faqData = {
                        category_id, 
                        question, 
                        answer,
                        created_by:2
                       
                    };
              
                    const newFaq = await this.db.frequentQuestion.insertData(faqData);
              
                 
                    return res.status(201).json({ status: 201, message: 'Feedback added successfully', data: newFaq });
                  
                // } catch (error) {
                
              
                //   logger.error(`Error in addFaq: ${error}`);
              
                //   if (error.name === 'SequelizeValidationError') {
                //     const validationErrors = error.errors.map((err) => err.message);
                //     return res.status(500).json({ status: 500, errors: validationErrors });
                //   }
              
                //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
                // }
              
           
          }  



          async getFaqReport(req, res) {
            try {
                
               const result = await this.db.frequentQuestion.getFaq();

               const feedbackResult = [];
          
               for (const item of result) {
             
                const categoryData = await this.db.feedbackCategory.getData(['category_name'], { id: item.category_id });
             
                feedbackResult.push({
                   
                    category_name: categoryData ? categoryData.category_name :'',
                   ...item.dataValues,
                 
                 });
               }
     
     
     
     
             return res.status(200).json({ status: 200,  message:'success', data : feedbackResult });

               
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
          }





}




module.exports = new AskedQuestion();