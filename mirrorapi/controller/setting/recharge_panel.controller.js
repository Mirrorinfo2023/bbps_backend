const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const env = config.env;
class RechargePanel {
  db = {};

  constructor() {
    this.db = connect();
  }

  async rechargePanel(req, res) {
    const { panel_id, status, priority,is_cashback } = req;

    try {
        const date = new Date();
        let updateFlag = 0;
        if(panel_id != null && panel_id > 0){
          const checkdata = await this.db.panel.findByPk(panel_id);
          
          if(checkdata){
            const panelUpdate = await this.db.panel.update(
              {status:status, priority:priority,is_cashback: is_cashback, modified_on:date.getTime() },
              { where: { id:panel_id} }
            );
            
            if(panelUpdate)
            {
                updateFlag = 1;
            }
          }
          if(updateFlag == 0)
          {
              return res.status(500).json({ status: 200, message: 'Something went wrong', data: [] });
          }
        }

        
        
        const getData = await this.db.panel.getDataAll();
        return res.status(200).json({ status: 200, message: '', data: getData });
    } catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }


  async getPanel(req, res) {
    const { panel_id } = req;
    
    const requiredKeys = Object.keys({ panel_id});
            
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    try {
        
        const checkdata = await this.db.panel.getData(panel_id);
        
        return res.status(200).json({ status: 200, message: '', data: checkdata });
    } catch (error) {
        await t.rollback();
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }

}

module.exports = new RechargePanel();