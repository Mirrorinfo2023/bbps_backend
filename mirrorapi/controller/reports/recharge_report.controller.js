const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const { paginate } = require('../../utility/pagination.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class RechargeReport {
  db = {};

  constructor() {
    this.db = connect();
  }

  async recharge(req, res) {

    const { from_date, to_date} = req;

    const requiredKeys = Object.keys({ from_date, to_date});
            
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    try {
        const fromDate = new Date(from_date);
        const toDate = new Date(to_date);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);

        const results=await this.db.rechargeReport.findAll({
          where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
          },
          order: [['created_on', 'DESC']],
        });

        if(results !==null){
            return { status: 200, message:'Successfully all record found', data: results };
        }
    
        return { status: 400, message:'Record not found',data:[] };
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return { status: 500,errors: validationErrors };
        }
			
        return { status: 500,  message: error ,data:[]};
    }
  }
  
  
  async rechargeHoldList(req, res) 
  {

    const { from_date, to_date, searchkey, page } = req;

    const requiredKeys = Object.keys({ from_date, to_date});
            
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }
  
    try {
        const fromDate = new Date(from_date);
        const toDate = new Date(to_date);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);

        let searchParam = '';

        if(searchkey !=null && searchkey!='')
        {
          searchParam = {
            [Op.or]: [
              { 'recharge_status': { [Op.like]: '%' + searchkey + '%' } },
              { 'first_name': { [Op.like]: '%' + searchkey + '%' } },
              { 'last_name': { [Op.like]: '%' + searchkey + '%' } },
              { 'mlm_id': { [Op.like]: '%' + searchkey + '%' } },
              { 'mobile': { [Op.like]: '%' + searchkey + '%' } },
              { 'email': { [Op.like]: '%' + searchkey + '%' } },
              { 'operator_name': { [Op.like]: '%' + searchkey + '%' } }
            ]
          };
        }else{
          searchParam = {
            'created_on': {
              [Op.between]: [fromDate, toDate]
            }
          }
        }

        const whereClause = {'http_code': 202, ...searchParam }

        const getRechargeData = await paginate(this.db.rechargeReport, {
          whereClause,
          order: [['id', 'DESC']],
          page: page?page:1
        });


        if (getRechargeData) {
            return res.status(200).json({ status: 200, message: 'Success', data:getRechargeData.data, totalPageCount: getRechargeData.totalPageCount });
          } else {
            return res.status(500).json({ status: 500, message: 'No data Found', data: [] });
          }

        
    } catch (error) {
        
        logger.error(`Unable to find record: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
      
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }

 
}

module.exports = new RechargeReport();