const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class SendMoney {
  db = {};

  constructor() {
    this.db = connect();
  }

  async summary(req, res) {

    const { from_date, to_date} = req;

    const requiredKeys = Object.keys({ from_date, to_date });
            
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    try {
        const fromDate = new Date(from_date);
        const toDate = new Date(to_date);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);
        
        const results=await this.db.userSummary.findAll({
          where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          },
          order: [['id', 'DESC']]
        });
        
        
        const report={
          total_count : await this.db.userSummary.count( 'user_id',{ where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          }},),
          total_credit : await this.db.userSummary.sum( 'credit', { where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }}
          }),
          total_debit : await this.db.userSummary.sum('debit',  { where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }}
        }),
          total_oldbalance : await this.db.userSummary.sum('opening_balance',  { where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }}
        }),
          total_newbalance : await this.db.userSummary.sum('closing_balance',  { where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }}
		}),
         
		}

        if(results !==null){
            //return res.status(200).json({ status: 200, message:'Successfully all record found', data: results, report });
           return { status: 200, message:'Successfully all record found', data: results };
        }
    
        //return res.status(400).json({ status: 400, message:'Record not found',data:[] });
        return { status: 400, message:'Record not found',data:[] };
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500,errors: validationErrors });
          return { status: 500,errors: validationErrors };
        }
			
        //return res.status(500).json({ status: 500,  message: error ,data:[]});
       return { status: 500,  message: error ,data:[]};
    }
  }

  async main_wallet(transaction_id, user_id, type, amount, project_id) {
    let opening_balance = 0;
    let closing_balance = 0;
    let credit = 0;
    let debit = 0;
    let lastClosingBalance = await this.db.wallet.getLastclosingBalance(user_id);
    
    if(lastClosingBalance>0)
    {
      opening_balance = lastClosingBalance;
    }
    if(type == 'Credit'){
        closing_balance = parseFloat(opening_balance) + parseFloat(amount);
        credit = amount;
    }else{
        closing_balance = parseFloat(opening_balance) - parseFloat(amount);
        debit = amount;
    }
    
    
    const walletData = {
      user_id, 
      transaction_id,
      env: config.env, 
      type, 
      sub_type: 'Wallet Transfer', 
      entry_for: 'Send Money', 
      opening_balance,
      credit,
      debit,
      closing_balance,
      tran_for: 'Send Money', 
      project_id, 
      is_cashfree: 0
    };
    return await this.db.wallet.insert(walletData);
  } 
}

module.exports = new SendMoney();