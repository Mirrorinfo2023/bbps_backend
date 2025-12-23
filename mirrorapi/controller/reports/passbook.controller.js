const { connect,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class Passbook {
  db = {};

  constructor() {
    this.db = connect();
  }

  async passbook(req, res) {

    try {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id,page,filter } = decryptedObject;
	
		const requiredKeys = Object.keys({ user_id });
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) 
            
        ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
        
        const whereClause = {'user_id': user_id, 'env':config.env }
        if (filter) {
          whereClause.tran_for = filter;
        
          if (filter === 'Mobile') {
            whereClause.tran_for = 'Recharge';
            whereClause.recharge_type = ['Prepaid', 'Postpaid'];
          } else if (filter === 'DTH') {
            whereClause.tran_for = 'Recharge';
            whereClause.recharge_type = 'DTH';
          }
        }
        
        const attributes = ['id',
          'user_id',
          'transaction_id',
          'env',
          'type',
          'sub_type',
          'opening_balance',
          'credit',
          'debit',
          'closing_balance',
            'tran_for',
            'status', 
            'transaction_date',
            'created_on',
            'created_by',
            'modified_on',
            'modified_by',
            'deleted_on',
            'mlm_id',
            'first_name',
            'last_name',
            'mobile',
            'email',
            'consumer_number',
            'main_amount',
            'recharge_amount',
            'recharge_type',
            'service_rate',
            'service_amount',
            'cashback_amount',
            'cashback_rate',
            'trax_id',
            'message',
            'operator',
            'operator_image',
            'panel',
            'category',
            'plan_name',
            'plan_amount',
            'prime_rate',
            'from_user_fname',
            'from_user_lname',
            'from_user_mlm_id',
            'from_user_mobile',
            'to_user_fname',
            'to_user_lname',
            'to_user_mlm_id',
            'to_user_mobile',
            'reference_no',
            'recharge_status'
          ];

        const result = await paginate(this.db.viewpassbook, {
          attributes: [...attributes, 
            [Sequelize.fn('date_format', Sequelize.col('transaction_date'), '%d-%m-%Y %H:%i:%s'), 'created_on'] 
          ],
          whereClause,
          order: [['id', 'DESC']],
          page
        });

      
        
      
        if (result.totalPageCount > 0) {
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount })));
        } else {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Data Not Found', data: [] })));
        }
        
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  
  async cashbackPassbook(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, page } = decryptedObject;

    const requiredKeys = Object.keys({ user_id });
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));	
    }

    try {
        
      const userId = user_id;
      const whereClause = {'user_id': user_id, 'env':config.env }
      const attributes = ['transaction_id',
      'env',
      'type',
      'sub_type',
      'opening_balance',
      'credit',
      'debit',
      'closing_balance',
      'tran_for',
      'status',
      'reference_no',
      'main_amount',
      'cashback_point',
      'bonus_point'
      ];
      
     const result = await paginate(this.db.viewCashback, {
        attributes: [...attributes, 
          [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'] 
        ],
        whereClause,
        page,
        order: [['id', 'DESC']],
      });

    
      if (result.totalPageCount > 0) {
          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount })));
      } else {
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Data Not Found', data: [] })));
      }

    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  
  async primePassbook(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, page } = decryptedObject;


    const requiredKeys = Object.keys({ user_id });
            
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {
        
      const whereClause = {'user_id': user_id, 'env':config.env }
      const attributes = ['transaction_id',
      'env',
      'type',
      'sub_type',
      'opening_balance',
      'credit',
      'debit',
      'closing_balance',
      'tran_for',
      'status',
      'reference_no',
      'main_amount'
      ];

      const result = await paginate(this.db.viewPrimeWallet, {
        attributes: [...attributes, 
          [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'] 
        ],
        whereClause,
        page,
        order: [['id', 'DESC']],
      });

     
      
    
      if (result.totalPageCount > 0) {
          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount })));
      } else {
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Data Not Found', data: [] })));
      }
    } catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));	
    }
  }
  
  
          
          
          async  incomePassbook(req, res) {

            const decryptedObject = utility.DataDecrypt(req.encReq); 

			
            const { user_id ,startdate , enddate, page, filter} =utility.DataDecrypt(req.encReq);
		

            
            const requiredKeys = Object.keys({ user_id, page });
                
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }

        
            try {


              let whereDate ;
        
              if(startdate && enddate){
                  const fromDate = new Date(startdate);
                  // fromDate.setHours(0, 0, 0);
                  const toDate = new Date(enddate);
                 // toDate.setHours(23, 59, 59);
                 
                  whereDate = {
        
                              'created_on': {
                                [Op.between]: [fromDate, toDate]
                              },
                 }
                }

  				/*sub_type: {
                    [Op.not]: 'Cycle Income'
                  },*/
        
                const whereClause = {
                  user_id: user_id,
                
                  ...whereDate
                };

             if (Array.isArray(filter) && filter.length > 0) {
                const filterConditions = [];

                if (filter.includes('Daily Bonus Income')) {
                    filterConditions.push({ sub_type: 'Daily Bonus Income' });
                }

                if (filter.includes('Daily Repurchase Bonus')) {
                    filterConditions.push({ sub_type: 'Daily Repurchase Bonus' });
                }

                if (filter.includes('Bonus')) {
                    filterConditions.push({ sub_type: 'Bonus' }); // exact match
                }

                if (filterConditions.length > 0) {
                    whereClause[Op.and] = whereClause[Op.and] || [];
                    whereClause[Op.and].push({ [Op.or]: filterConditions });
                }
            }


        
               /* if (Array.isArray(filter) && !filter.includes('All'))  {
                    
                    const planNames = [];
                   const tranForValues = filter;
                   
                  

                  if (filter.includes('Daily Bonus Income')) {
                    planNames.push('Daily Bonus Income');
                  }

                  if (filter.includes('Prime B')) {
                    planNames.push('Prime B');
                  }

                  if (filter.includes('Booster')) {
                    planNames.push('Booster Prime');
                  }

                  if (filter.includes('Hybrid')) {
                    planNames.push('Hybrid Prime');
                  }

                  if (planNames.length > 0) {
                    whereClause.plan_name = { [Op.in]: planNames };
                  }

                  if (filter.includes('Prime A') || filter.includes('Prime B') || filter.includes('Booster') || filter.includes('Hybrid') || filter.includes('Self Income') || filter.includes('Level Income')) {
                    tranForValues.push('Income');
                  }
                  
                  if(filter.includes('Repurchase'))
                  {
                      tranForValues.push('Repurchase');
                      planNames.push('Repurchase');
                  }

                  if (filter.includes('Royality')) {
                    tranForValues.push('Royality');
                    whereClause.details = { [Op.like]: '%Royality%' };
                  }

				 if (filter.includes('Daily Bonus Income')) {
                    tranForValues.push('Daily Bonus Income');
                    whereClause.sub_type = { [Op.like]: '%Daily Bonus Income%' };
                  }

				if (filter.includes('Daily Repurchase Bonus')) {
                    tranForValues.push('Daily Repurchase Bonus');
                    whereClause.sub_type = { [Op.like]: '%Daily Repurchase Bonus%' };
                  }

				if (filter.includes('Bonus')) {
                    tranForValues.push('Bonus');
                    whereClause.sub_type = { [Op.like]: '%Bonus%' };
                  }
                  

                  if (tranForValues.length > 0) {
                    whereClause.tran_for = { [Op.in]: tranForValues };
                  }

                  if (filter.includes('Self Income')) {
                    whereClause.level = 1;
                  }

                  if (filter.includes('Level Income')) {
                    if (whereClause.level === 1) {
                      whereClause.level = { [Op.gte]: 1 };
                    } else {
                      whereClause.level = { [Op.gte]: 2 };
                    }
                  }
                  
                //   whereClause.tran_for = filter;
                
                //   if (filter === 'Prime A') {
                //       whereClause.tran_for = 'Income';
                //     whereClause.plan_name = 'Prime';
                //   } else if (filter === 'Prime B') {
                //       whereClause.tran_for = 'Income';
                //     whereClause.plan_name = 'Prime B';
                //   }else if (filter === 'Booster') {
                //       whereClause.tran_for = 'Income';
                //     whereClause.plan_name = 'Booster Prime';
                //   }else if (filter === 'Hybrid') {
                //       whereClause.tran_for = 'Income';
                //     whereClause.plan_name = 'Hybrid Prime';
                //   }
                  
                //   const validFilters = [
                //       'Silver Royality',
                //       'Gold Royality',
                //       'Diamond Royality',
                //       'Double Diamond Royality',
                //       'Platinum Royality',
                //       'Ambassador Royality'
                //     ];
                
                //     if (validFilters.includes(filter)) {
                //         whereClause.tran_for = 'Royality';
                //         whereClause.details = { [Op.like]: `%${filter}%` };
                //     }
                    
                //     if (filter === 'Self Income') {
                //         whereClause.tran_for = 'Income';
                //         whereClause.level = 1;
                //     }
                    
                //     if (filter === 'Level Income') {
                //         whereClause.tran_for = 'Income';
                //         whereClause.level = { [Op.gte]: 2 };
                //     }
                  
                }
				*/
                            
                const attributes = [
                'transaction_id',
                'env',
                'type',
                'sub_type',
                'opening_balance',
                'credit',
                'debit',
                'closing_balance',
                'tran_for',
                'income_date',
                'status',
                'details',
                'plan_name',
                'sender_mobile',
                'sender_mlm_id'
              ];
          
        
             
                const result = await paginate(this.db.incomeReport, {
                  attributes: [...attributes 
                  ],
                  whereClause,
                  page,
                  order: [['id', 'DESC']],
                 
                });
                
                const getAmount = await this.db.incomeReport.getAmount(whereClause);
                const get_repurchase = await this.db.incomeReport.getTotalRepurchaseIncome(user_id);
               
                
              
                if (result.totalPageCount > 0) {

 return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount, totalAmount:getAmount, totalRepurchase: get_repurchase })));

                   


                } else {
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Not Found', data: [] })));
                  //return res.status(200).json({ status: 200, message: 'Data Not Found', data: [] });
                }
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                  //return res.status(500).json({ status: 500,errors: validationErrors });
                }
        			
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
                //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
            }
          }
          
          
          async  holdIncomePassbook(req, res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { user_id ,startdate , enddate, page, filter} = decryptedObject;
            
            const requiredKeys = Object.keys({ user_id, page });
                
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
        
            try {
              let whereDate ;
        
              if(startdate && enddate){
                  const fromDate = new Date(startdate);
                   fromDate.setHours(0, 0, 0);
                  const toDate = new Date(enddate);
                  toDate.setHours(23, 59, 59);
                 
                  whereDate = {
        
                      'created_on': {
                        [Op.between]: [fromDate, toDate]
                      },
                 }
                }
        
                const whereClause = {
                  user_id: user_id,
                  ...whereDate
                };
        
                            
                const attributes = [
                    'transaction_id',
                    'env',
                    'type',
                    'sub_type',
                    'amount',
                    'tran_for',
                    'income_date',
                    'status',
                    'details',
                    'shopping_order_id',
                    'sender_id',
                    'name',
                    'level'
                ];
          
        
             
                const result = await paginate(this.db.viewHoldIncome, {
                  attributes: [...attributes 
                  ],
                  whereClause,
                  page,
                  order: [['created_on', 'DESC']],
                 
                });
                
                const getAmount = await this.db.viewHoldIncome.getAmount(whereClause);
               
                
              
                if (result.totalPageCount > 0) {
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount, totalAmount:getAmount })));
                    // return res.status(200).json({ status: 200, message: 'Data Found', data: result.data, totalPageCount: result.totalPageCount, totalAmount:getAmount });
                } else {
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Not Found', data: [] })));
                //   return res.status(200).json({ status: 200, message: 'Data Not Found', data: [] });
                }
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                //   return res.status(500).json({ status: 500,errors: validationErrors });
                }
        			
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
                // return res.status(500).json({ status: 500,  message: error.message ,data:[]});
            }
          }
  
}

module.exports = new Passbook();