const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const utility = require('../../utility/utility'); 
//const helper = require('../utility/helper'); 
const pino = require('pino');
const { paginate } = require('../../utility/pagination.utility'); 
const logger = pino({ level: 'info' }, process.stdout);


require('dotenv').config();
// const baseUrl = process.env.API_BASE_URL;
// const baseUrl ='https://apis.mayway.in/';


class ServicesOperator {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	
    async addOperator(filename, req, res) {
        
      let t;
      
      const { operator_name, description, image } = req;
    
      // const requiredKeys = Object.keys({ operator_name, description });
    
      // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      // }
    
      try {
        const filePath = filename;
        t = await this.db.sequelize.transaction();
    
        const existingOperator = await this.db.serviceOperator.findOne({ where: { operator_name: operator_name, status: 1 } });
    
        if (!existingOperator) {
          const operatorData = {
            operator_name,
            description,
            image:filePath,
            status: 1
          };
    
          const newOperator = await this.db.serviceOperator.insertData(operatorData, {
            validate: true,
            transaction: t,
            logging: sql => logger.info(sql),
          });
    
          await t.commit();
    
          return res.status(201).json({ status: 201, message: 'Operator added successfully', data: newOperator });
        } else {
          await t.rollback();
          return res.status(500).json({ status: 500, error: 'Already Exist' });
        }
      } catch (error) {
        if (t) {
          await t.rollback();
        }
    
        logger.error(`Error in addOperator: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500, errors: validationErrors });
        }
    
        return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
      }
    
      return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
    }  
   
	
     async getOperator(req, res) {

    try {
      const decryptedObject = utility.DataDecrypt(req.encReq);
      const { category, page } = decryptedObject;

      const requiredKeys = Object.keys({ category });
      let getOperator = [];
      const pagecount = (page) ? page : 1;
      let orderExtension = '';
      let getBillPayment = [];

      if (requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        getOperator = await this.db.serviceOperator.getAllData();
      } else {
        let whereClause = { 'status': 1, 'category': category };
        let orderClause = [
          ...(orderExtension ? [orderExtension] : []),
        ];
        getOperator = await paginate(this.db.serviceOperator, {
          order: orderClause,
          whereClause,
          page: pagecount,
          pageSize: 100
        });
        getOperator = getOperator.data;
      }



      let getOperatorWithPath = getOperator.map((operator) => ({
        id: operator.id,
        operator_name: operator.operator_name,
        image: baseurl + operator.image,
        category: operator.category,
        description: operator.description,
        status: operator.status,
        biller_id: operator.biller_id,
      }));


      const circle = ['Andhra Pradesh Telangana', 'Assam', 'Bihar Jharkhand', 'Chennai', 'Delhi NCR', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu Kashmir', 'Karnataka', 'Kerala', 'Kolkata', 'Madhya Pradesh Chhattisgarh', 'Maharashtra Goa', 'Mumbai', 'North East', 'Orissa', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'UP East', 'UP West', 'West Bengal'];

      const circle2 = [
        {
          "circleId": 1,
          "circleName": "Andhra Pradesh Telangana"
        },
        {
          "circleId": 2,
          "circleName": "Assam"
        },
        {
          "circleId": 3,
          "circleName": "Bihar Jharkhand"
        },
        {
          "circleId": 4,
          "circleName": "Chennai"
        },
        {
          "circleId": 5,
          "circleName": "Delhi NCR"
        },
        {
          "circleId": 6,
          "circleName": "Gujarat"
        },
        {
          "circleId": 7,
          "circleName": "Haryana"
        },
        {
          "circleId": 8,
          "circleName": "Himachal Pradesh"
        },
        {
          "circleId": 9,
          "circleName": "Jammu Kashmir"
        },
        {
          "circleId": 10,
          "circleName": "Karnataka"
        },
        {
          "circleId": 11,
          "circleName": "Kerala"
        },
        {
          "circleId": 12,
          "circleName": "Kolkata"
        },
        {
          "circleId": 13,
          "circleName": "Madhya Pradesh Chhattisgarh"
        },
        {
          "circleId": 14,
          "circleName": "Maharashtra Goa"
        },
        {
          "circleId": 15,
          "circleName": "Mumbai"
        },
        {
          "circleId": 16,
          "circleName": "North East"
        },
        {
          "circleId": 17,
          "circleName": "Orissa"
        },
        {
          "circleId": 18,
          "circleName": "Punjab"
        },
        {
          "circleId": 19,
          "circleName": "Rajasthan"
        },
        {
          "circleId": 20,
          "circleName": "Tamil Nadu"
        },
        {
          "circleId": 21,
          "circleName": "UP East"
        },
        {
          "circleId": 22,
          "circleName": "UP West"
        },
        {
          "circleId": 23,
          "circleName": "West Bengal"
        }
      ]


      const rechargeType = [
        {
          "rechargeTypeId": 1,
          "rechargeType": "Top-up"
        },
        {
          "rechargeTypeId": 3,
          "rechargeType": "Full Talktime"
        },
        {
          "rechargeTypeId": 4,
          "rechargeType": "SMS"
        },
        {
          "rechargeTypeId": 5,
          "rechargeType": "2G Data"
        },
        {
          "rechargeTypeId": 6,
          "rechargeType": "3G Data"
        },
        {
          "rechargeTypeId": 8,
          "rechargeType": "4G Data"
        },
        {
          "rechargeTypeId": 9,
          "rechargeType": "Local"
        },
        {
          "rechargeTypeId": 10,
          "rechargeType": "STD"
        },
        {
          "rechargeTypeId": 11,
          "rechargeType": "ISD"
        },
        {
          "rechargeTypeId": 13,
          "rechargeType": "Roaming"
        },
        {
          "rechargeTypeId": 14,
          "rechargeType": "Other"
        },
        {
          "rechargeTypeId": 16,
          "rechargeType": "Validity"
        },
        {
          "rechargeTypeId": 17,
          "rechargeType": "Plan"
        },
        {
          "rechargeTypeId": 18,
          "rechargeType": "FRC"
        }
      ]
      //   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getOperatorWithPath, circle: circle, recent_bill_data:getBillPayment, rechargeType: rechargeType, circle2: circle2 })));

      return res.status(200).json({ status: 200, message: 'success', data: getOperatorWithPath, circle: circle, recent_bill_data: getBillPayment, rechargeType: rechargeType, circle2: circle2 });

    } catch (err) {
      logger.error(`Unable to find : ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message, data: [] })));
    }


  }
    
    
    async getOperatorTest(req,res) {

      try {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { category } = decryptedObject;
        
        return decryptedObject;

        const requiredKeys = Object.keys({ category });
        let getOperator = [];
    
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
          getOperator = await this.db.serviceOperator.getAllData();
        }else{
          getOperator = await this.db.serviceOperator.getDataWithClause(category);
        }
        
        
        
        
        let getOperatorWithPath = getOperator.map(operator => {
            return {
              id: operator.id,
              operator_name: operator.operator_name,
              image: baseurl+operator.image,
              category: operator.category,
              description: operator.description,
              status: operator.status,
            };
        });
        
        const circle = ['Andhra Pradesh Telangana','Assam','Bihar Jharkhand','Chennai','Delhi NCR','Gujarat','Haryana','Himachal Pradesh','Jammu Kashmir','Karnataka','Kerala','Kolkata','Madhya Pradesh Chhattisgarh','Maharashtra Goa','Mumbai','North East','Orissa','Punjab','Rajasthan','Tamil Nadu','UP East','UP West','West Bengal'];
        return res.status(200).json({ status: 200, message: 'success', data: getOperatorWithPath, circle: circle });
        //return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getOperatorWithPath, circle: circle })));

      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
          return res.status(500).json({ status: 500,errors: validationErrors });
        }
        //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
        return res.status(500).json({ status: 500, message: err.message,data: []  });
      }


    }
    
    
    async getMobileOperator(req,res) {

      try {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { mobile } = decryptedObject;
    
        const requiredKeys = Object.keys({ mobile });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
             return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
           }
    
        const mOperator = await this.db.mobileOperator.findOne({
          where: {status:1, mobile_no:mobile},
        });
        
        let getOperatorWithPath = [];

        if(mOperator)
        {
          const operator = await this.db.serviceOperator.findOne({
            where: {status:1, id:mOperator.operator_id},
          });

          getOperatorWithPath = {
            id: operator.id,
            operator_name: operator.operator_name,
            category: operator.category,
            description: operator.description,
            image: baseurl+operator.image,
            status: operator.status,
            biller_id: operator.biller_id,
          }
        }
        
        
        const circle = ['Andhra Pradesh Telangana','Assam','Bihar Jharkhand','Chennai','Delhi NCR','Gujarat','Haryana','Himachal Pradesh','Jammu Kashmir','Karnataka','Kerala','Kolkata','Madhya Pradesh Chhattisgarh','Maharashtra Goa','Mumbai','North East','Orissa','Punjab','Rajasthan','Tamil Nadu','UP East','UP West','West Bengal'];
        
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getOperatorWithPath, circle: circle })));

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

	

}





module.exports = new ServicesOperator();