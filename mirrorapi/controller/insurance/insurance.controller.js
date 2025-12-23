const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();
const whatsappUtility = require('../../utility/whatsapp.utility');

class Insuarnce {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    
    async addInsurance(fileName, fileNames, req,res) 
    {
      const { user_id, type, form_data } = req;
    
      // const requiredKeys = Object.keys({ user_id, type, category_id, form_data, lead_id });
    
      // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      // }
    
      try 
      {
        
        
        let path = '/uploads/insurance/';
        if (Array.isArray(fileNames)) {
          fileNames.forEach(filename => {
              const key = filename.split('-')[0];
              form_data.push({ key: path + filename });
          });
        }

        const ins_no = utility.generateUniqueNumeric(7);

        const insuarnceData = {
          user_id,
          ins_no,
          ins_type: type,
          form_data:JSON.stringify(form_data)
        };
          

        const newInsuarance = await this.db.insuarnce.insertData(insuarnceData);
    
        //return res.status(200).json({ status: 200, message: 'Insurance form submited successfully', data: newInsuarance });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Insurance form submited successfully', data: newInsuarance })));
      
      }catch (err) {
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error', data:validationErrors })));
          //return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
        }
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message, data: []  })));
          //return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
      }

    }
    
    
    async insurance_data(req, res) {
      const { from_date, to_date} = req;
  
      const requiredKeys = Object.keys({ from_date, to_date });
      
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
  
      try {
  
          const fromDate = new Date(from_date);
          const toDate = new Date(to_date);
          fromDate.setHours(0, 0, 0);
          toDate.setHours(23, 59, 59);
          
          const results = await this.db.viewInsuarnce.findAll({ 
              where: {
              created_on: {
                [Op.between]: [fromDate, toDate]
              }
            },
            order: [['created_on', 'DESC']] 
          });

        //   const report={
        //     total_insuranceCount : await this.db.viewInsuarnce.count( 'user_id'  ),
        //     total_pendingCount : await this.db.viewInsuarnce.count({  where:{ status:`1` } }),
        //     total_amount : await this.db.viewInsuarnce.sum('amount'),
           
        //   }
  
          if(results !==null){
              return res.status(200).json({ status: 200, message:'Successfully all record found', data: results });
          }
      
          return res.status(400).json({ status: 400, message:'Record not found',data:[] });
  
      } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
    }
    
    
    async getInsuranceDetails(req,res)
    {
    
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id } = decryptedObject;

      const requiredKeys = Object.keys({ user_id });

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      try 
      {


          const getInsurance= await this.db.viewInsuarnce.getDataById({user_id:user_id});


            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Get data of that user', data: getInsurance })));
          //return res.status(200).json({ status: 200, message: 'Get data of that user', data: getInsurance });
    
        }
      catch (err) {
        logger.error(`Unable to find Insuarnce: ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
         // return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
        }
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message, data: []  })));
        //return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
      }

    }

    
	
//     async encryptBase64(user_id) {
    
//     const plainText = user_id;
//     const base64Encoded = Buffer.from(plainText).toString('base64');
//     return base64Encoded;
//     }
//     async decryptBase64(user_id) {

//       const decodedText = Buffer.from(user_id, 'base64').toString('utf-8');
//       return  decodedText;
//     }

//     async addInsurance(req,res) {
	  
//         let t;
       
//         const { name, phone, siId,productName,leadProviderId,quotationUrl } = req;
      
//         const requiredKeys = Object.keys({ name, phone, siId,productName,leadProviderId,quotationUrl });
      
//         if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
//           return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
//         }
      
//         try {
        
//           t = await this.db.sequelize.transaction();

//           const userId = await this.decryptBase64(leadProviderId);
          
//             let date = new Date();
//             let created_on = utility.formatDate(date);
            

//             const insuarnceData = {
//                 user_id:userId,
//                 name,
//                 phone,
//                 siId,
//                 product_name:productName,
//                 lead_provide_id:leadProviderId,
//                 quotationUrl:quotationUrl,
//                 created_on,
//                 created_by:userId
//             };
            

//             const newInsuarance= await this.db.insuarnce.insertData(insuarnceData, {
//               validate: true,
//               transaction: t,
//               logging: sql => logger.info(sql),
//             });
      
//             await t.commit();
      
//             return res.status(200).json({ status: 200, message: 'Create Lead successfully', data: newInsuarance });
       
//           }
//         catch (err) {
//                 logger.error(`Unable to find Insuarnce: ${err}`);
//     			if (err.name === 'SequelizeValidationError') {
//     			  const validationErrors = err.errors.map((err) => err.message);
//     			  return res.status(500).json({ status: 500,errors: validationErrors });
//     			}
//     			 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
//             }
	
//         }

//         async updateInsurance(req,res) {
	  
//         let t;
       
//         const {leadProviderId,productProviderName,vleMargin,siId,amount,status} = req;
       
//         const requiredKeys = Object.keys({ leadProviderId,productProviderName,vleMargin ,amount,status });
      
//         if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
//           return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
//         }
      
//         try {
        
//           t = await this.db.sequelize.transaction();

//             let userId = await this.decryptBase64(leadProviderId);
//              userId = parseInt(userId);
//             let date = new Date();
//             let created_on = utility.formatDate(date);
            

//             const insuarnceData = {
              
//                 product_provider_name:productProviderName,
//                 vleMargin,
//                 amount,
//                 status,
//                 lead_provide_id:leadProviderId,
//                 modified_by: userId,
//                 modified_on:  created_on,
//             };
        
//             const whereClause = { lead_provide_id:leadProviderId ,siId:siId ,user_id:userId};
            
//             const results= await this.db.insuarnce.updateData(insuarnceData,whereClause);
      
//             await t.commit();
      
//             return res.status(200).json({ status: 200, message: 'Updated Lead successfully', data: results });
       
//           }
//         catch (err) {
//                 logger.error(`Unable to find Insuarnce: ${err}`);
//     			if (err.name === 'SequelizeValidationError') {
//     			  const validationErrors = err.errors.map((err) => err.message);
//     			  return res.status(500).json({ status: 500,errors: validationErrors });
//     			}
//     			 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
//             }
	
//         }






//         async getPolicyPdf(req,res) {
	  
            
            
//                 const {siId} = req;
            
//                 const requiredKeys = Object.keys({ siId });
            
//                 if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
//                   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
//                 }
            
//               try {


//                       const data = new FormData();
//                       data.append('quotation_id', siId);
                  
//                       const config = {
//                         method: 'post',
//                         maxBodyLength: Infinity,
//                         url: 'https://www.squareinsurance.in/Quotation_details/pdfDownload',
                       
//                         data: data,
                       
//                       };
                  
//                     const result =  await axios(config)
                  
//                         .then((response) => {
                             
//                                   return response.data ;
                              
//                           });
                    
//                     return res.status(200).json({ status: 200, message: 'Policy PDF get successful.', data: result });
            
//                 } catch (err) {
//                       logger.error(`Unable to find Insuarnce: ${err}`);
//                       if (err.name === 'SequelizeValidationError') {
//                         const validationErrors = err.errors.map((err) => err.message);
//                         return res.status(500).json({ status: 500,errors: validationErrors });
//                       }
//                     return res.status(500).json({ status: 500,token:'', message: err,data: []  });
//                 }
        
//           }


          
// /******************************************API'S FOR INSUARANCE TRACK USER DETAILS*******************************************************/

//             async getInsuranceUserDetails(req,res) {
                
//               let t;
            
//               // const { amount } = req;

//               // const requiredKeys = Object.keys({ amount });

//               // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
//               //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
//               // }

//               try {
//                 const userId = req.id;

//                 const whereChk={id:userId};
//                 const UserAttribute=['id','first_name','last_name','mobile'];
//                 const userRow = await this.db.user.getData(UserAttribute,whereChk);
                
//                   let date = new Date();
//                   let created_on = utility.formatDate(date);
                  

//                   const insuarnceData = {
//                       user_id:userId,
//                       // amount,
//                       // name,
//                       // phone,
//                       // siId,
//                       // product_name:productName,
//                       // lead_provide_id:leadProviderId,
//                       // quotationUrl:quotationUrl,
//                       created_on,
//                       created_by:userId
//                   };
                  

//                   const newInsuarance= await this.db.insuarnce_user_track.insertData(insuarnceData);

//                   const whatsappInsurance = await whatsappUtility.insuranceRequestMessage(userRow.first_name,userRow.last_name,userRow.mobile);
//                   await this.db.whatsapp_notification.insertData(whatsappInsurance);

//                   return res.status(200).json({ status: 200, message: 'Create Lead successfully', data: newInsuarance });
            
//                 }
//               catch (err) {
//                       logger.error(`Unable to find Insuarnce: ${err}`);
//                 if (err.name === 'SequelizeValidationError') {
//                   const validationErrors = err.errors.map((err) => err.message);
//                   return res.status(500).json({ status: 500,errors: validationErrors });
//                 }
//                 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
//                   }

//               }



//           async getInsuranceUserDetailsReport(req,res) {
                
//                 let t;
        
//                 try {
                 
//                     const Insuarance= await this.db.view_insurance_user_track_details.getInsuaranceDetails();
  
//                     return res.status(200).json({ status: 200, message: 'Get details report', data: Insuarance });
              
//                   }
//                 catch (err) {
//                         logger.error(`Unable to find Insuarnce: ${err}`);
//                   if (err.name === 'SequelizeValidationError') {
//                     const validationErrors = err.errors.map((err) => err.message);
//                     return res.status(500).json({ status: 500,errors: validationErrors });
//                   }
//                   return res.status(500).json({ status: 500,token:'', message: err,data: []  });
//                     }
  
//                 }
  


/******************************************API'S FOR INSUARANCE TRACK USER DETAILS*******************************************************/

}




module.exports = new Insuarnce();