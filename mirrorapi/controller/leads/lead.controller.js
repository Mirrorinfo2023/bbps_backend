const { connect,baseurl,config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 
const { paginate } = require('../../utility/pagination.utility'); 
const path = require('path');
require('dotenv').config();

class Lead {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    
    // async addLead(filename, req, res) {
    //     let t = await this.db.sequelize.transaction();
        
    //     const { category_id, lead_name, specification, description, sequence, total_earning, distribution_amount, download_app_link, open_now_link, referral_link, video_link, row_data} = req;

    //     // const requiredKeys = Object.keys({ category_id, lead_name, specification, description });
      
    //     // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
    //     //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    //     // }
      
    //     try {
    //         const filePath = filename;
    //         const path ='/uploads/leads/';
    //         const lead_field_lebel = lead_name.replace(/\s+/g, '_').toLowerCase();

    //         const existingLead = await this.db.leads.findOne({where: {status:1, lead_name:lead_name, category_id:category_id},});
    //         if (!existingLead) {
    //           const instData = {
    //                   lead_name,
    //                   category_id,
    //                   specification,
    //                   description,
    //                   img:path+filePath,
    //                   lead_field_lebel,
    //                   sequence,
    //                   total_earning,
    //                   distribution_amount,
    //                   download_app_link,
    //                   open_now_link,
    //                   referral_link,
    //                   video_link
    //           };
        
    //           const newLeads = await this.db.leads.insertData(instData, {
    //                   validate: true,
    //                   transaction: t,
    //                   logging: sql => logger.info(sql),
    //           });

              
    //           const tableData = JSON.parse(row_data);
    //           let detailsflag = 0;
    //           if(tableData.tableData && newLeads.id){
                
    //             for(const data of tableData.tableData)
    //             {
    //               const dataToInsert = {
    //                 'category_id': category_id,
    //                 'lead_header_id': newLeads.id,
    //                 'lead_value': data.name,
    //                 'description': data.description,
    //                 'lead_detail_group': 'Detail'
    //               }
                  
    //               const request = await this.db.leadsDetails.insertData(dataToInsert, {
    //                 validate: true,
    //                 transaction: t,
    //                 logging: sql => logger.info(sql),
    //               });
    //               if(request)
    //               {
    //                 detailsflag = 1;
    //               }
                  
    //             }
    //           }

    //           if(detailsflag == 1)
    //           {
    //             await t.commit();
    //             return res.status(201).json({ status: 201, message: 'Leads added successfully', data: newLeads });
    //           }else{
    //             await t.rollback();
    //             return res.status(500).json({ status: 500, error: 'Somthing went wrong' });
    //           }


              
          
    //         } else {
    //           await t.rollback();
    //           return res.status(500).json({ status: 500, error: 'Already Exist' });
    //         }

    //     } catch (error) {
    //       await t.rollback();
    //       logger.error(`Error in add Leads: ${error}`);
      
    //       if (error.name === 'SequelizeValidationError') {
    //         const validationErrors = error.errors.map((err) => err.message);
    //         return res.status(500).json({ status: 500, errors: validationErrors });
    //       }
      
    //       return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
    //     }

    // }
    
    async addLead(fileName, fileNames, req, res) {
        let t = await this.db.sequelize.transaction();
        
        const { category_id, lead_name, specification, description, sequence, total_earning, distribution_amount, download_app_link, open_now_link, referral_link, video_link, row_data, bulk_image_level, faq_data, link, video_data, form_data} = req;

        // const requiredKeys = Object.keys({ category_id, lead_name, specification, description });
      
        // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        // }
      
        try {

            //return fileNames;
            let filePath = '';
            let bannerImage = '';
            fileNames.forEach(filename => {
              if (filename.includes("marketing_image") === false && filename.includes("banner_image") === false && filename.includes("video_image") === false) {
                filePath = filename;
              }

              if (filename.includes("marketing_image") === false && filename.includes("banner_image") === true && filename.includes("video_image") === false) {
                bannerImage = filename;
              }
            });
            
            const path ='/uploads/leads/';
            const lead_field_lebel = lead_name.replace(/\s+/g, '_').toLowerCase();

            const existingLead = await this.db.leads.findOne({where: {status:1, lead_name:lead_name, category_id:category_id},});
            if (!existingLead) {
              const instData = {
                      lead_name,
                      category_id,
                      specification,
                      description,
                      img: filePath? path+filePath: '',
                      lead_field_lebel,
                      sequence,
                      total_earning,
                      distribution_amount,
                      download_app_link,
                      open_now_link,
                      referral_link,
                      video_link,
                      link,
                      banner_image: bannerImage? path+bannerImage: '',
                      input_params: (form_data)?JSON.parse(form_data):'',
              };
        
              const newLeads = await this.db.leads.insertData(instData, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
              });

              
              const tableData = JSON.parse(row_data);
              let detailsflag = 0;
              if(tableData.tableData && newLeads.id){
                
                for(const data of tableData.tableData)
                {
                  const dataToInsert = {
                    'category_id': category_id,
                    'lead_header_id': newLeads.id,
                    'lead_value': data.name,
                    'description': data.description,
                    'lead_detail_group': 'Details'
                  }
                  
                  const request = await this.db.leadsDetails.insertData(dataToInsert, {
                    validate: true,
                    transaction: t,
                    logging: sql => logger.info(sql),
                  });
                  if(request)
                  {
                    detailsflag = 1;
                  }
                  
                }
              }

              const imageArr = [];
              for (const filename of fileNames) {
                if (filename.includes("marketing_image")) {
                  imageArr.push(path+filename);
                }
              }

              const marketingData = bulk_image_level;
              let marketingflag = 0;
              if(marketingData && newLeads.id){

                
                for (let i = 0; i < marketingData.length; i++) {

                  const dataToInsert = {
                    'category_id': category_id,
                    'lead_header_id': newLeads.id,
                    'lead_value': marketingData[i],
                    'image': imageArr[i],
                    'lead_detail_group': 'Marketing'
                  }
                  
                  const request = await this.db.leadsDetails.insertData(dataToInsert, {
                    validate: true,
                    transaction: t,
                    logging: sql => logger.info(sql),
                  });
                  if(request)
                  {
                    marketingflag = 1;
                  }
                }

              }

              const faqData = JSON.parse(faq_data);
              let faqflag = 0;
              if(faqData.tableData && newLeads.id){
                
                for(const data of faqData.tableData)
                {
                  const dataToInsert = {
                    'category_id': category_id,
                    'lead_id': newLeads.id,
                    'question': data.question,
                    'answer': data.answer
                  }
                  
                  const request = await this.db.faqs.insertData(dataToInsert, {
                    validate: true,
                    transaction: t,
                    logging: sql => logger.info(sql),
                  });
                  if(request)
                  {
                    faqflag = 1;
                  }
                  
                }
              }


              const VideoimageArr = [];
              for (const filename of fileNames) {
                if (filename.includes("video_image")) {
                  VideoimageArr.push(path+filename);
                }
              
              }

              const videoData = JSON.parse(video_data);
              let videoflag = 0;
              if(videoData && newLeads.id){

                
                for (let i = 0; i < videoData.length; i++) {

                  const dataToInsert = {
                    'category_id': category_id,
                    'lead_header_id': newLeads.id,
                    'lead_value': videoData[i].label,
                    'video': videoData[i].link,
                    'image': VideoimageArr[i],
                    'lead_detail_group': 'Video'
                  }
                  
                  const request = await this.db.leadsDetails.insertData(dataToInsert, {
                    validate: true,
                    transaction: t,
                    logging: sql => logger.info(sql),
                  });
                  if(request)
                  {
                    marketingflag = 1;
                  }
                }

              }

              if(detailsflag == 1 && faqflag == 1 && marketingflag == 1)
              {
                await t.commit();
                return res.status(201).json({ status: 201, message: 'Product added successfully', data: newLeads });
              }else{
                await t.rollback();
                return res.status(500).json({ status: 500, error: 'Somthing went wrong' });
              }


              
          
            } else {
              await t.rollback();
              return res.status(500).json({ status: 500, error: 'Already Exist' });
            }

        } catch (error) {
          await t.rollback();
          logger.error(`Error in add Product: ${error}`);
      
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors: validationErrors });
          }
      
          return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        }

    }

    async getLeads(req,res) {

      try {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { category_id } = decryptedObject;

        const requiredKeys = Object.keys({ category_id });
    
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
          
        }

        const getLeads  = await this.db.leads.getDataWithClause(category_id);
        const getLeadsData  = getLeads.map((lead) => ({
                id: lead.id,
                lead_name: lead.lead_name,
                category_id:lead.category_id,
                specification:lead.specification,
                image: baseurl+lead.img,
                description: lead.description,
                status: lead.status,
                total_earning: lead.total_earning,
                distribution_amount: lead.distribution_amount,
                download_app_link: lead.download_app_link,
                open_now_link: lead.open_now_link,
                referral_link: lead.referral_link,
                video_link: lead.video_link
              }));


        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: getLeadsData })));

      } catch (err) {
        logger.error(`Unable to find : ${err}`);
        if (err.name === 'SequelizeValidationError') {
          const validationErrors = err.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        }
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message,data: []  })));
      }


    }


    async addLeadDetails(req, res) {
      let t = await this.db.sequelize.transaction();
      const dataToInsert = req;
      if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
        return res.status(400).send('Bad Request. Expected an array of data.');
      }
      
    
      try {
        const request = await this.db.leadsDetails.bulkCreate(dataToInsert, {
          validate: true,
          transaction: t,
          logging: sql => logger.info(sql),
        });

        const whereClause = {'status': 1 }
        const attributes = ['lead_header_id',
          'lead_header_label',
          'category_id',
          'lead_value',
          'description'
        ];

        const leadsByCategory = await this.db.leadsDetails.findAll({
          attributes: [...attributes],
          where: {...whereClause},
          group: [...attributes],
        });
      
        await t.commit();
      
        return res.status(201).json({status: 200, message: 'Data added successfully',data: leadsByCategory, });
      } catch (error) {
        await t.rollback();
        console.error('Error creating leads:', error);
        return res.status(500).json({status: 500, message: 'Failed to create leads', data: [],});
      }

    }


    async getLeadDetails(req, res) 
    {
    
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { lead_header_id, category_id } = decryptedObject;
      const requiredKeys = Object.keys({ lead_header_id, category_id });
  
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
          
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }
    
    
      try {
        const whereClause = {'status': 1, 'lead_header_id': lead_header_id, 'category_id': category_id }
        const attributes = ['lead_header_id',
          'lead_header_label',
          'category_id',
          'lead_value',
          'description',
          'lead_detail_group',
          'image',
          'video'
        ];
        
        const leadData  = await this.db.leads.getDataById(lead_header_id);
        const groupedLeads = {};
        const groupKeyArr = ['Details', 'Marketing', 'Video', 'faqs', 'potential_client_tot_earning'];

        groupKeyArr.forEach((groupKey) => {
          groupedLeads[groupKey] = {
            lead_detail_group: groupKey,
            leads: []
          };
        });

        const leadsByCategory = await this.db.leadsDetails.findAll({
          attributes: [...attributes],
          where: {...whereClause},
          group: [...attributes],
        });
      
        let descriptionArray;

        leadsByCategory.forEach((lead) => {
          const groupKey = lead.lead_detail_group;
        
          if (!groupedLeads[groupKey]) {
            groupedLeads[groupKey] = {
              lead_detail_group: lead.lead_detail_group,
              leads: []
            };
          }
          
          try {
            descriptionArray = JSON.parse(lead.description.replace(/'/g, "\\'"));
          } catch (error) {
            descriptionArray = [lead.description];
          }
          groupedLeads[groupKey].leads.push({
            lead_header_id: lead.lead_header_id,
            lead_header_label: lead.lead_header_label,
            category_id: lead.category_id,
            lead_value: lead.lead_value,
            description: descriptionArray,
            image: lead.image? baseurl+lead.image:'',
            video: lead.video,
          });
        });
        
        
        const faqData = await this.db.faqs.getDataWithClause(lead_header_id);

        faqData.forEach((faq) => {
          const groupKey = 'faqs';
          
          if (!groupedLeads[groupKey]) {
            groupedLeads[groupKey] = {
              lead_detail_group: groupKey,
              leads: []
            };
          }
          
          try {
            descriptionArray = JSON.parse(faq.answer.replace(/'/g, "\\'"));
          } catch (error) {
            descriptionArray = [faq.answer];
          }
          groupedLeads[groupKey].leads.push({
            question: faq.question,
            answer: faq.answer,
            description: descriptionArray,
          });
        });
        
        const groupKey = 'potential_client_tot_earning';
          
        if (!groupedLeads[groupKey]) {
          groupedLeads[groupKey] = {
            lead_detail_group: groupKey,
            leads: []
          };
        }

        groupedLeads[groupKey].leads.push({
          total_earning: '0.00',
          potential_client: '0.00',
          account_reffered: '0.00',
          total_pending_account: '0.00',
          earn_at_transfers: '0.00'
        });

        
        // Convert the object into an array of groups
        const groupedLeadsArray = Object.values(groupedLeads);

        groupedLeadsArray.forEach((group) => {
          if (!groupKeyArr.includes(group.lead_detail_group)) {
            group.leads.push({
              lead_header_id: null,
              lead_header_label: null,
              category_id: null,
              lead_value: null,
              description: null,
              image: null,
              video: null
            });
          }
        });
        //return res.status(200).json({status: 200,  message: 'Data found',main_data: leadData, data: groupedLeadsArray}); 
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({status: 200,  message: 'Data found',main_data: leadData, data: groupedLeadsArray}))); 
      
      } catch (error) {
        console.error('Error creating leads:', error);
        //return res.status(500).json({status: 500, message: 'Failed get leads', data: error.message,});
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({status: 500, message: 'Failed get leads', data: [],})));      
      }

    }
    
    
    
  async getLeadReport( req, res) {

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
      const result = await this.db.leads.getAllData(whereCondition);
     
      const leadResult = [];

      for (const item of result) {
     
        const categoryData = await this.db.leadsCategory.getData(['category_name'], { id: item.category_id });
     
        leadResult.push({
          category_name: categoryData ? categoryData.category_name :'',
      
          ...item.dataValues,
          img: baseurl+item.img,
          created_on: utility.formatDateTimeDMY(item.created_on)
        });
      }

        const report = {
          total_count : await this.db.leads.count({ where: {...whereCondition} }, 'id'  ),
          total_active : await this.db.leads.count(  {  where:{ ...whereCondition, status:`1` } }  ),
          total_inactive : await this.db.leads.count( {  where:{ ...whereCondition, status:`0` } }),
         
      }


      return res.status(200).json({ status: 200,  message:'success', data : leadResult, report });
     

      } catch (error) {
          logger.error(`Unable to find user: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
        
}


async updateLead(fileName, fileNames, req, res) {
      let t = await this.db.sequelize.transaction();
      
      const { lead_id, category_id, lead_name, specification, description, sequence, total_earning, distribution_amount, download_app_link, open_now_link, referral_link, video_link, row_data, bulk_image_level, faq_data} = req;

      // const requiredKeys = Object.keys({ category_id, lead_name, specification, description });
    
      // if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      // }
    
      try {
        //return filesName;
          let filePath = '';
          if (Array.isArray(fileNames)) {
            fileNames.forEach(filename => {
              if (filename.includes("marketing_image") === false) {
                filePath = filename;
              }
            });

          }
          const path ='/uploads/leads/';
          const lead_field_lebel = lead_name.replace(/\s+/g, '_').toLowerCase();

          const updateData = {
              lead_name,
              category_id,
              specification,
              description,
              lead_field_lebel,
              sequence,
              total_earning,
              distribution_amount,
              download_app_link,
              open_now_link,
              referral_link,
              video_link
          };

          if (filePath !== '') {
            updateData.img = path + filePath;
          }
    
          const updateLeads = await this.db.leads.UpdateData(updateData, [{'id': lead_id }],  {
                validate: true,
                transaction: t,
                logging: sql => logger.info(sql),
          });

          
          const tableData = JSON.parse(row_data);
          let detailsflag = 0;
          if(tableData.tableData && updateLeads){

            await this.db.leadsDetails.update(
              { status:0 },
              { where: { status:1,lead_header_id:lead_id, category_id:category_id, lead_detail_group:'Details' }, t }
            );
            
            for(const data of tableData.tableData)
            {
              const dataToInsert = {
                'category_id': category_id,
                'lead_header_id': lead_id,
                'lead_value': data.name,
                'description': data.description,
                'lead_detail_group': 'Details'
              }
              
              const request = await this.db.leadsDetails.insertData(dataToInsert, {
                validate: true,
                transaction: t,
                logging: sql => logger.info(sql),
              });
              if(request)
              {
                detailsflag = 1;
              }
              
            }
          }

          const imageArr = [];
          for (const filename of fileNames) {
            if (filename.includes("marketing_image")) {
              imageArr.push(path+filename);
            }
          }

          const marketingData = bulk_image_level;
          let marketingflag = 0;
          if(marketingData && marketingData.length > 0 && lead_id && imageArr){

            
            for (let i = 0; i < marketingData.length; i++) {

              const dataToInsert = {
                'category_id': category_id,
                'lead_header_id': lead_id,
                'lead_value': marketingData[i],
                'image': imageArr[i],
                'lead_detail_group': 'Marketing'
              }
              
              const request = await this.db.leadsDetails.insertData(dataToInsert, {
                validate: true,
                transaction: t,
                logging: sql => logger.info(sql),
              });
              if(request)
              {
                marketingflag = 1;
              }
            }

          }

          const faqData = JSON.parse(faq_data);
          let faqflag = 0;
          if(faqData.tableData && faqData.tableData.length > 0 && updateLeads){

            await this.db.faqs.update(
              { status:0 },
              { where: { status:1,lead_id:lead_id, category_id:category_id }, t }
            );

            for(const data of faqData.tableData)
            {
              const dataToInsert = {
                'category_id': category_id,
                'lead_id': lead_id,
                'question': data.question,
                'answer': data.answer
              }
              
              const request = await this.db.faqs.insertData(dataToInsert, {
                validate: true,
                transaction: t,
                logging: sql => logger.info(sql),
              });
              if(request)
              {
                faqflag = 1;
              }
              
            }
          }
          if(updateLeads)
          {
            await t.commit();
            return res.status(201).json({ status: 201, message: 'Product updated successfully', data: updateLeads });
          }else{
            await t.rollback();
            return res.status(500).json({ status: 500, error: 'Somthing went wrong' });
          }

      } catch (error) {
        await t.rollback();
        logger.error(`Error in update Product: ${error}`);
    
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500, errors: validationErrors });
        }
    
        return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
      }

    }
    
    async updateLeadStatus(req, res) {
      const {lead_id, action, status} = req;
      const requiredKeys = Object.keys({ lead_id,action,status});

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


          const updatedLeadStatus = await this.db.leads.UpdateData(data, {id: lead_id});

          if (updatedLeadStatus > 0) {
            return res.status(200).json({ status: 200, message: 'Product Updated Successful.'});
          } else {
            return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
          }

      } catch (error) {
        logger.error(`Unable to find Product: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500,errors: validationErrors });
      }

      return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
    
    async lead_user_action(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id, lead_id, category_id, action} = decryptedObject;
      const requiredKeys = Object.keys({ user_id, lead_id, category_id, action });

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      try {


          const dataToInsert = {
            'user_id': user_id,
            'lead_id': lead_id,
            'category_id': category_id,
            'action': action.toLowerCase(),
            'created_by': user_id,
            'remarks':`In process - we are working on this lead. Next status will update soon`
          }
          
          const result = await this.db.leadUserAction.insertData(dataToInsert);


          if (result) {
              return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Action Updated Successful.'}))); 
            //return res.status(200).json({ status: 200, message: 'Action Updated Successful.'});
          } else {
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] }))); 
            //return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
          }

      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          //const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Internal Server Error', data: [] }))); 
          //return res.status(500).json({ status: 500,errors: validationErrors });
        }

        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] }))); 
        //return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }


    async getLeadUserActionReport( req, res) {

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
        const result = await this.db.viewLeadUserAction.getAllData(whereCondition);
        
        const report={
          total_count : await this.db.viewLeadUserAction.count( { where: {...whereCondition} }, 'id'  ),
          total_accept : await this.db.viewLeadUserAction.count(  {  where:{ ...whereCondition, status:`2` } }  ),
          total_pending : await this.db.viewLeadUserAction.count( {  where:{ ...whereCondition, status:`1` } }),
          total_hold : await this.db.viewLeadUserAction.count( {  where:{ ...whereCondition, status:`3` } }),
          total_reject : await this.db.viewLeadUserAction.count( {  where:{ ...whereCondition, status:`4` } }),
         total_distributed_amount : await this.db.viewLeadUserAction.sum(  'distributed_amount', { where: whereCondition }),

      }
  
        return res.status(200).json({ status: 200,  message:'success', data : result, report });
       
  
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
          
            return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
          
    }

    async updateLeadUserAction(req, res) {
      const {user_action_id, action, status, distribd_amount} = req;
      const requiredKeys = Object.keys({ user_action_id, action, status, distribd_amount});

      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
      

      try {
          const env = config.env;
          const currentDate = new Date();
          const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

          
            let remarks="";
              if(status==1){
                remarks="In process - we are working on this lead. Next status will update soon";
              }
              else if(status==2){
                remarks="In Accepted - Your lead is approved successfully";
              }
              else if(status==3){
                remarks="In Hold - Your lead is in hold.";
              }
              else if(status==4){
                remarks="In Rejected - Your lead is rejected. Take follow-up with Customer and Enter this lead gain";
              }
          
          
          const data =  {         
            status,
            remarks:remarks,
            modified_on:created_on,
            distributed_amount: distribd_amount?distribd_amount:null
          };
            

          const getLeadActionData = await this.db.viewLeadUserAction.getDataById(user_action_id);
          
          if(getLeadActionData)
          {
            

              if(action == 'Accept' && status == '2' && distribd_amount > 0)
              {
                const user_id = getLeadActionData.user_id;
                const lead_id = getLeadActionData.lead_id;
                const category_id = getLeadActionData.category_id;
                const category_name = getLeadActionData.category_name;
                await this.rePurchaseIncome(env, user_id, distribd_amount, 0, lead_id, category_id, category_name );
              
                }
                
            
            const updatedLeadUserStatus = await this.db.leadUserAction.UpdateData(data, {id: user_action_id});
            
          
            return res.status(200).json({ status: 200, message: 'User Action Updated Successful.'});
            
          }else{
            return res.status(500).json({ status: 500, message: 'wrong credentials', data: [] });
          }

      } catch (error) {
        logger.error(`Unable to find Product: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500,errors: validationErrors });
      }

      return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }

     async rePurchaseIncome(env, user_id,  amount, ipAddress, lead_id, category_id, category_name  )
    {
      try {

        
        let sub_type = 'Leads Income';
        const user_repurchase_amount = ((amount*50/100)/15).toFixed(2)
        const user_distribute_amount = (amount*50/100).toFixed(2);
        
        const referrals = await this.db.referral_idslevel.getShoppingRefralUser(user_id);
        let date = new Date();
        
        
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
           
          let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);
          let credit_amount = (referral.id==0)? user_distribute_amount :user_repurchase_amount;
          let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
        
            
          if(referral.ref_userid>0 && user_repurchase_amount>0)
          {
            const order_id=utility.generateUniqueNumeric(7);
            const orderData = {
                user_id:referral.ref_userid,
                env:env, 
                tran_type:'Credit',
                tran_sub_type:'Leads Repurchase',
                tran_for:'Repurchase',
                trans_amount:credit_amount,
                currency:'INR',
                order_id,
                order_status:'SUCCESS',
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
                        opening_balance: opening_balance,
                        credit: credit_amount,
                        debit:0,
                        closing_balance: closing_balance,
                        tran_for: 'Repurchase', 
                        created_by:user_id,
                        details: sub_type + ' Repurchase(' +amount+ ')',
                        sender_id: user_id,
                        level: referral.level,
                        plan_id:5
                        };
                    const result = await this.db.ReferralIncome.insert(refralData);
       
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


    // async rePurchaseIncome(env, user_id, amount, ipAddress, lead_id,category_id,category_name )
    // {
    //   try {

        
    //     let sub_type = category_name;
    //     // const getUserActionCount = await this.db.leadUserAction.getUserCount(user_id);
        
    //     // const uptoLevel = parseInt(getUserActionCount) + 1;
        
        
    //     const where = { id: user_id };
    //     const Attr = ['first_name', 'last_name', 'mlm_id', 'user_status'];
    //     const userData = await this.db.user.getData(Attr, where);
        
    //     let scheme = 1;
    //     if(userData.user_status == 'Active'){scheme = 2;}
        
    //     const referrals = await this.db.referral_idslevel.getMemberIdsScheme(user_id, scheme);
        
    //     let date = new Date();
    //     const newRow = {
    //       id: '0',
    //       user_id: user_id,
    //       ref_userid: user_id,
    //       mlm_id: userData.mlm_id,
    //       level: 0,
    //       status: 1,
    //       created_on: utility.formatDate(date),
    //     };
    //     referrals.push(newRow);
        
    //     let results = [];
    //     for (const referral of referrals) {
    //         let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);

    //         let credit_amount = 0;
    //         if(referral.level > 0)
    //         {
    //           const ObjAttr = ['scheme1', 'scheme2', 'level'];
    //           const ObjWhre = { level: referral.level<=20?referral.level:21 };
    //           let SchemePercentage = await this.db.SchemeLevel.getSchemePercentage(ObjAttr, ObjWhre);
    //           //return SchemePercentage;
    //           if(scheme == 1)
    //           {
    //               credit_amount = (amount*SchemePercentage.scheme1/100).toFixed(2);
    //           }else{
    //               credit_amount = (amount*SchemePercentage.scheme2/100).toFixed(2);
    //           }
              
                
    //         }else{
    //           credit_amount = (amount*10/100).toFixed(2);
    //         }    

            
    //         let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
            
    //       if(referral.ref_userid>0 && credit_amount>0)
    //       {
    //         const order_id=utility.generateUniqueNumeric(7);
    //         const orderData = {
    //             user_id:referral.ref_userid,
    //             env:env, 
    //             tran_type:'Credit',
    //             tran_sub_type:'Services Repurchase',
    //             tran_for:'Repurchase',
    //             trans_amount:credit_amount,
    //             currency:'INR',
    //             order_id,
    //             order_status:'SUCCESS',
    //             created_on:Date.now(),
    //             created_by:user_id,
    //             ip_address:ipAddress
    //         };
              
    //         const generateorder = await this.db.upi_order.insertData(orderData); 
           

    //         if(generateorder){
    //             const newLevel = parseInt(referral.level)+1;
    //             let plan = 'P1';
    //             if(scheme > 1){plan = 'P2'}
    //           const refralData = {
    //               user_id:referral.ref_userid,
    //               transaction_id: order_id,
    //               env: env, 
    //               type: 'Credit', 
    //               sub_type: sub_type, 
    //               opening_balance: opening_balance,
    //               credit: credit_amount,
    //               debit:0,
    //               closing_balance: closing_balance,
    //               tran_for: 'Repurchase', 
    //               created_by:user_id,
    //               details: `Received from (Level ${newLevel}) (${plan}) ${userData.mlm_id} (${userData.first_name})`,
    //               sender_id: user_id,
    //               level: newLevel,
    //               plan_id:5,
    //               lead_id:lead_id,
    //               lead_category_id:category_id,
    //               wallet_type:(newLevel<=2)?'Active':'Passive'
    //           };
    //           const result = await this.db.ReferralIncome.insert(refralData);
    //           results.push(result);
    //         }
    //       }
          
    //     }
    //     return results;

    //   } catch (error) {
    //     console.error(error.message);
    //     return  {'status': false};
    // }
    // }
    
    
    // async rePurchaseIncomeSchem2(env, user_id, amount, ipAddress )
    // {
    //   try {

        
    //     let sub_type = 'Services';
    //     const getUserActionCount = await this.db.leadUserAction.getUserCount(user_id);
        
    //     const scheme = parseInt(getUserActionCount) + 1;
    //     const referrals = await this.db.referral_idslevel.getMemberIdsScheme(user_id, scheme);
        
    //     //return referrals;
        
    //     const where = { id: user_id };
    //     const Attr = ['first_name', 'last_name', 'mlm_id'];
    //     const userData = await this.db.user.getData(Attr, where);
    //     let date = new Date();
    //     const newRow = {
    //       id: '0',
    //       user_id: user_id,
    //       ref_userid: user_id,
    //       mlm_id: userData.mlm_id,
    //       level: 0,
    //       status: 1,
    //       created_on: utility.formatDate(date),
    //     };
    //     referrals.push(newRow);
        
    //     let results = [];
    //     for (const referral of referrals) {
    //         let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);

    //         let credit_amount = 0;
    //         if(referral.level > 0)
    //         {
    //           const ObjAttr = ['scheme1', 'scheme2', 'level'];
    //           const ObjWhre = { level: referral.level<=20?referral.level:21 };
    //           let SchemePercentage = await this.db.SchemeLevel.getSchemePercentage(ObjAttr, ObjWhre);
    //           //return SchemePercentage;
    //           credit_amount = (amount*SchemePercentage.scheme2/100).toFixed(2);
                
    //         }else{
    //           credit_amount = (amount*10/100).toFixed(2);
    //         }    

            
    //         let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
            
    //       if(referral.ref_userid>0 && credit_amount>0)
    //       {
    //         const order_id=utility.generateUniqueNumeric(7);
    //         const orderData = {
    //             user_id:referral.ref_userid,
    //             env:env, 
    //             tran_type:'Credit',
    //             tran_sub_type:'Services Repurchase',
    //             tran_for:'Repurchase',
    //             trans_amount:credit_amount,
    //             currency:'INR',
    //             order_id,
    //             order_status:'SUCCESS',
    //             created_on:Date.now(),
    //             created_by:user_id,
    //             ip_address:ipAddress
    //         };
              
    //         const generateorder = await this.db.upi_order.insertData(orderData); 
           

    //         if(generateorder){
    //             const newLevel = parseInt(referral.level)+1;
    //           const refralData = {
    //               user_id:referral.ref_userid,
    //               transaction_id: order_id,
    //               env: env, 
    //               type: 'Credit', 
    //               sub_type: sub_type, 
    //               opening_balance: opening_balance,
    //               credit: credit_amount,
    //               debit:0,
    //               closing_balance: closing_balance,
    //               tran_for: 'Repurchase', 
    //               created_by:user_id,
    //               details: `${sub_type} Repurchase Level Income ${newLevel} Received From ${userData.first_name} ${userData.last_name} (${userData.mlm_id})`,
    //               sender_id: user_id,
    //               level: newLevel,
    //               plan_id:5
    //           };
    //           const result = await this.db.ReferralIncome.insert(refralData);
    //           results.push(result);
    //         }
    //       }
          
    //     }
    //     return results;

    //   } catch (error) {
    //     console.error(error.message);
    //     return  {'status': false};
    // }
    // }

        async getLeadDetailsReport( req, res) {

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
            const result = await this.db.viewLeadsDetails.getAllData(whereCondition);
          
            const leadResult = [];

            for (const item of result) {
                
              leadResult.push({
               
                ...item.dataValues,
                image: item.image === null ? '' : baseurl+ item.image,
              });
            }

            return res.status(200).json({ status: 200,  message:'success', data : leadResult });
          

            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json({ status: 500,errors: validationErrors });
                }
              
                return res.status(500).json({ status: 500,  message: error ,data:[]});
            }
              
        }

    
          
/******************************************API'S FOR Lead TRACK USER DETAILS*******************************************************/

    async getLeadTrackDetails(req,res) {
                    
      let t;
         const decryptedObject = utility.DataDecrypt(req.encReq);
      const { userId } = decryptedObject;

      const requiredKeys = Object.keys({ userId });

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
           return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys }))); 
        // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      try {
       
        const whereChk={id:userId};
        const UserAttribute=['id','first_name','last_name','mobile'];
        const userRow = await this.db.user.getData(UserAttribute,whereChk);
        
          let date = new Date();
          let created_on = utility.formatDate(date);
          

          const insuarnceData = {
              user_id:userId,
              created_by:userId
          };
          

          const newInsuarance= await this.db.lead_user_track.insertData(insuarnceData);

          
             return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Create Lead successfully', data: newInsuarance })));
        //   return res.status(200).json({ status: 200, message: 'Create Lead successfully', data: newInsuarance });

        }
        catch (err) {
                logger.error(`Unable to find Lead: ${err}`);
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            // return res.status(500).json({ status: 500,errors: validationErrors });
          }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
        //   return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }

      }


      async getLeadTrackDetailsReport(req,res) {
                
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
                const result = await this.db.lead_user_track.getLeadsDetails(whereCondition);

               

                const leadTrackResult = [];

                for (const item of result) {

                  const whereChk={id:item.user_id};
                  const UserAttribute=['id','first_name','last_name','mobile','mlm_id','email'];
                  const userRow = await this.db.user.getData(UserAttribute,whereChk);
              
                  leadTrackResult.push({
                      first_name: userRow.first_name,
                      last_name: userRow.last_name,
                      mobile:userRow.mobile,
                      mlm_id:userRow.mlm_id,
                      email:userRow.email,
                      ...item.dataValues,
                
                  });
                }

                return res.status(200).json({ status: 200,  message:'success', data : leadTrackResult });
              
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



        

async updateLeadsStatus(req, res) {

      const {id,note,status} = req;

      const requiredKeys = Object.keys({ id,note,status});   
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      let t;

      try {
          
        if(note==null || note==''){
            note='Approve';
        }

          const currentDate = new Date();
          const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
          
            const updatedMoneyStatus = await this.db.lead_user_track.updateData(
                      {
                        rejection_reason:note,
                        status,
                        modified_on:created_on
                      },
                      
                      {id:id}
                      
                    );
                      
                    if (updatedMoneyStatus) {
                      return res.status(200).json({ status: 200, message: 'Lead Updated Successful.'});
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
            




/******************************************API'S FOR LEADS TRACK USER DETAILS*******************************************************/


    async pendingLeads( req, res) {
        
        const decryptedObject = utility.DataDecrypt(req.encReq);
      const { user_id, team, page } = decryptedObject; 
     

      const requiredKeys = Object.keys({ user_id, team, page});

      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys }))); 
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

  
        try {

          const pages = parseInt(page) || 1;
          const limit = 10; 
          const offset = (pages - 1) * limit; 
          let returnData = [];
         
          if(team == 'Pending')
          {
              
              

            const [results, metadata] =await this.db.sequelize.query(`SELECT
                u.id,
              u.mlm_id,
              u.first_name,
              CONCAT(u.first_name,' ',u.last_name) as name,
              u.mobile,
              DATE_FORMAT(u.created_on, '%d-%m-%Y') AS joining_date,
              COALESCE(td.total_distribution*50/100, 0) as expected_earning,
              ld.lead_name,
              ld.category_name,
              ld.parent_category_name,
              ldrm.remarks
            
            FROM
                tbl_referral_idslevel ul
                join tbl_app_users as u on ul.user_id=u.id and u.status=1
                left join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id
                left join view_leads_user_action ld on td.mxid=ld.id
                left join (select max(id) as mxid, user_id from log_user_lead_remarks where status=1 group by user_id) max_remarks on max_remarks.user_id=ul.user_id
                left join log_user_lead_remarks as ldrm on max_remarks.mxid=ldrm.id
                WHERE ul.status=1
                and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1
                order by u.created_on desc LIMIT :limit OFFSET :offset`,
            {
                
              replacements:{ limit,offset },
              
            });

            returnData = results;
          }
          
          if(team == 'Authorized')
          {

            const [results, metadata] =await this.db.sequelize.query(`SELECT
                u.id,
              u.mlm_id,
              u.first_name,
              CONCAT(u.first_name,' ',u.last_name) as name,
              u.mobile,
              DATE_FORMAT(u.created_on, '%d-%m-%Y') AS joining_date,
              COALESCE(td.total_distribution*50/100, 2) as expected_earning,
              ld.lead_name,
              ld.category_name,
              ld.parent_category_name
            
            FROM
                tbl_referral_idslevel ul
                JOIN tbl_app_users u on ul.user_id=u.id and u.status=1
                left join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id and td.total_distribution>=500
                left join view_leads_user_action ld on td.mxid=ld.id
                WHERE  ul.status=1 
                and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1
                order by u.created_on desc LIMIT :limit OFFSET :offset`,
            {
                
              replacements:{ limit,offset },
              
            });

            returnData = results
            
          }

          if(team == 'Unathrized')
          {

            const [results, metadata] =await this.db.sequelize.query(`SELECT
              ld.mlm_id,
              ld.first_name,
              CONCAT(ld.first_name,' ',ld.last_name) as name,
              ld.mobile,
              DATE_FORMAT(tbl_app_users.created_on, '%d-%m-%Y') AS joining_date,
              COALESCE(earning.total_earning, 0) as total_earning,
              COALESCE(td.total_distribution, 0) as distributed_amount,
              ld.lead_name,
              ld.category_name,
              ld.parent_category_name
            
            FROM
                tbl_referral_idslevel ul
                join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id
                join view_leads_user_action ld on td.mxid=ld.id
                join tbl_app_users on ld.user_id=tbl_app_users.id
                left join (
                    SELECT 
                        user_id,
                        COALESCE(SUM(credit), 0) AS total_earning
                    FROM 
                        trans_referral_income
                    WHERE 
                        status = 1
                    GROUP BY 
                        user_id
                ) AS earning ON ld.user_id = earning.user_id
                WHERE  level = 1 and ul.status=1 and td.total_distribution<500
                and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1
                order by tbl_app_users.created_on desc LIMIT :limit OFFSET :offset`,
            {
                
              replacements:{ limit,offset },
              
            });

            returnData = results
            
          }
          
          const total_counts = await this.total_header_count(user_id, team);
  
       //return res.status(200).json({ status: 200,  message:'success', data : returnData, total_counts:total_counts });
       return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'success', data : returnData, total_counts:total_counts }))); 
  
        } catch (error) {
            logger.error(`Unable to find user: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              //const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' }))); 
              //return res.status(500).json({ status: 500,errors: validationErrors });
            }
          
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]}))); 
            //return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
          
    }
    
    
    async total_header_count(user_id, team) {

        if(team == 'Pending')
        {
          return await this.db.sequelize.query (
              `SELECT
                  count(u.id) as pending_count,
                  COALESCE(sum(ld.distribution_amount*50/100), 0) as total_expected_earning,
                    0 as total_remarks_not_added,
                    0 as total_remarks_added
              FROM
                  tbl_referral_idslevel ul
                  join tbl_app_users as u on ul.user_id=u.id and u.user_status!='Active' and u.status=1
                  left join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id
                  left join view_leads_user_action ld on td.mxid=ld.id
                  WHERE ul.status=1
                  and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1`,
              { type: QueryTypes.SELECT }
          )
          .then(result => {
              if (result.length > 0) {
                  const row = result[0];
                  return row;
              } else {
                  return 0;
              }
          })
        }
    
        if(team == 'Authorized')
        {
          return await this.db.sequelize.query (
              `SELECT
              count(u.id) as authorize_count,
            COALESCE(sum(earning.total_earning), 0) as total_earning
          
          FROM
              tbl_referral_idslevel ul
              JOIN tbl_app_users u on ul.user_id=u.id and u.user_status='Active' and u.status=1
              left join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id and td.total_distribution>=500
              left join view_leads_user_action ld on td.mxid=ld.id
              left join (
                SELECT 
                    user_id,
                    COALESCE(SUM(credit), 0) AS total_earning
                FROM 
                    trans_referral_income
                WHERE 
                    status = 1
                GROUP BY 
                    user_id
            ) AS earning ON ld.user_id = earning.user_id
              WHERE  ul.status=1 
              and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1`,
            { type: QueryTypes.SELECT }
        )
        .then(result => {
            if (result.length > 0) {
                const row = result[0];
                return row;
            } else {
                return 0;
            }
        })
        }
        if(team == 'Unathrized')
        {
          return await this.db.sequelize.query (
              `select count(ld.id) as total_unanthorize,
              COALESCE(sum(earning.total_earning),0) as total_earning
              FROM
                  tbl_referral_idslevel ul
                  join (select max(id) as mxid,sum(distributed_amount) as total_distribution, user_id from tbl_leads_user_action where action='register' and status=2 group by user_id) td on td.user_id=ul.user_id
                  join view_leads_user_action ld on td.mxid=ld.id
                  join tbl_app_users on ld.user_id=tbl_app_users.id
                  left join (
                      SELECT 
                          user_id,
                          COALESCE(SUM(credit), 0) AS total_earning
                      FROM 
                          trans_referral_income
                      WHERE 
                          status = 1
                      GROUP BY 
                          user_id
                  ) AS earning ON ld.user_id = earning.user_id
                  WHERE  level = 1 and ul.status=1 and td.total_distribution<500
                  and ul.ref_userid=${user_id} and ul.level=1 and ul.status=1`,
              { type: QueryTypes.SELECT }
          )
          .then(result => {
              if (result.length > 0) {
                  const row = result[0];
                  return row;
              } else {
                  return 0;
              }
          })
        }

    }
    
    
    async userform(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, lead_id, category_id, input_params } = decryptedObject;
        const requiredKeys = Object.keys({ user_id, lead_id, category_id, input_params });
    
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
          //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
          return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys }))); 
        }
    
    
        try {
          const whereChk={id:user_id};
          const UserAttribute=['first_name','last_name','mobile', 'mlm_id'];
          const userRow = await this.db.user.getData(UserAttribute,whereChk);
          //const input_params = {"input":[{"paramName":"Consumer No","paramValue":"160240233379"},{"paramName":"BU","paramValue":"4637"}]}
          
          const inputData = {
            user_id: user_id,
            lead_id: lead_id,
            category_id: category_id,
            description: `Form filled by ${userRow.first_name} ${userRow.last_name}(${userRow.mlm_id})`
    
          };
        const result = await this.db.userForm.insertData(inputData);
        if(result)
        {
    
          let jsonArray = input_params.input;
          if (!Array.isArray(jsonArray)) {
              jsonArray = [jsonArray];
          }
          
          for(const item of jsonArray)
          {
    
              const details = await this.db.userFormDetails.insertData({
                user_form_id: result.id,
                field_header: item.name,
                field_value: item.value,
                data_type: item.type
              });
              
          } 
    
          //return res.status(200).json({ status: 200, message: 'Form submited Successfully.'});
          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Form submited Successfully.'}))); 
        }else{
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Somthing went wrong.'})));
          //return res.status(200).json({ status: 200, message: 'Somthing went wrong.'});
        }
            
    
        } catch (error) {
          logger.error(`Unable to find Product: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Somthing went wrong.'})));
          //return res.status(500).json({ status: 500,errors: validationErrors });
        }
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));
        //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
      }
      
      
        async leadsHistory( req, res) {
        
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { user_id, filter } = decryptedObject; 
            const requiredKeys = Object.keys({ user_id, filter });
    
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys }))); 
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
            
            
            let lead_status;
            if(filter !='All')
            {
                lead_status = {'lead_status': filter};
            }
            try {
                const leadTrackResult = [];
                 const whereCondition = {
                    user_id,
                    ...lead_status
                }
               
                const results = await this.db.viewLeadUserAction.getAllData(whereCondition);
                
                 if(results){
                        for (const item of results) {
                              const whereChk={user_id:item.user_id,lead_id:item.lead_id,category_id:item.category_id};
                              const userFormRow = await this.db.userForm.getFormData(whereChk);
                              const userFormRowDetails = await this.db.userFormDetails.getDataById(userFormRow.id);
                          
                              leadTrackResult.push({
                              
                                  ...item.dataValues,
                                  leadFormDetails: userFormRowDetails.dataValues,
                            
                              });
                        }
                }



                const whereCondition1 = {
                    user_id,
                    sub_type:'Leads Income'
                  }
                const total_paid_amount = await this.db.ReferralIncome.getEarningAmount(whereCondition1);
                   const whereCondition2 = {
                        user_id,
                        sub_type:'Leads Income'
                      }
                const totalPendingAmount = await this.db.holdIncome.getEarningAmount(whereCondition2);
                const pending_income=totalPendingAmount? totalPendingAmount:0;
                
                const total_earning = total_paid_amount + pending_income ;
                 
                if(leadTrackResult){
                    //   return res.status(200).json({ status: 200,  message:'success', data : results });
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message:'success',totalPaidAmount:total_paid_amount,totalPendingAmount:pending_income,total_earning:total_earning, data : leadTrackResult }))); 
                }else{
                      // return res.status(200).json({ status: 200,  message:'success', data : results });
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'No Record Found',data : [] }))); 
                }
               
      
            } catch (error) {
                logger.error(`Unable to find user: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                  //const validationErrors = error.errors.map((err) => err.message);
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error', data: validationErrors }))); 
                 //return res.status(500).json({ status: 500,errors: 'Internal Server Error', data: validationErrors });
                }
              
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]}))); 
                //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
            }
          
    }
    
    
     async LeadsEarningHistory( req, res) {
        
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, StatusFlag, page } = decryptedObject; 
        
      try {
          
         const requiredKeys = Object.keys({ user_id, StatusFlag});

            let returnData = [];
            let status = 0;

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
                  returnData = await paginate(this.db.viewLeadUserAction, {
                    whereClause,
                    page,
                    order: [['created_on', 'DESC']],
                  });

            }else{
                  const whereClause = {
                    'user_id': user_id,
                    'status': status
                  }

                   returnData = await paginate(this.db.viewLeadUserAction, {
                  whereClause,
                  page,
                  order: [['created_on', 'DESC']],
                  });
            }

         
        
            const whereCondition1 = {
                    user_id,
                    sub_type:'Leads Income'
                  }
            const total_paid_amount = await this.db.ReferralIncome.getEarningAmount(whereCondition1);
               const whereCondition2 = {
                    user_id,
                    sub_type:'Leads Income'
                  }
            const totalPendingAmount = await this.db.holdIncome.getEarningAmount(whereCondition2);
            const pending_income=totalPendingAmount? totalPendingAmount:0;
            
            const total_earning = total_paid_amount + pending_income ;
               
        if(returnData){
        //   return res.status(200).json({ status: 200,  message:'Records Found', data : returnData });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'Record Found', data : returnData,totalPaidAmount:total_paid_amount,totalPendingAmount:pending_income,total_earning:total_earning})));   
        }else{
        //   return res.status(200).json({ status: 200,  message:'Not Found', data : [] });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message:'Not found', data : [], }))); 
        }
       
      } catch (error) {
          logger.error(`Unable to find user: ${error}`);
          if (error.name === 'SequelizeValidationError') {
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' }))); 
            // return res.status(500).json({ status: 500,errors: validationErrors });
          }
        
           return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]}))); 
        //   return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
    }
  
  
    async  getUserformReport(req, res) {
        
        const { from_date, to_date} = req;
        
        const requiredKeys = Object.keys({ from_date, to_date});
                  
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
    
        try {
            const fromDate = new Date(from_date);
            const toDate = new Date(to_date);
            fromDate.setHours(0, 0, 0);
            toDate.setHours(23, 59, 59);
    
            const whereCondition = {
              created_on: {
                [Op.between]: [fromDate, toDate]
              }
            };
    
            const results = await this.db.viewUserForm.getAllData(whereCondition);
    
            if(results !==null){
                return res.status(200).json({ status: 200, message:'Successfully all record found', data: results });
            }
        
            return res.status(400).json({ status: 400, message:'Record not found',data:[] });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: 'Internal Sever Error',data:validationErrors });
            }
          
            return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
    
    
        
            
            
    
    }
    
    
    async  getUserformData(req, res) {
            
      const { form_id } = req;
      
      const requiredKeys = Object.keys({ form_id });
                
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
    
      try {
    
    
    
          const whereCondition = {
            user_form_id: form_id
          };
          const formData = await this.db.viewUserForm.getDataById(form_id);
          const formDetailsData = await this.db.userFormDetails.getDataWithClause(whereCondition);
    
          formData.dataValues.details = formDetailsData;
    
          if(formData !==null){
              return res.status(200).json({ status: 200, message:'Successfully all record found', data: formData });
          }
      
          return res.status(400).json({ status: 400, message:'Record not found',data:[] });
      } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: 'Internal Sever Error',data:validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
    
    
      
          
          
    
    }




}




module.exports = new Lead();