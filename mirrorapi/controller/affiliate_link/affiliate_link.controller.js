const { connect,baseurl,config } = require('../../config/db.config');
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
const { paginate } = require('../../utility/pagination.utility'); 

class AffiliateLink {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
        async getAffiliateLinks(req,res) {
	            const decryptedObject = utility.DataDecrypt(req.encReq);
                const {category_id} = decryptedObject;
            
                const requiredKeys = Object.keys({ category_id });
            
                if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                }
              try {

                    const category= await this.db.affiliateLink.getData(category_id);
                    if(category){
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Link Found successfully', data: category })));
                        // return res.status(200).json({ status: 200, message: 'Link Found successfully', data: category });
                    }else{
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Link  Not Found', data: [] })));
                        // return res.status(200).json({ status: 200, message: 'Link  Not Found', data: [] });
                    }
            
                } catch (err) {
                     
                      if (err.name === 'SequelizeValidationError') {
                          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
                        // return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                      }
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                        // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }
        
          }
          
            async getAffiliateLinksAll(req,res) {
                const decryptedObject = utility.DataDecrypt(req.encReq);
                const {category_id} = decryptedObject;

	
              try {
                  
                  
                  const requiredKeys = Object.keys({ category_id });
                    let graphics = [];
                    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                            const whereClause = {'status': 1}
                            graphics = await this.db.affiliateLink.findAll({
                            where: {...whereClause},
                            order: [['id', 'DESC']],
                          });
                    }else{
                        graphics= await this.db.affiliateLink.getData(category_id);
                    }
                  
                    // const whereClause = {'status': 1}
                    // const graphics = await this.db.affiliateLink.findAll({
                    //   where: {...whereClause},
                    //   order: [['id', 'DESC']],
                    // });
                    
                    let bannersByCategory = {};
                    const catGroup = [];
                 
                    for (const item of graphics) {
                      const graphicsId = item.id;
        
                      const cat_name = await this.db.affiliateLinkCategories.findOne({
                        where: {id:item.category_id},
                      });
        
                     
                      const cat_group = cat_name.category_name;
                     
                      if (!catGroup.includes(cat_group)) {
                        catGroup.push(cat_group);
                      }
                    
                      if (!bannersByCategory[cat_group]) {
                        bannersByCategory[cat_group] = [];
                      }
                   
                    
                      bannersByCategory[cat_group].push({
                        id: item.id,
                        image: baseurl + item.image,
                        title: item.title,
                        category: item.category_id,
                        link: item.link,
                        status: item.status,
                        amount: item.amount,
                        discount: item.discount,
                        discount_amount: item.discount_amount,
                      });
                    }
                 
                    // Modify bannersByCategory to include only the first 10 records for each category
                
                    const graphicsByCategory = await Promise.all(catGroup.map(async (cat_group) => {
                      const cat = await this.db.affiliateLinkCategories.findOne({
                        where: { category_name: cat_group },
                      });
                      
                      return {
                        category_id: cat ? cat.id : null,
                        cat_name: cat_group,
                        cat_data: bannersByCategory[cat_group].slice(0, 5), // Include only the first 5 records
                      };
                    }));
                    
                    
        
        
                        if (graphicsByCategory) {
                            // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Link Found', data: graphicsByCategory })));
                            return res.status(200).json({ status: 200, message: 'Link Found', data: graphicsByCategory });
                        
                        } else {
                            return res.status(401).json({ status: 401, token: '', message: 'Link Not Found', data: [] });
                            // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Link Not Found', data: [] })));
                      
                        }
                  
            
                } catch (err) {
                     
                      if (err.name === 'SequelizeValidationError') {
                        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
                        // return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                      }
                      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                    // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }

        }

      async addAffiliateLink(filename, req, res) {
        let t;
        
        const { title, link, category_id, amount} = req;
        
        const requiredKeys = Object.keys({ title, link, category_id });
      
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
      
        try {
          const filePath = filename;
          const path ='uploads/affiliate_link/';

          t = await this.db.sequelize.transaction();
         
            const Data = {
                title,
                link,
                category_id,
                amount,
                image:path+filePath,
            };
      
            const newAffiliate = await this.db.affiliateLink.insertData(Data, {
              validate: true,
              transaction: t,
              logging: sql => logger.info(sql),
            });
      
            await t.commit();
      
            return res.status(201).json({ status: 201, message: 'Affiliate Link added successfully', data: newAffiliate });
          
        } catch (error) {
          if (t) {
            await t.rollback();
          }
      
          logger.error(`Error in add Affliate: ${error}`);
      
          if (error.name === 'SequelizeValidationError') {
            // const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors: 'Internal server error' });
          }
      
          return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        }
      
   
}  

async getAffiliateLinksAdmin(req,res) {
	
  const { from_date, to_date} = req; 

  try {
          
            let whereCondition ;

            const startDate =new Date(from_date);
            const endDate =new Date(to_date);
            endDate.setHours(23, 59, 59);

            whereCondition = {
                'created_on': {
                  [Op.between]: [startDate, endDate]
                },
                'status':{
                  [Op.or]: [1,2]
                }
            }
          
        const report={
              totalAffilatelinkListCount:await this.db.affiliateLink.count({ where: {...whereCondition} }),
              totalDeleteAffilatelinkList:await this.db.affiliateLink.count({  where:{...whereCondition, status:`0` } }),
              totalActiveAffilatelinkList:await this.db.affiliateLink.count({  where:{...whereCondition, status:`1` } }),
              totalInactiveAffilatelinkList:await this.db.affiliateLink.count({  where:{ ...whereCondition, status:`2` } }),
           }
          
        const affiliateList= await this.db.view_affiliate_link.getAffliateList(whereCondition);
        const meetingResult = [];
          
        for (const item of affiliateList) {
        //   const category= await this.db.affiliateLinkCategories.getCategoryWithCategoryId(item.category_id);
            meetingResult.push({
           
            ...item.dataValues,
            image: baseurl+item.image,
            // category_name:category.category_name
          });
        }


        if(meetingResult){
            return res.status(200).json({ status: 200, message: 'Link Found successfully', data: meetingResult, report });
        }else{
            return res.status(200).json({ status: 200, message: 'Link  Not Found', data: [] });
        }

  } catch (err) {
       
        if (err.name === 'SequelizeValidationError') {
          return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
        }
      return res.status(500).json({ status: 500,token:'', message: err,data: []  });
  }

}

      async updateAffiliateLinkStatus(req, res) {

          const {id,status} = req;

          const requiredKeys = Object.keys({ id,status});   
          if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          }

          let t;

        try {
              const currentDate = new Date();
              const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
              const updatedStatus = await this.db.affiliateLink.updateData(
                        {
                          status,
                          modified_on:created_on
                        },
                        {id:id}
                      );
                      if (updatedStatus) {
                        return res.status(200).json({ status: 200, message: 'Status Updated Successful.'});
                      } else {
                        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                      }
                    
                } catch (error) {
                    logger.error(`Unable to find Leads: ${error}`);
                    if (error.name === 'SequelizeValidationError') {
                      const validationErrors = error.errors.map((err) => err.message);
                      return res.status(500).json({ status: 500,errors: validationErrors });
                    }
                  
                    return res.status(500).json({ status: 500,  message: error ,data:[]});
                }
          }


          async getLink(req, res) {

            const {id} = req;
  
            const requiredKeys = Object.keys({ id});   
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
  
            let t;
  
          try {
                    const whereCondition = {
                      'id': id
                  }
                    const link = await this.db.affiliateLink.findOne({
                      where: whereCondition,
                    });
                    
                        if (link) {
                          return res.status(200).json({ status: 200, message: 'Status Updated Successful.', data: link});
                        } else {
                          return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                        }
                      
                  } catch (error) {
                      logger.error(`Unable to find link: ${error}`);
                      if (error.name === 'SequelizeValidationError') {
                        const validationErrors = error.errors.map((err) => err.message);
                        return res.status(500).json({ status: 500,errors: validationErrors });
                      }
                    
                      return res.status(500).json({ status: 500,  message: error ,data:[]});
                  }
            }



            
      async updateAffiliateLink(filename, req, res) {

        const {id ,title, category_id, link ,status} = req;

        let t;

      // try {
            const currentDate = new Date();
            const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

            const filePath = filename;
            const path ='uploads/affiliate_link/';

            const updatedStatus = await this.db.affiliateLink.updateData(
                      {
                        title,
                        category_id,
                        link,
                        status,
                        modified_on:created_on,
                        image:filePath ? path+filePath : '',
                      },
                      {id:id}
                    );
                    if (updatedStatus) {
                      return res.status(200).json({ status: 200, message: 'Link Updated Successful.'});
                    } else {
                      return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                    }
                  
              // } catch (error) {
              //     // logger.error(`Unable to find Leads: ${error}`);
              //     if (error.name === 'SequelizeValidationError') {
              //       // const validationErrors = error.errors.map((err) => err.message);
              //       return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
              //     }
                
              //     return res.status(500).json({ status: 500,  message: error ,data:[]});
              // }
        }
              





          
/******************************************API'S FOR Affiliate TRACK USER DETAILS*******************************************************/

            async getAffiliateUserSDetails(req,res) {
                
              let t;
                  const decryptedObject = utility.DataDecrypt(req.encReq);
              const { user_id, affiliate_id } = decryptedObject;

              const requiredKeys = Object.keys({ user_id,affiliate_id });

              if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
              }

              try {
               

                const whereChk={id:user_id};
                const UserAttribute=['id','first_name','last_name','mobile'];
                const userRow = await this.db.user.getData(UserAttribute,whereChk);
                
               
                  const clickData = {
                      user_id,
                      affiliate_id,
                      created_by:user_id
                  };
                  

                  const newInsuarance= await this.db.affiliate_user_track.insertData(clickData);
        
                //   const whatsappInsurance = await whatsappUtility.insuranceRequestMessage(userRow.first_name,userRow.last_name,userRow.mobile);
                //   await this.db.whatsapp_notification.insertData(whatsappInsurance);
                
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Create  successfully', data: newInsuarance })));
                //   return res.status(200).json({ status: 200, message: 'Create  successfully', data: newInsuarance });
            
                }
              catch (err) {
                     
                if (err.name === 'SequelizeValidationError') {
                  const validationErrors = err.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
                //   return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }

              }



          async getAffiliateUserDetailsReport(req,res) {
                
            const { from_date, to_date} = req; 

            try {
                    
                      let whereCondition ;
    
                      const startDate =new Date(from_date);
                      const endDate =new Date(to_date);
                      endDate.setHours(23, 59, 59);
    
                      whereCondition = {
                          'created_on': {
                            [Op.between]: [startDate, endDate]
                          },
                      }
                      
                      const report={                        
                        totalAflr:await this.db.view_affiliate_user_track_report.count({ where: {...whereCondition} }),
                        totalpendingAflr:await this.db.view_affiliate_user_track_report.count({ where:{...whereCondition, status:`0` } }),
                        totalFollowUpAflr:await this.db.view_affiliate_user_track_report.count({ where:{...whereCondition, status:`1` } }),
                     }
                   
                    const Insuarance= await this.db.view_affiliate_user_track_report.getAffiliateDetails(whereCondition);
                    if(Insuarance){
                        return res.status(200).json({ status: 200, message: 'Get details report', data: Insuarance, report });
                    }else{
                        return res.status(200).json({ status: 200, message: 'No record Found', data: [] });
                    }
                    
              
                  }
                catch (err) {
                        logger.error(`Unable to find Insuarnce: ${err}`);
                  if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: validationErrors });
                  }
                  return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                    }
  
                }



                

        

async updateTrackUserStatus(req, res) {

    const {id,status} = req;

    const requiredKeys = Object.keys({ id,status});   
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {
      

        const currentDate = new Date();
        const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
        
          const updatedMoneyStatus = await this.db.affiliate_user_track.updateData(
                    {
                    //   rejection_reason:note,
                      status,
                      updated_on:created_on
                    },
                    
                    {id:id}
                    
                  );
                    
                  if (updatedMoneyStatus) {
                    return res.status(200).json({ status: 200, message: 'Status Updated Successful.'});
                  } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                  }
                
            } catch (error) {
                logger.error(`Unable to find Leads: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
      }
          

    async upload_invoice(filename, req, res) 
    {
        //const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id, purchase_date, portal_name, category_id, amount,affiliate_link_id } = req;

      try {
        
        const filePath = filename;
        const path ='uploads/affiliate_link/invoice/';
          const purchaseDate = new Date(purchase_date);
        //   const income_amount = parseFloat((amount*50/100)/15);
        const income_amount = parseFloat(((amount*50/100)/15).toFixed(2));
          
          const inputData = {
            user_id,
            purchase_date: purchaseDate,
            portal_name,
            amount,
            category_id,
            invoice: path+filePath,
            remarks: `Congratulations... Rs ${income_amount} will be credited to your income wallet upto 90 days`,
            affiliate_link_id
          };

          const invoiceUpload = await this.db.affiliateInvoiceUpload.insertData(inputData);
                    
          if (invoiceUpload) {
              //return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Status Updated Successful.', data: invoiceUpload})));
            return res.status(200).json({ status: 200, message: 'Status Updated Successful.', data: invoiceUpload});
          } else {
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
            //return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
          }
          
        } catch (error) {
            logger.error(`Unable to find Leads: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data:validationErrors })));
              return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
            }
            
            //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));
            return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
    }
    
    
    async getInvoiceOrderHistory(req,res) 
    {

      const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id,  StatusFlag, page } = decryptedObject; 
         
          try {
                  const requiredKeys = Object.keys({ user_id, StatusFlag});
      
                  let returnData = [];
                  let status = 0;
                //   let pageSize  =1 ;
                //     if(page!=null && parseInt(page) > 0){
                //         pageSize= parseInt(page);
                //     }
                 
                  if(StatusFlag=='Pending'){
                    status=1;
                  }else if(StatusFlag=='Accepted'){
                    status=2;
                  }else if(StatusFlag=='Hold'){
                    status=3;
                  }else if(StatusFlag=='Rejected'){
                    status=4;
                  }else{
                    status=0;
                  }
      
                  if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                      
                        const whereClause = {
                          'user_id': user_id,
                        }
                        returnData = await paginate(this.db.viewAffiliateInvoiceUpload, {
                          whereClause,
                          page,
                          order: [['created_on', 'DESC']],
                        });
      
                  }else{
                        const whereClause = {
                          'user_id': user_id,
                          'status': status
                        }
      
                         returnData = await paginate(this.db.viewAffiliateInvoiceUpload, {
                          whereClause,
                          page,
                          order: [['created_on', 'DESC']],
                        });
                  }
                const whereCondition1 = {
                        user_id,
                        sub_type:'Invoice Income'
                      }
                const total_paid_amount = await this.db.ReferralIncome.getEarningAmount(whereCondition1);
                   const whereCondition2 = {
                        user_id,
                        sub_type:'Invoice Income'
                      }
                const totalPendingAmount = await this.db.holdIncome.getEarningAmount(whereCondition2);
                const pending_income=totalPendingAmount? totalPendingAmount:0;
                
                const total_earning = total_paid_amount + pending_income ;
                
                    
            if(returnData){
             //return res.status(200).json({ status: 200,  message:'Record Found', data : returnData, totalPaidAmount:total_paid_amount,totalPendingAmount:pending_income,total_earning:total_earning});
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'Record Found', data : returnData, totalPaidAmount:total_paid_amount,totalPendingAmount:pending_income,total_earning:total_earning})));   
            }else{
               //return res.status(200).json({ status: 200,  message:'Not Found', data : [] });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'Not found', data : [], }))); 
            }
           
          } catch (error) {
              
              if (error.name === 'SequelizeValidationError') {
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' }))); 
                //return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
              }
            
               return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]}))); 
              //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
          }

      }
      
      
      
      
  
  async getAffiliateUploadInvoiceReport(req,res) {
                
    const { from_date, to_date} = req; 

    try {
            
              let whereCondition ;

              const startDate =new Date(from_date);
              const endDate =new Date(to_date);
              endDate.setHours(23, 59, 59);

              whereCondition = {
                  'created_on': {
                    [Op.between]: [startDate, endDate]
                  },
              }
           
            const Insuarance= await this.db.viewAffiliateInvoiceUpload.getAffliateInvoivceList(whereCondition);
            
             const affilaiteResult = [];
            for (const item of Insuarance) {
              affilaiteResult.push({
                ...item.dataValues,
                image:item.invoice?  baseurl+item.invoice : '',
              });
            }
           
            if(affilaiteResult){
                return res.status(200).json({ status: 200, message: 'Get details report', data: affilaiteResult });
            }else{
                return res.status(200).json({ status: 200, message: 'No record Found', data: [] });
            }
            
      
          }
        catch (err) {
                logger.error(`Unable to find Insuarnce: ${err}`);
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
          return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }

        }
        
        
    async updateInvoiceStatus(req, res) {

            const {id,status,distribd_amount} = req;
    
            const requiredKeys = Object.keys({ id,status});   
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
    
            let t;
    
            try {
                    const env = config.env;
                    const currentDate = new Date();
                    const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                    let remarks="";
                    if(status==1){
                      remarks="In process - we are working on this Invoices. Next status will update soon";
                    }
                    else if(status==2){
                      remarks="In Accepted - Your Invoice is approved successfully";
                    }
                    else if(status==3){
                      remarks="In Hold - Your invoice is in hold.";
                    }
                    else if(status==4){
                      remarks="In Rejected - Your invoice is rejected. Take follow-up with Customer care and upload invoice gain";
                    }
                    const data= {
                      status,
                      remarks:remarks,
                      modified_on:created_on,
                      distributed_amount: distribd_amount?distribd_amount:null
                    };
    
                    const getInvoiceActionData = await this.db.viewAffiliateInvoiceUpload.getDataById(id);
                 
                    if(getInvoiceActionData){
    
                      
                      if(status == '2' && distribd_amount > 0)
                      {
                        const user_id = getInvoiceActionData.user_id;
                        const affiliate_link_id = getInvoiceActionData.affiliate_link_id;
                        const category_id = getInvoiceActionData.category_id;
                        const category_name = getInvoiceActionData.category_name;
                         await this.rePurchaseIncome(env, user_id, distribd_amount, 0, affiliate_link_id, category_id, category_name );
                      
                        }
                        
                    
                    const updatedLeadUserStatus = await this.db.affiliateInvoiceUpload.updateData(data,  {id:id});
                    
                  
                    return res.status(200).json({ status: 200, message: 'User Action Updated Successful.'});
    
                    }else{
                      return res.status(500).json({ status: 500, message: 'Unable to update', data: [] });
                    }
              
    
              } catch (error) {
                  logger.error(`Unable to find Leads: ${error}`);
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500,errors: validationErrors });
                  }
                
                  return res.status(500).json({ status: 500,  message: error.message ,data:[]});
              }
        }
        
        
        async rePurchaseIncome(env, user_id,  amount, ipAddress, affiliate_link_id, category_id, category_name  )
        {
                  try {
            
                    let date = new Date();
                    let sub_type = 'Invoice Income';
                    const user_repurchase_amount = ((amount*50/100)/15).toFixed(2)
                    const referrals = await this.db.referral_idslevel.getShoppingRefralUser(user_id);
                    
                    const getAffiliateLinkData = await this.db.affiliateLink.getAffiliateData(affiliate_link_id);
                    // const  cb_amount= getAffiliateLinkData.amount;
                    // const user_distribute_amount = (amount*cb_amount/100).toFixed(2);
                    
                     const user_distribute_amount = (amount*50/100).toFixed(2);

                    const newRow = {
                      id: '0',
                      user_id: user_id,
                      ref_userid: user_id,
                      mlm_id: '',
                      level: 0,
                      status: 1,
                      created_on: utility.formatDate(date),
                    };
                    referrals.push(newRow);
     
       
                 
                    let results = [];
                        for (const referral of referrals) {
                          
                            if(referral.ref_userid>0 && user_repurchase_amount>0)
                            {
                              const order_id=utility.generateUniqueNumeric(7);
                              const orderData = {
                                  user_id:referral.ref_userid,
                                  env:env, 
                                  tran_type:'Credit',
                                  tran_sub_type:'Invoice Repurchase',
                                  tran_for:'Repurchase',
                                  trans_amount: (referral.id==0)? user_distribute_amount :user_repurchase_amount,
                                  currency:'INR',
                                  order_id,
                                  order_status:'PENDING',
                                  created_on:Date.now(),
                                  created_by:user_id,
                                  ip_address:ipAddress
                              };
                                
                              const generateorder = await this.db.upi_order.insertData(orderData); 
            
                              if(generateorder){
                                const refralData = {
                                    user_id:referral.ref_userid,
                                    transaction_id: order_id,
                                    env: env, 
                                    type: 'Credit', 
                                    sub_type: sub_type, 
                                    amount:  (referral.id==0)? user_distribute_amount :user_repurchase_amount,
                                    tran_for: 'Repurchase', 
                                    created_by:user_id,
                                    details: sub_type + ' Repurchase(' +user_repurchase_amount+ ') income',
                                    sender_id: user_id,
                                    level: referral.level
                                };
                                const result = await this.db.holdIncome.insert(refralData);
                                results.push(result);
                              }
                            }
                            
                          }
                       return results;
            
                  } catch (error) {
                    console.error(error.message);
                    return  {'status': false};
                }
         }



    async getAffiliateUserTrack(req,res) 
    {
            
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id } = decryptedObject;
        
        const requiredKeys = Object.keys({ user_id });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        
        try {
        
            const affiliateTrack = await this.db.view_affiliate_user_track_report.findOne({
              where: {
                user_id: user_id,
                status:1
              },
              order: [['id', 'DESC']]
            });
        
        
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: affiliateTrack })));
            //return res.status(200).json({ status: 200, message: 'Data Found', data: affiliateTrack });
        }catch (err) {
               
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error', data:validationErrors })));
          //return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
          }
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message, data: [] })));
          // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
        }
    
    }



  


/******************************************API'S FOR INSUARANCE TRACK USER DETAILS*******************************************************/

}




module.exports = new AffiliateLink();