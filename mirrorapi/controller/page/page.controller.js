const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);


require('dotenv').config();
const baseUrl = process.env.API_BASE_URL;

class Page {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	

    

	
    async getPageDetails(req,res) {

      try {

        const { category } = req;

        const requiredKeys = Object.keys({ category });
        
        // if (requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {}
        let cleanedContent=[];
        const getPage = await this.db.page.getDataWithClause(category);
     
        
        // const content = getPage.content;
      
        // cleanedContent = await this.removeHtmlTags1(content);
        // getPage.cleanedContent = cleanedContent;
       
        return res.status(200).json({ status: 200, message: 'success', data: getPage});

      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
        return res.status(500).json({ status: 500, message: err.message,data: []  });
      }

    }
    
    
    async getPageList(req,res) {

      try {

        const getPage = await this.db.page.getAllData();
      
        return res.status(200).json({ status: 200, message: 'success', data: getPage});

      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
        return res.status(500).json({ status: 500, message: err.message,data: []  });
      }

    }

    
    async getPage(req,res) {

      try {

        const { page_id } = req;

        const requiredKeys = Object.keys({ page_id });
        
        // if (requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {}
      
          let pageData = await this.db.page.findOne({
            where: {
                id:page_id
            },
        });
  
        return res.status(200).json({ status: 200, message: 'success', data: pageData});

      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
        return res.status(500).json({ status: 500, message: err.message,data: []  });
      }

    }


    async updatePage(req,res) {

   
        const { page_id,title, content } = req;

        const requiredKeys = Object.keys({ page_id,title });
      
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        try {

               const Data = {
                    title,
                     content,
                  };

                 const whereCondition={
                    id:page_id
                  };

                  const newPage = await this.db.page.UpdateData(Data,whereCondition);
                  if(newPage){
                    return res.status(200).json({ status: 200, message: 'Graphics updated successfully', data: newPage });
                  }else{
                    return res.status(200).json({ status: 200, message: 'Failed To Update', data: [] });
                  }
                

      } catch (err) {
        // logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
        return res.status(500).json({ status: 500, message: err.message,data: []  });
      }

    }
    
    
    
    async addPage(req,res) {

   
      const { title, content } = req;

      const requiredKeys = Object.keys({ content,title });
    
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      try {
            const category = title.replace(/\s+/g, '_').toLowerCase();
            const existingPage = await this.db.page.findOne({where: {status:1, category:category},});
            if (!existingPage) {

             const Data = {
                  title,
                  content,
                  category
                };

            const newPage = await this.db.page.insertData(Data);
            if(newPage){
              return res.status(200).json({ status: 200, message: 'Graphics updated successfully', data: newPage });
            }else{
              return res.status(200).json({ status: 200, message: 'Failed To Update', data: [] });
            }
          }else{
              return res.status(400).json({ status: 400, message: 'Page Already Exists', data: [] });
          }
              

    } catch (err) {
      // logger.error(`Unable to find : ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500,errors: validationErrors });
      }
      return res.status(500).json({ status: 500, message: err.message,data: []  });
    }

  }


	

}





module.exports = new Page();