const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class ReferralUserReport {
  db = {};

  constructor() {
    this.db = connect();
  }

  

  async  GetRoyalityHistroy(req, res) {

        const { from_date, to_date} = req;
      
        // try {


          let whereCondition ;

          const startDate =new Date(from_date);
          const endDate =new Date(to_date);
          endDate.setHours(23, 59, 59);
          
          
          let today = new Date();
          let currentFirstDate = new Date(today.setHours(0, 0, 0, 0));
          let currentEndDate = new Date(today.setHours(23, 59, 59, 999));
          let currentFirstDateM = new Date(today.getFullYear(), today.getMonth(), 1);
          let currentEndDateM = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
          
          const report={
        		total_royalitygenerate : await this.db.view_royality.total_RoyalityGenerate(),
        		todays_royalityIncome: await this.db.view_royality.total_royalityIncome({'created_on': {
        			[Op.between]: [currentFirstDate, currentEndDate]
        		}}),
        
        		Month_royalityIncome: await this.db.view_royality.total_royalityIncome({'created_on': {
        		  [Op.between]: [currentFirstDateM, currentEndDateM]
        		}}),
        
        	}

          whereCondition = {

              'created_on': {
                [Op.between]: [startDate, endDate]
              },
          }

        const results = await this.db.view_royality.getAllData(whereCondition);
   
        const royalityResult = [];
            
        for (const item of results) {

            const resultsCount555 = await this.db.PlanPurchase.getPrimeCountwithCondition(1);
            const resultsCount1499 = await this.db.PlanPurchase.getPrimeCountwithCondition(2);
            const resultsCount2360A = await this.db.PlanPurchase.getPrimeCountwithCondition(3);
            const resultsCount2360B = await this.db.PlanPurchase.getPrimeCountwithCondition(4);

            const totalBusiness = ((resultsCount555 * 555 ) + (resultsCount1499 * 1499 )+ (resultsCount2360A * 2360 ) +(resultsCount2360B * 2360 ));
            const royality = (totalBusiness* 0.04);

                royalityResult.push({
                ...item.dataValues,
                resultsCount555,
                resultsCount1499,
                resultsCount2360A,
                resultsCount2360B,
                totalBusiness,
                royality
            });

        }
        // const getTodaysPlanCounts =await this.db.sequelize.query( `SELECT 
        //                 SUM(CASE WHEN plan_id = 1 THEN 1 ELSE 0 END) AS plan_555,
        //                 SUM(CASE WHEN plan_id = 2 THEN 1 ELSE 0 END) AS plan_1499,
        //                 SUM(CASE WHEN plan_id = 3 THEN 1 ELSE 0 END) AS plan_2360_A,
        //                 SUM(CASE WHEN plan_id = 4 THEN 1 ELSE 0 END) AS plan_2360_B
        //             FROM 
        //                 tbl_plan_purchase
        //             WHERE 
        //                 plan_id IN (1,2, 3, 4)`);

                   

        // console.log(resultsCount555);
      
    
        if(royalityResult !==null){
            return res.status(200).json({ status: 200, message:'Successful', data: royalityResult, report });
        }
    
        return res.status(400).json({ status: 400, message:'Record not found',data:[] });
    // } catch (error) {
    //     logger.error(`Unable to find user: ${error}`);
    //     if (error.name === 'SequelizeValidationError') {
    //       const validationErrors = error.errors.map((err) => err.message);
    //       return res.status(500).json({ status: 500,errors: validationErrors });
    //     }
			
    //     return res.status(500).json({ status: 500,  message: error ,data:[]});
    // }
  }

  
 
}

module.exports = new ReferralUserReport();