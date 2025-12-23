const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 

class OTP {
  db = {};

  constructor() {
    this.db = connect();
  }

   async otpReport(req, res) {

    // const { from_date, to_date} = req;

    try {
        
        let date = new Date();
        let currentDate = utility.formatDateTime(date);

        const fromDate = new Date(currentDate);
        const toDate = new Date(currentDate);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);
        // const userId = req.id;
        const otpResult = await this.db.smsView.getOtpReport(fromDate, toDate);
        
        const report={                        
          totalSms:await this.db.smsView.count(),
          totalExpsms:await this.db.smsView.count({ where:{ status:0 } }),
          totalActivesms:await this.db.smsView.count({ where:{ status:1 } }),
       }
       
        return {otpResult, report};


        //       const otpResult = [];

        //       for (const item of otpData) {

        //         const userdata = await this.db.user.getData(['first_name', 'last_name', 'mlm_id', 'mobile'], { mobile: item.mobile });
               
        //         otpResult.push({
        //           first_name: userdata ? userdata.first_name :'',
        //           last_name :userdata ? userdata.last_name :'',
        //           mlm_id: userdata ? userdata.mlm_id : '',
        //           mobile: userdata ? userdata.mobile : '',
                 
        //           ...item.dataValues,
        //         });
        //       }

        // otpResult.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
        // return otpResult;


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

module.exports = new OTP();