const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility'); 
const path = require('path');
require('dotenv').config();
const { paginate } = require('../../utility/pagination.utility'); 

class Graphics {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async getGraphicsCategory(req,res) {
	  
        try {
           
            let graphicsCategories = await this.db.graphicsCategory.getGraphicsCategoryWithCondition();
          
            const graphicsResult= graphicsCategories.map((item) => ({
                
                id: item.id,
                image: baseurl+item.image,
                description: item.description,
                category: item.category_name,
                created_on:item.banner_date,
                status:item.status,

              }));
              
                let whereCondition='';
                whereCondition = {
                  'category_id': 17,
                  'status':1
                }
                let graphicsTodaysStatus = await this.db.graphics.getGraphics(whereCondition);

              if (graphicsResult.length > 0) {
                //   return res.status(200).json({ status: 200, message: 'Category Found', data: graphicsResult });
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: graphicsResult,todaysStatus: graphicsTodaysStatus })));
                
              } else {
                //   return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
                  return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
                
              
              }
              
            
          }
        catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			}
    			return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			 
            }
	
        }


     
            async addGraphics(filename, req, res) {
                let t;
                
                const { category_id, graphics_name,cat_group } = req;
                
                const requiredKeys = Object.keys({ category_id, graphics_name,cat_group  });
              
                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
                  return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
              
                try {
                  const filePath = filename;
                  const path ='uploads/graphics/';
                  t = await this.db.sequelize.transaction();
                 
                    const Data = {
                        category_id,
                        graphics_name,
                        cat_group,
                        image:path+filePath,
                    };
              
                    const newGraphics = await this.db.graphics.insertData(Data, {
                      validate: true,
                      transaction: t,
                      logging: sql => logger.info(sql),
                    });
              
                    await t.commit();
              
                    return res.status(201).json({ status: 201, message: 'Graphics added successfully', data: newGraphics });
                  
                } catch (error) {
                  if (t) {
                    await t.rollback();
                  }
              
                  logger.error(`Error in add Graphics: ${error}`);
              
                  if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors: validationErrors });
                  }
              
                  return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
                }
              
           
          }  



        async getGraphics(req,res) {
               
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { category_id, user_id,page } = decryptedObject;
                
            const requiredKeys = Object.keys({ category_id, user_id });
        
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
        
    
                try {
                    // let whereCondition='';
                    //   whereCondition = {
        
                    //     'category_id': category_id,
                    //     'status':1
                    // }
                    
                     const whereClause = {'category_id': category_id, 'status':1}
                     const graphics = await paginate(this.db.graphics, {
                      whereClause,
                      page,
                    //   pageSize:5,
                      order: [['id', 'DESC']],
                    });
              
              
              
                    // let graphics = await this.db.graphics.getGraphics(whereCondition);
                    
                    //     const graphicsResult= graphics.map((item) => ({
                  
                    //                   id: item.id,
                    //                   image: baseurl + item.image,
                    //                   graphics_name: item.graphics_name,
                    //                   category: item.category_id,
                    //                   like_count: item.like_count,
                    //                   share_count: item.share_count,
                    //                   status: item.status,
                
                    //         }));

                    // let bannersByCategory = {};
                    // const catGroup = [];
                    
                    // for (const item of graphics) {
                    //     const graphicsId = item.id;
                    //     const cat_group = item.cat_group;
                    
                    //     if (!catGroup.includes(cat_group)) {
                    //         catGroup.push(cat_group);
                    //     }
                    
                    //     if (!bannersByCategory[cat_group]) {
                    //         bannersByCategory[cat_group] = [];
                    //     }
                        
                        
                    //     let islike = 0;
                    //     let isshare = 0;
                    //     let likecount = 0;
                    //     let sharecount = 0;
                        
                    //     const getLikeShare = await this.db.likeShare.getLikeAndShare(graphicsId, user_id);
                    //     if(getLikeShare != null)
                    //     {
                    //         islike = getLikeShare.is_like;
                    //         isshare = getLikeShare.is_share;
                    //         likecount = getLikeShare.like_count;
                    //         sharecount = getLikeShare.share_count;
                    //     }
                    
                    //     bannersByCategory[cat_group].push({
                    //         id: item.id,
                    //         image: baseurl + item.image,
                    //         graphics_name: item.graphics_name,
                    //         category: item.category_id,
                    //         total_like_count: item.like_count,
                    //         total_share_count: item.share_count,
                    //         like_count: likecount,
                    //         share_count: sharecount,
                    //         is_like: islike,
                    //         is_share: isshare,
                    //         status: item.status,
                    //     });
                    // }
                    
                    // const graphicsByCategory = catGroup.map((cat_group) => ({
                    //     cat_name: cat_group,
                    //     cat_data: bannersByCategory[cat_group],
                    // }));
        
        
                        if (graphics) {
                            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Graphics Found', data: graphics })));
                            //return res.status(200).json({ status: 200, message: 'Graphics Found', data: graphics });
                        
                        } else {
                            
                            return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Graphics Not Found', data: [] })));
                       
                        }
                
            
            }
        catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    //return res.status(500).json({ status: 500,errors: validationErrors });
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                   
                }
                 //return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                 
            }
    
        }
    


                 
          async updateLikeShareCount(req, res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const {id,action,user_id} = decryptedObject;
        
            const requiredKeys = Object.keys({ id, action, user_id });
                  
            if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
              
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            }
        
            let t;
        
            try {
              
                const like_count = (action === 'Like') ? 1 : 0;
                const share_count = (action === 'Share') ? 1 : 0;
        
               
                  const whereCondition = {
                        'id': id
                    }
                
                const graphics = await this.db.graphics.findOne({
                  where: whereCondition,
                });
                
                await this.db.likeShare.makeLikeAndShare(id, user_id, action);
        
                const likeCount= graphics.dataValues.like_count+like_count
                const shareCount= graphics.dataValues.share_count+share_count
        
        
                const currentDate = new Date();
                const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                
                const updatedStatus = await this.db.graphics.UpdateData(
                        {
                        
                          like_count:likeCount,
                          share_count:shareCount,
                          modified_on:created_on
                        },
                        
                        {id:id}
                        
                        );
                            
                        if (updatedStatus > 0) {
                             return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Graphics Updated Successful.'})));
                            
                        } else {
                             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
                            
                        }
                        
                    } catch (error) {
                        logger.error(`Unable to find Feedback: ${error}`);
                        if (error.name === 'SequelizeValidationError') {
                          const validationErrors = error.errors.map((err) => err.message);
                           return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                          
                        }
                       return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
                   
                    }
                  }
                  
                  
                  

          async graphicsList(req,res) {
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
                   status: 1
              }
                const result = await this.db.graphics.getAllData(whereCondition);
           
                const leadResult = [];
          
                for (const item of result) {
              
                  const categoryData = await this.db.graphicsCategory.getData(['category_name'], { id: item.category_id });
              
                  leadResult.push({
                    category_name: categoryData ? categoryData.category_name :'',
                
                    ...item.dataValues,
                    image: baseurl+item.image,
                  });
                }
      
      
      
      
              return res.status(200).json({ status: 200,  message:'success', data : leadResult });
              
              }
            catch (err) {
                    logger.error(`Unable to find Banner: ${err}`);
              if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors: validationErrors });
              }
               return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }
      
            }
            
            
            
            
    async updateGraphicsStatus(req, res) {
        
        const {id,action,status,note} = req;

        const requiredKeys = Object.keys({ id,status});
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        let t;

        try {
            const currentDate = new Date();
            const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    
            const updatedStatus = await this.db.graphics.UpdateData(
                {
                  status,
                  modified_on:modified_on
                },
                
                {id:id}
                
              );
                
              if (updatedStatus > 0) {
                return res.status(200).json({ status: 200, message: 'Graphics Updated Successful.'});
              } else {
                return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
              }
            
        } catch (error) {
            logger.error(`Unable to find Category: ${error}`);
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors: validationErrors });
            }
          
            return res.status(500).json({ status: 500,  message: error ,data:[]});
        }
      }
      
      
       async getGraphicsCategorywise(req,res) {
               
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { category_id, user_id ,page} = decryptedObject;
            
        const requiredKeys = Object.keys({ user_id ,page});
    
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
    

            try {
                // let whereCondition='';
                //   whereCondition = {
    
                //     'category_id': category_id,
                //     'status':1
                // }
                // let graphics = await this.db.graphics.getGraphics(whereCondition);
                //const whereClause = {'category_id': category_id, 'status':1}
                let whereClause = '';
                if(category_id!=null && category_id>0)
                {
                    whereClause = {'category_id': category_id}
                }
                const graphics = await this.db.graphics.findAll({
                  where: {'status': 1,...whereClause},
                  order: [['id', 'DESC']],
                });
                
                let bannersByCategory = {};
                const catGroup = [];
                
                for (const item of graphics) {
                  const graphicsId = item.id;
                  const cat_group = item.cat_group;
                
                  if (!catGroup.includes(cat_group)) {
                    catGroup.push(cat_group);
                  }
                
                  if (!bannersByCategory[cat_group]) {
                    bannersByCategory[cat_group] = [];
                  }
                
                  let islike = 0;
                  let isshare = 0;
                  let likecount = 0;
                  let sharecount = 0;
                
                  const getLikeShare = await this.db.likeShare.getLikeAndShare(graphicsId, user_id);
                  if(getLikeShare != null) {
                    islike = getLikeShare.is_like;
                    isshare = getLikeShare.is_share;
                    likecount = getLikeShare.like_count;
                    sharecount = getLikeShare.share_count;
                  }
                
                  bannersByCategory[cat_group].push({
                    id: item.id,
                    image: baseurl + item.image,
                    graphics_name: item.graphics_name,
                    category: item.category_id,
                    total_like_count: item.like_count,
                    total_share_count: item.share_count,
                    like_count: likecount,
                    share_count: sharecount,
                    is_like: islike,
                    is_share: isshare,
                    status: item.status,
                  });
                }
                
                // Modify bannersByCategory to include only the first 10 records for each category
                const graphicsByCategory = catGroup.map((cat_group) => ({
                  cat_name: cat_group,
                  cat_data: bannersByCategory[cat_group].slice(0, 5), // Include only the first 10 records
                }));
    
    
                    if (graphicsByCategory) {
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Graphics Found', data: graphicsByCategory })));
                        //return res.status(200).json({ status: 200, message: 'Graphics Found', data: graphicsByCategory });
                    
                    } else {
                         //return res.status(401).json({ status: 401, token: '', message: 'Graphics Not Found', data: [] });
                        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Graphics Not Found', data: [] })));
                   
                    }
            
        
        }
    catch (err) {
            logger.error(`Unable to find Banner: ${err}`);
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                //return res.status(500).json({ status: 500,errors: validationErrors });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
               
            }
             //return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
             
        }

    }
          
        

          
              


}




module.exports = new Graphics();