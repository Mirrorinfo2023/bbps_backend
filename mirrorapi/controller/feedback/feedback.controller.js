const { connect,baseurl } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 
const path = require('path');
require('dotenv').config();
const whatsappUtility = require('../../utility/whatsapp.utility');
const messagingService = require('../../router/whatsapp/messagingService');
const emailUtility = require('../../utility/email.utility');
class Feedback {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
            async getFeedbackCategory(req,res) {
                
                    const decryptedObject = utility.DataDecrypt(req.encReq);
                    const { cat_group } = decryptedObject;
                  
                    const requiredKeys = Object.keys({ cat_group });
                  
                    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                      
                    }
                    try {
        
                      const whereCondition = {
                        'cat_group': cat_group
                      }
        
                      let feedbackCategories = await this.db.feedbackCategory.getCategoryData(whereCondition);
                      
                      if (feedbackCategories.length > 0) {
                          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: feedbackCategories })));
                        
                      } else {
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



        async getFeedbackReason(req,res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
          const { category_id } = decryptedObject;
    
          const requiredKeys = Object.keys({ category_id });
        
          if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
          }
	  
            try {

              
               
                let feedbackReason = await this.db.feedbackReason.getFeedbackReason(category_id);
              
                
                  if (feedbackReason.length > 0) {
                    //   return res.status(400).json({ status: 200, message: 'Reason Found', data: feedbackReason });
                      return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Reason Found', data: feedbackReason })));
                  } else {
                        // return res.status(400).json({ status: 401, token: '', message: 'Reason Not Found', data: [] });
                      return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Reason Not Found', data: [] })));
                  }
                  
                
              }
            catch (err) {
                    logger.error(`Unable to find Banner: ${err}`);
                    if (err.name === 'SequelizeValidationError') {
                      const validationErrors = err.errors.map((err) => err.message);
                    //   return res.status(400).json({ status: 500,errors: validationErrors });
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                    }
                    // return res.status(400).json({ status: 500,token:'', message: err,data: []  });
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                }
        
            }


            async addFeedback(filename, req, res) {
                let t;
                
                const {userid, category_id, reason_id, mobile,problem_description } = req;
                
                const requiredKeys = Object.keys({ userid, category_id, reason_id, mobile,problem_description  });
              
                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
                    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                }
              
                try {
                  const filePath = filename;
                  const path ='/uploads/feedback/';
                  t = await this.db.sequelize.transaction();
                  const order_id=utility.generateUniqueNumeric(7);
                  const ticket = '#TCK'+order_id;
                  let date = new Date();
                  let created_on = utility.formatDateTime(date);
      
                    const feedbackData = {
                        mobile,
                        whatsapp_no:mobile,
                      category_id,
                      reason_id,
                      ticket_no:ticket,
                      user_id:userid,
                      problem_description,
                      img:filePath? path+filePath: '',
                      created_on,
                      status: 3
                    };
              
                    const newFeedback = await this.db.feedback.insertData(feedbackData, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
                    });
              
                    await t.commit();
                  const whereChk = { id: userid };
                  const UserAttribute = ['id', 'first_name', 'last_name', 'mobile','email'];
                  const userRow = await this.db.user.getData(UserAttribute, whereChk);
                  let message;
                  message = await whatsappUtility.feedback(userRow.first_name, userRow.last_name);
                 const emailMsg = await emailUtility.feedbackEmail(userRow.first_name, userRow.last_name);
                  messagingService.sendMessage(mobile, message,null,userRow.email,'Feedback Received',emailMsg);
                  return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, message: 'Feedback added successfully', data: newFeedback })));
                  
                } catch (error) {
                  if (t) {
                    await t.rollback();
                  }
              
                  logger.error(`Error in addFeedback: ${error}`);
              
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
                  }
              
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
                }
              
           
          }  



          
         async getFeedbackReport(req, res) {
            const { from_date, to_date} = req; 

            try {
            
                let whereCondition ;
      
                const startDate =new Date(from_date);
                const endDate =new Date(to_date);
                endDate.setHours(23, 59, 59);
      
                whereCondition = {
                  
                    'created_on': {
                        [Op.between]: [startDate, endDate]
                    },
                }
                
                const report={
                    totalFeedbackCount:await this.db.feedback_view.count({where: {...whereCondition}}),
                    totalResolveFeedback:await this.db.feedback_view.count({  where:{ status:1, ...whereCondition } }),
                    totalHoldFeedback:await this.db.feedback_view.count({  where:{ status:2, ...whereCondition } }),
                    totalPendingFeedback:await this.db.feedback_view.count({  where:{ status:3, ...whereCondition } }),
                 }
               const result = await this.db.feedback_view.getAllData(whereCondition);

               const feedbackResult = [];
          
               for (const item of result) {
             
                feedbackResult.push({
                   ...item.dataValues,
                   img: baseurl+item.img,
                 });
               }

               
             return res.status(200).json({ status: 200,  message:'success', data : feedbackResult, report });

               
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
          }



            
async updateFeedbackStatus(req, res) {
    const {id,action,status} = req;

    
    const requiredKeys = Object.keys({ id,action,status});
          
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {
        
      //  if(note==null || note==''){
      //     note='Resolve';
      //  }
      
      
      // const status = (action === 'Resolve') ? 1 : 3;

        const currentDate = new Date();
        const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
        
          const updatedStatus = await this.db.feedback.UpdateData(
                    {
                      // rejection_reason:note,
                      status,
                      modified_on:created_on
                    },
                    
                    {id:id}
                    
                  );
                    
                  if (updatedStatus > 0) {
                    return res.status(200).json({ status: 200, message: 'Feedback Updated Successful.'});
                  } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                  }
                
            } catch (error) {
               
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
          }
          
          
          
         async getFeedbackHistory(req, res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { user_id } = decryptedObject; 
              const requiredKeys = Object.keys({ user_id });
             if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }

            try {
            
                let whereCondition ;
                whereCondition = {
                  user_id:user_id
                    // 'created_on': {
                    //     [Op.between]: [startDate, endDate]
                    // },
                }
               const result = await this.db.feedback_view.getAllData(whereCondition);
               
               const feedbackResult = [];
          
               for (const item of result) {
             
                feedbackResult.push({
                   ...item.dataValues,
                   img:item.img?  baseurl+item.img:'',
                 });
               }

               if(feedbackResult){
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'success', data : feedbackResult })));
                    // return res.status(200).json({ status: 200,  message:'success', data : feedbackResult });
               }else{
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message:'Records Not Found', data : [] })));
                    // return res.status(400).json({ status: 400,  message:'Records Not Found', data : [] });
               }

               
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                //   return res.status(500).json({ status: 500,errors: validationErrors });
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                }
              
                 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));
                // return res.status(500).json({ status: 500,  message: error.message ,data:[]});
            }
          }

              


}




module.exports = new Feedback();