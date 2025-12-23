const { connect,config } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const env = config.env;


class Setting {
  db = {};

  constructor() {
    this.db = connect();
  }

  async SystemSetting(req, res) {

    const { setting_id, recharge_limit, recharge_panel_cron, bbps_cutoff_limit } = req;

    try {
        const date = new Date();
        let updateFlag = 0;
        const attributes = [
            'id',
            'recharge_cutoff_limit',
            'bbps_cutoff_limit',
            'recharge_panel_cron',
            [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
            [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on'],
            'last_modified'
        ]
        
        if(setting_id != null && setting_id > 0)
        {
            const panelUpdate = await this.db.setting.update(
                {recharge_cutoff_limit:recharge_limit, bbps_cutoff_limit: bbps_cutoff_limit, recharge_panel_cron:recharge_panel_cron,modified_on:date.getTime() },
                { where: { id:setting_id, status:1 }}
            );
            
            if(panelUpdate)
            {
                updateFlag = 1;
            }

            if(updateFlag == 0)
            {
                return res.status(500).json({ status: 200, message: 'Something went wrong', data: [] });
            }
        }

        
        
        const getData = await this.db.setting.getData(attributes);

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
  
  
   async getWhatsapp(req, res) {

    const {whatsapp_id ,instance_id,access_token } = req;

    try {
        const date = new Date();
        let updateFlag = 0;
        const attributes = [
            'id',
            'instance_id',
            'access_token',
            [Sequelize.fn('date_format', Sequelize.col('updated_on'), '%d-%m-%Y %H:%i:%s'), 'updated_on'],
            [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
        ]
        
        if(whatsapp_id != null && whatsapp_id > 0)
        {
            const panelUpdate = await this.db.whatsapp_setting.update(
                {instance_id:instance_id,access_token:access_token, updated_on:date.getTime() },
                { where: { id:whatsapp_id, status:1 }}
            );
            
            if(panelUpdate)
            {
                updateFlag = 1;
            }

            if(updateFlag == 0)
            {
                return res.status(500).json({ status: 200, message: 'Something went wrong', data: [] });
            }
        }

        
        
        const getData = await this.db.whatsapp_setting.getData(attributes);

        return res.status(200).json({ status: 200, message: '', data: getData });

    } catch (error) {
        // logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
        }
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }


  async getwhatsappDetails(req, res) {
    const { whatsapp_id } = req;
    const requiredKeys = Object.keys({ whatsapp_id}); 
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    try {
        const whereCondition ={id:whatsapp_id};
        const checkdata = await this.db.whatsapp_setting.getDataRow(whereCondition);
        
        return res.status(200).json({ status: 200, message: '', data: checkdata });
    } catch (error) {
        
        if (error.name === 'SequelizeValidationError') {
          // const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
        }
        return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }

}

module.exports = new Setting();