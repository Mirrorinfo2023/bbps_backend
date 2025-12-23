const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const smsUtility = require('../../utility/sms.utility');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const moment = require('moment');

class Rating {

    db = {};

    constructor() {
        this.db = connect();
        
    }


    async addRating( filename,req, res) {
        let t;
        
        const { user_id, service, rate, review , app_id } = req;
        
      
        try {
            const filePath = filename;
            const path ='uploads/rating/';
            t = await this.db.sequelize.transaction();
         
            const Data = {
                user_id, 
                service, 
                rate, 
                review,
                app_id,
                image:filePath ? path+filePath : '',
                created_by:user_id
            };
      
            const newRating = await this.db.rating.insertData(Data, {
              validate: true,
              transaction: t,
              logging: sql => logger.info(sql),
            });
      
            await t.commit();
              return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Rating added successfully', data: newRating })));
            // return res.status(201).json({ status: 201, message: 'Rating added successfully', data: newRating });
          
        } catch (error) {
          if (t) {
            await t.rollback();
          }
      
          logger.error(`Error in add Rating: ${error}`);
      
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error' })));
            // return res.status(500).json({ status: 500, errors: validationErrors });
          }
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
        //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        }

    }  


    
    
    async getRating(req,res) {
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
              'status': {
                [Op.or]: [1, 2]
              },
          }
            const result = await this.db.ratingView.getAllData(whereCondition);
       
            const ratingResult = [];
      
            for (const item of result) {
          
          
                ratingResult.push({
               
                ...item.dataValues,
                image: baseurl+item.image,
              });
            }
  
            const report={
                totalCount: await this.db.ratingView.count({ where: {...whereCondition} }),
                totalAvg:Number(await this.db.ratingView.sum('rate', { where: {...whereCondition} })/await this.db.ratingView.count({ where: {...whereCondition} })).toFixed(2),
              }
      
  
          return res.status(200).json({ status: 200,  message:'success', data : ratingResult, report });
          
          }
        catch (err) {
                logger.error(`Unable to find Rating: ${err}`);
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
           return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
  
        }


	
	

}




module.exports = new Rating();