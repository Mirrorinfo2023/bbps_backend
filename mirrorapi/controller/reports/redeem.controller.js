const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility');

class RedeemReport {
  db = {};

  constructor() {
    this.db = connect();
  }

        
         async  GetRedeem(req, res) {
        
                let { from_date, to_date} = req;
              
                try {

          		  const today = new Date();
                  if (!from_date) {
                    const startOfToday = new Date(today);
                    startOfToday.setHours(0, 0, 0, 0);
                    from_date = startOfToday;
                  } else {
                    from_date = new Date(from_date);
                  }

                  if (!to_date) {
                    const endOfToday = new Date(today);
                    endOfToday.setHours(23, 59, 59, 999);
                    to_date = endOfToday;
                  } else {
                    to_date = new Date(to_date);
                    to_date.setHours(23, 59, 59, 999); // Ensure full end of day
                  }
        
                  let whereCondition ;
        
                  const startDate =new Date(from_date);
                  const endDate =new Date(to_date);
                  endDate.setHours(23, 59, 59);
        
                  whereCondition = {
                      'created_on': {
                        [Op.between]: [startDate, endDate]
                      },
                  }
        
                const results = await this.db.Redeem.getAllData(whereCondition);
                const Result = [];
        
                for (const item of results) {
        
                  const userdata = await this.db.user.getDataExistingUser(['first_name', 'last_name', 'mlm_id', 'mobile'], { id: item.user_id });
                  const kyc_details = await this.db.kyc.getKycData({ user_id: item.user_id, status:1 });
                 

 					/* pan_number: kyc_details.pan_number,
                    aadhar_number: kyc_details.aadhar_number,
                    account_number: kyc_details.account_number,
                    account_holder: kyc_details.account_number,
                    bank_name: kyc_details.bank_name,
                    ifsc_code: kyc_details.ifsc_code,
                    rejection_reason: item.approval_remarks,*/

                  Result.push({
                    first_name: userdata ? userdata.first_name :'',
                    last_name :userdata ? userdata.last_name :'',
                    mlm_id: userdata ? userdata.mlm_id : '',
                    mobile: userdata ? userdata.mobile : '',
					pan_number: '',
                    aadhar_number:'',
                    account_number: '',
                    account_holder: '',
                    bank_name: '',
                    ifsc_code: '',
                    rejection_reason: '',
                  
                    ...item.dataValues,
                  });
                }
        
                const report={
                  total_redeemcount : await this.db.Redeem.count({ where:{...whereCondition}},'user_id' ),
                  total_approveCount : await this.db.Redeem.count({  where:{...whereCondition, status:`1` } }),
                  total_rejectedCount : await this.db.Redeem.count({  where:{...whereCondition, status:`2` } }),
                  total_pendingCount : await this.db.Redeem.count({  where:{ ...whereCondition, status:`0` } }),
                 
				}
               
                return { status: 200,message:'Data Found', data: Result, report };
        
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return { status: 500,errors: validationErrors };
                }
        			
                return { status: 500,  message: error.message ,data:[]};
            }
          }


        async  GetRedeemHistroy(req, res) {
                //const decryptedObject = utility.DataDecrypt(req.encReq);
                const { user_id } = req;
//decryptedObject;
				
            
              try {
    
                  let whereCondition ;
                  whereCondition = {
                      'user_id':user_id
                      // 'created_on': {
                      //   [Op.between]: [startDate, endDate]
                      // },
                  }
    
                const results = await this.db.Redeem.getRedeemData(whereCondition);
                if(results){
                 // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message:'Data Found', data: results })));
                   return res.status(200).json({ status: 200,message:'Data Found', data: results });
                }else{
                  //  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message:'Data Not Found', data: [] })));
                  return res.status(200).json({ status: 200,message:'Data Not Found', data: [] });
                }
                
    
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                //   return res.status(500).json({ status: 500,errors: validationErrors });
                }
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
                // return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
        }

  
 
}

module.exports = new RedeemReport();