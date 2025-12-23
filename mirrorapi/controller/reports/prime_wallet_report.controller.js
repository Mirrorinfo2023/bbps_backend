const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class PrimeWalletReport {
  db = {};

  constructor() {
    this.db = connect();
  }

  async primeReport(req, res) {

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

        const results=await this.db.viewPrimeWallet.findAll({
          where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
          },
          order: [['created_on', 'DESC']],
        });
        
        
        const report = {        
          totalCount: Number(await this.db.viewPrimeWallet.sum('main_amount',  {where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
        }})).toFixed(2),         
          OpeningBal: Number(await this.db.viewPrimeWallet.sum('opening_balance' ,  {where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
        }})).toFixed(2),
          ClosingBal: Number(await this.db.viewPrimeWallet.sum('closing_balance',  {where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
        }})).toFixed(2),
          Credit: Number(await this.db.viewPrimeWallet.sum('credit',  {where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
        }})).toFixed(2),
          Debit: Number(await this.db.viewPrimeWallet.sum('debit',  {where: {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
        }})).toFixed(2),
        };

        if(results !==null){
            return res.status(200).json({ status: 200, message:'Successfully all record found', data: results, report });
        }
    
        return res.status(400).json({ status: 400, message:'Record not found',data:[] });
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

module.exports = new PrimeWalletReport();