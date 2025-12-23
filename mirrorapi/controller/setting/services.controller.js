const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 



class Services {
  db = {};

  constructor() {
    this.db = connect();
  }

  async get_user_service(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const {user_id, service} = decryptedObject;
    
    const requiredKeys = Object.keys({user_id, service});
        
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
         //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    const services = ['Recharge', 'Send Money', 'Bill Payment'];

    if(!services.includes(service))
    {
        //return res.status(400).json({ status: 400, message: 'Please provide correct service', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Please provide correct service', columns: requiredKeys })));
    }
    

    try {

        const checkplan  = await this.db.PlanPurchase.getAllPlanUser(user_id);
        let maxPlan = null;
        if(checkplan.length > 0)
        {
          maxPlan = Math.max(...checkplan);
        }
        
        let user_type = (maxPlan !=null) ? 'Prime' : 'Nonprime';

        let date = new Date();
        let crdate = utility.formatDate(date);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDay = utility.formatDate(firstDay);
        lastDay = utility.formatDate(lastDay);
        

        if(service==='Recharge')
        {
            let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(user_id, crdate);  
            let totalRechargeOfaMonth = await this.db.recharge.getRechargeForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && totalRechargeOfaMonth >= 1){
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Sorry ! You have not take prime thus you will make recharge one time in a month.', count: totalRechargeOfaMonth, service_used:1 })));
                //return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make recharge one time in a month.', count: totalRechargeOfaMonth, service_used:1 });
            }
        }

        if(service==='Send Money')
        { 
            let getTransferForMonth = await this.db.wallet_transfer.getTransferForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && getTransferForMonth >= 1){
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Sorry ! You have not take prime thus you will make send money one time in a month.', count: getTransferForMonth, service_used:1 })));
                //return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make send money one time in a month.', count: getTransferForMonth, service_used:1 });
            }
        }
        
        if(service==='Bill Payment')
        { 
            let getTransactionForMonth = await this.db.bbpsBillPayment.getTransactionForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && getTransactionForMonth >= 1){
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 201, error: 'Sorry ! You have not take prime thus you will make Billpayment one time in a month.', count: getTransactionForMonth, service_used:1 })));
                //return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make Billpayment one time in a month.', count: getTransactionForMonth, service_used:1 });
            }
        }

        // return res.status(200).json({ status: 200, message: 'Your are eligible', service_used:0 });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Your are eligible', service_used:0 })));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
        }
			
        //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));
    }
  }
  
  
  
  async get_user_service_test(req, res) {
    
    const {user_id, service} = req;
    
    const requiredKeys = Object.keys({user_id, service});
        
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
         return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        
    }

    const services = ['Recharge', 'Send Money', 'Bill Payment'];

    if(!services.includes(service))
    {
        return res.status(400).json({ status: 400, message: 'Please provide correct service', columns: requiredKeys });
        
    }
    

    try {

        const checkplan  = await this.db.PlanPurchase.getAllPlanUser(user_id);
        let maxPlan = null;
        if(checkplan.length > 0)
        {
          maxPlan = Math.max(...checkplan);
        }
        
        let user_type = (maxPlan !=null) ? 'Prime' : 'Nonprime';

        let date = new Date();
        let crdate = utility.formatDate(date);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDay = utility.formatDate(firstDay);
        lastDay = utility.formatDate(lastDay);
        

        if(service==='Recharge')
        {
            let totalDayRecharge = await this.db.recharge.getRechargeDataForDay(user_id, crdate);  
            let totalRechargeOfaMonth = await this.db.recharge.getRechargeForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && totalRechargeOfaMonth >= 1){
                
                return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make recharge one time in a month.', count: totalRechargeOfaMonth, service_used:1 });
            }
        }

        if(service==='Send Money')
        { 
            let getTransferForMonth = await this.db.wallet_transfer.getTransferForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && getTransferForMonth >= 1){
                
                return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make send money one time in a month.', count: getTransferForMonth, service_used:1 });
            }
        }
        
        if(service==='Bill Payment')
        { 
            let getTransactionForMonth = await this.db.bbpsBillPayment.getTransactionForMonth(user_id, firstDay, lastDay);

            if(user_type != 'Prime' && getTransactionForMonth >= 1){
                
                return res.status(201).json({ status: 201, error: 'Sorry ! You have not take prime thus you will make Billpayment one time in a month.', count: getTransactionForMonth, service_used:1 });
            }
        }

        return res.status(200).json({ status: 200, message: 'Your are eligible', service_used:0 });
        
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
          
        }
			
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        
    }
  }


}

module.exports = new Services();