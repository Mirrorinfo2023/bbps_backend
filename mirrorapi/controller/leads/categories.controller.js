const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);


class ServicesOperator {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	
    async addCategory(filename, req, res) {
      let t;
      
      const { category_name, description, category_image, category_id, discount_upto,formFields } = req;
    
      try {
        const filePath = filename;
        t = await this.db.sequelize.transaction();
        const path ='/uploads/leads_category/';
        const existingCategory = await this.db.leadsCategory.getDataWithClause(category_name);
        if (existingCategory.length == 0) {
          const categoryData = {
            category_name,
            description,
            category_image: path+filePath,
            parent_id: category_id?category_id:0,
            discount_upto: discount_upto,
            input_params: formFields?JSON.stringify(formFields):''
          };
    
          const newCategory = await this.db.leadsCategory.insertData(categoryData, {
            validate: true,
            transaction: t,
            logging: sql => logger.info(sql),
          });
    
          await t.commit();
    
          return res.status(201).json({ status: 201, message: 'Category added successfully', data: newCategory });
        } else {
          await t.rollback();
          return res.status(500).json({ status: 500, error: 'Already Exist' });
        }
      } catch (error) {
        if (t) {
          await t.rollback();
        }
    
        logger.error(`Error in addCategory: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500, errors: validationErrors });
        }
    
        return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
      }
    
      return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
    } 
   
	
    async getCategory(req,res) {

      try {
        // return utility.DataEncrypt(JSON.stringify({
        //     "category_name1": "Courses"
        // }));
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, category_name, parent } = decryptedObject;
        
        const requiredKeys = Object.keys({ category_name });
        let getCategory = [];
    
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            getCategory = await this.db.leadsCategory.getAllData(parent);
        }else{
            getCategory = await this.db.leadsCategory.getDataWithClause(category_name);
        }
        let getCategoryWithPath = [];
        let totalPendingAmount = 0;
        let TotalPendingIncome = 0;
        let total_earning = 0;
        let total_paid_amount = 0;
        
        if(getCategory)
        {
            for (const category of getCategory) {
                let checkparent = [];
                if(category.parent_id > 0)
                {
                  checkparent = await this.db.leadsCategory.getParentCategory(category.parent_id);
                }
                getCategoryWithPath.push({
                id: category.id,
                category_name: category.category_name,
                category_image: baseurl+category.category_image,
                description: category.description,
                discount_upto: category.discount_upto,
                status: category.status,
                input_params: category.input_params,
                parent_category:  checkparent? checkparent.category_name:'',
                child_category: await this.getChild(category.id)
              });
            }
        }
        
        if(user_id!=null)
        {
          const whereCondition1 = {
          user_id,
          sub_type:'Leads Income'
            }
            total_paid_amount = await this.db.ReferralIncome.getEarningAmount(whereCondition1);

            const whereCondition2 = {
              user_id,
              sub_type:'Leads Income'
            }
            totalPendingAmount = await this.db.holdIncome.getEarningAmount(whereCondition2);
             TotalPendingIncome=totalPendingAmount? totalPendingAmount:0;
    
            total_earning = total_paid_amount + TotalPendingIncome ;
        }
        
        const report={
          total_count : await this.db.leadsCategory.count( 'category_name'  ),
          total_active : await this.db.leadsCategory.count(  {  where:{ status:`1` } }  ),
          total_inactive : await this.db.leadsCategory.count( {  where:{ status:`0` } }),
         
        }
        
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getCategoryWithPath ,total_amount:total_paid_amount,totalPendingAmount:TotalPendingIncome,total_earning:total_earning, report })));
        //return res.status(200).json({ status: 200, message: 'success', data: getCategoryWithPath });
      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500,errors: validationErrors });
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
        //return res.status(500).json({ status: 500, message: err.message,data: []  });
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
      }


    }
    
    async getChildCategory(req, res)
    {
        try {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { category_id } = decryptedObject;
            
            const requiredKeys = Object.keys({ category_id });
        
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }

            const getCategoryWithPath = await this.getChild(category_id)
            //return res.status(200).json({ status: 200, message: 'success', data: getCategoryWithPath });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getCategoryWithPath })));
        } catch (err) {
            logger.error(`Unable to find : ${err}`);
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
          }
    }

    async getChild(parent_category) 
    {
        const getCategory = await this.db.leadsCategory.getChildCategory(parent_category);
        let getCategoryWithPath = [];
        if(getCategory)
        {
            getCategoryWithPath = getCategory.map((category) => ({
                id: category.id,
                category_name: category.category_name,
                category_image: baseurl+category.category_image,
                description: category.description,
                discount_upto: category.discount_upto,
                status: category.status,
                input_params: category.input_params
              }));
        }
        return await getCategoryWithPath;
    }
    
    
    async getLeadCategory(req,res) 
    {

   
       //const decryptedObject = utility.DataDecrypt(req.encReq);
        const { category_id } = req;

        const requiredKeys = Object.keys({ category_id });
    
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

      try {
              const whereChk={ id: category_id };
              const UserAttribute=['id','category_name', 'discount_upto','status','category_image','description', 'input_params'];
              const  category = await this.db.leadsCategory.getData(UserAttribute,whereChk );

              let getCategory = [];
              if(category)
              {
                getCategory = {
                    id: category.id,
                    category_name: category.category_name,
                    category_image: baseurl+category.category_image,
                    description: category.description,
                    discount_upto: category.discount_upto,
                    status: category.status,
                    input_params: category.input_params?JSON.parse(category.input_params):[]
                  }
              }
          
              return res.status(200).json({ status: 200, message: 'success', data: getCategory });
        //   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getCategoryWithPath })));

          } catch (err) {
            logger.error(`Unable to find : ${err}`);
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            //   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            }
            return res.status(500).json({ status: 500, message: err.message,data: []  });
            // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
          }


    }
      
      
        
      async updateStatusCategory(req, res) {
            const {id,action,status} = req;
    
            
            const requiredKeys = Object.keys({ id,action,status});
                  
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
    
            let t;
    
            try {
                
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                
                const data=  {
                   
                  status,
                  modified_on:created_on
                };

            
                const updatedUserStatus = await this.db.leadsCategory.updateData(data,id);
                        
                      if (updatedUserStatus > 0) {
                        return res.status(200).json({ status: 200, message: 'User Status Updated Successful.'});
                      } else {
                        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                      }
                    
                } catch (error) {
                    logger.error(`Unable to find Kyc: ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                      const validationErrors = error.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: validationErrors });
                    }
                  
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
              }


    async updateLeadCategory(fileName, req, res) {
      const {id, category_name, discount_upto, description, status, formFields} = req;

      
      // const requiredKeys = Object.keys({ id,category_name,discount_upto });
            
      // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      // }

        
      let t;

      try {
          
        let filePath = '';
        let path = '';
       
        const currentDate = new Date();
        const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
          
        const data=  {
          
          category_name,
          discount_upto,
          description,
          status,
          modified_on:created_on,
          input_params: JSON.stringify(formFields)
        };
        
        if(fileName)
        {
            filePath = fileName;
            path ='/uploads/leads_category/';
            data.category_image= path+filePath;
        }

          
        const updatedUserStatus = await this.db.leadsCategory.updateData(data,id);
                      
        if (updatedUserStatus > 0) {
          return res.status(200).json({ status: 200, message: 'User Status Updated Successful.'});
        } else {
          return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
        }
                  
      } catch (error) {
          logger.error(`Unable to find Lead Category: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
        

	

}





module.exports = new ServicesOperator();