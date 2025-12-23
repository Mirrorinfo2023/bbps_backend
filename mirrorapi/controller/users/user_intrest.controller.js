const { connect } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utility = require('../../utility/utility'); 
//const helper = require('../utility/helper'); 
const pino = require('pino');
// const logger = pino({ level: 'info' }, process.stdout);

class userIntrest {

    db = {};

    constructor() {
        this.db = connect();
        
    }


    
    async getUserIntrestCategory( req, res) {

        let t;
        
        try {
           
        
          const categoryData = await this.db.userIntrestCategory.getCategory({ status:1 });
           
              if (categoryData) {
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Get Category successfully', data: categoryData })));
              } else {
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, error: 'Category Not Found' })));
              }
          } catch (error) {
          
              logger.error(`Error in Getting Data: ${error}`);
      
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
              }
                
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));

            }
    
    }
    
    async uploadUserIntrest(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        let t;
        
        const { intrest_categories , mobile} = decryptedObject;
      
        try {
           
            t = await this.db.sequelize.transaction();
            const currentDate = new Date();
            const cdt = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
          
            const userIntrest = await this.db.userIntrest.getData(['intrest_categories','mobile'], {'mobile':mobile})
            

            if (!userIntrest) {

                  const userData = {
                    mobile,
                    // user_id:userId,
                    intrest_categories,
                    created_on:cdt,
                    // created_by:userId
                  };
                  const newIntrest = await this.db.userIntrest.insertData(userData);
        
                  await t.commit();
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Intrest  done successfully', data: newIntrest })));

              } else {

                    const userData = {
                  
                      intrest_categories,
                      modified_on:cdt,
                      // modified_by:userId,

                    };
                    const newIntrest = await this.db.userIntrest.updateData(userData,  {mobile:mobile} );
          
                    await t.commit();
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Intrest updated successfully', data: newIntrest })));
             
              }


          } catch (error) {
            if (t) {
              await t.rollback();
            }
      
              logger.error(`Error in User Intrest: ${error}`);
      
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
              }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));
            }
      
       
	
    }




}

   

module.exports = new userIntrest();