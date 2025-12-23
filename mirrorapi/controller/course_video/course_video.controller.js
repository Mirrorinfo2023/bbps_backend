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
const { paginate } = require('../../utility/pagination.utility'); 

class CourseVideo {

    db = {};

    constructor() {
        this.db = connect();
        
    }

     
    async getVideoList( req, res) {
          const decryptedObject = utility.DataDecrypt(req.encReq);
          const { user_id, category_id} = decryptedObject; 
  
        try {
         
          let whereCondition ;

          whereCondition = {
              category_id:category_id,
              status:1
          }
          const result = await this.db.viewCourseVideo.getAllData(whereCondition);
          if(result){
            // return res.status(200).json({ status: 200,  message:'success', data : result });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'success', data : result })));

          }else{
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message:'Not found', data : [] })));
            // return res.status(400).json({ status: 400,  message:'Not found', data : [] });
          }
       
  
        } catch (error) {
            logger.error(`Unable to find Video: ${error}`);
            if (error.name === 'SequelizeValidationError') {
                 return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
            //   return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
            }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
            // return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
          
      }
    
  async getVideoListAdmin( req, res) {

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
            'status':1
        }
      const result = await this.db.viewCourseVideo.getAllData(whereCondition);
     
      const leadResult = [];

        for (const item of result) {
          leadResult.push({
              ...item.dataValues,
              img:item.thumbnail_img? baseurl+item.thumbnail_img :'',
            });
        }

      return res.status(200).json({ status: 200,  message:'success', data : leadResult });
     

      } catch (error) {
          // logger.error(`Unable to find user: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            // const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
          }
        
          return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
        
    }

    async addCourseVideo(filename, req, res) {
        let t = await this.db.sequelize.transaction();
        
        const { category_id, title, video_link} = req;

        const requiredKeys = Object.keys({ category_id, title, video_link });
      
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
      
        try {

            const filePath = filename;
            const path ='/uploads/video_category/';
            
            // if (!existingLead) {
              const instData = {
                    title,
                      category_id,
                      video_link,
                      thumbnail_img:path+filePath,
              };
        
              const newLeads = await this.db.videoCourseDetails.insertData(instData, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
              });

              await t.commit();
                if(newLeads){
                    return res.status(201).json({ status: 200, message: 'Leads added successfully', data: newLeads });
                }else{
                    return res.status(201).json({ status: 200, message: 'Video Not Saved', data: [] });
                }
          

        } catch (error) {
          await t.rollback();
          logger.error(`Error in add Leads: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            return res.status(500).json({ status: 500, errors: 'Internal Server Error' });
          }
          return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        }

    }
	
    async getVideoCourses(req,res) {
            
        const { video_id } = req; 
       
        const requiredKeys = Object.keys({video_id });
        
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
                  

        try {
         
          let whereCondition ;
          whereCondition = {
              'id':video_id ,
          }
          const result = await this.db.videoCourseDetails.findOne({
            where: whereCondition,
          });
               
            if(result){
              return res.status(200).json({ status: 200,  message:'success', data : result });
            }
            else{
              return res.status(400).json({ status: 400,  message:'not found', data : [] });
            }
          
          }
        catch (err) {
                logger.error(`Unable to find Meeting: ${err}`);
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
           return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
  
        }


        
          

      async updateVideoCourse(filename,req, res) {

        const {video_id,title, category_id, video_link, status} = req;

     
        let t;

        try {
            const currentDate = new Date();
            const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

            const filePath = filename;
            const path ='/uploads/video_category/';
            
              const updatedStatus = await this.db.videoCourseDetails.UpdateData(
                  {
                    thumbnail_img:path+filePath,
                    title, 
                    category_id, 
                    video_link, 
                    status,
                    modified_on:created_on
                  },
                  {id:video_id}
                );
                
                if (updatedStatus) {
                  return res.status(200).json({ status: 200, message: 'Course Video Updated Successful.'});
                } else {
                  return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                }
               
                } catch (error) {
                    logger.error(`Unable to find Course Video : ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                    }
                  
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
          }

            
          

      async updateVideoCourseStatus(req, res) {

        const {video_id, status, action} = req;

        const requiredKeys = Object.keys({ video_id });  

        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
     
        let t;

        try {
            const currentDate = new Date();
            const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

              const updatedStatus = await this.db.videoCourseDetails.UpdateData(
                  {
                
                    status,
                    modified_on:created_on
                  },
                  {id:video_id}
                );
                
                if (updatedStatus) {
                  return res.status(200).json({ status: 200, message: `Course Video ${action} Successful.`});
                } else {
                  return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                }
               
                } catch (error) {
                    logger.error(`Unable to find Course Video : ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                      return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                    }
                  
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
          }



  

          
              


}




module.exports = new CourseVideo();