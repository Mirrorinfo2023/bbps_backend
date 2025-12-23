const { connect,config } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const utility = require('../../utility/utility'); 
const { paginate } = require('../../utility/pagination.utility'); 

class EpinWalletReport {
  db = {};

  constructor() {
    this.db = connect();
  }

  async epinWallet(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, page } = decryptedObject;

    const requiredKeys = Object.keys({ user_id, page });
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try { 

        const whereClause = {'user_id': user_id }
        const result = await paginate(this.db.viewEpinWallet, {
            whereClause,
            order: [['transaction_date', 'ASC']],
            page
        });

        if (result.totalPageCount > 0) {
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message:'Successfully all record found', data: result.data, totalPageCount: result.totalPageCount })));
            //return res.status(200).json({ status: 200, message:'Successfully all record found', data: result.data, totalPageCount: result.totalPageCount });
        }
    
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message:'Record not found', data:[] })));
        //return res.status(200).json({ status: 200, message:'Record not found', data:[] });
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
          //return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
        }
		
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message, data:[]})));	
        //return res.status(500).json({ status: 500,  message: error.message, data:[]});
    }
  }
  
  
  async epinWalletSummary(req, res) {

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

        const results=await this.db.viewEpinWallet.findAll({
            where: {
              transaction_date: {
                [Op.between]: [fromDate, toDate]
              }
            },
            order: [['id', 'DESC']],
          });
          
          
        const report={     

          totalOldBal:await this.db.viewEpinWallet.sum('opening_balance', {  where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          }}),
          totalNewBal:await this.db.viewEpinWallet.sum('closing_balance', {  where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          }}),
          totalCredit:await this.db.viewEpinWallet.sum('credit', {  where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          }}),
          totalDebit:await this.db.viewEpinWallet.sum('debit', {  where: {
            transaction_date: {
              [Op.between]: [fromDate, toDate]
            }
          }}),

       }

        if (results) {
            return res.status(200).json({ status: 200, message:'Successfully all record found', data: results, report });
        }
    
        return res.status(400).json({ status: 400, message:'Record not found', data:[] });
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message, data:[]});
    }
  }

 
}

module.exports = new EpinWalletReport();