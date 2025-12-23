const { connect,baseurl,config  } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class Ebook {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	

        async getEbookList(req,res) {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const {category_id,page, user_id} = decryptedObject;
            
            const requiredKeys = Object.keys({ page });
            
            //   if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            //     // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            //   }
            
            let result = [];
          try {
              
                    let whereClause = {status:1}
                    if(user_id && user_id>0)
                    {
                      whereClause = {...whereClause, created_by: user_id}
                    }
                    
                    if(!category_id) {
                     
                        result = await paginate(this.db.view_ebook_list, {
                            whereClause,
                            page,
                            order: [['id', 'ASC']],
                        });
                        
                    }else{
                        //result = await this.db.view_ebook_list.getAllData({category:category_id, ...whereClause});
                        whereClause = {...whereClause, category:category_id}
                        const ebooklist = await paginate(this.db.view_ebook_list, {
                            whereClause,
                            page,
                            order: [['id', 'ASC']],
                        });
                        result = ebooklist.data;
                    }
                    if(result){
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data: result })));
                        // return res.status(200).json({ status: 200, message: 'Ebook Found', data: result });
                    } else {
                        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Not Found', data: [] })));
                        // return res.status(401).json({ status: 200, token: '', message: 'Ebook Not Found', data: [] });
                    }
                    
            }
          catch (err) {
                  logger.error(`Unable to find Banner: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                  const validationErrors = err.errors.map((err) => err.message);
                   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                //   return res.status(500).json({ status: 500,errors: validationErrors });
                }
             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
            //  return res.status(500).json({ status: 500,token:'', message: err,data: []  });
              }
    
          }



          async ebookPurchase(req,res) {
              const decryptedObject = utility.DataDecrypt(req.encReq);
              const {user_id,ebook_id,quantity,is_free} = decryptedObject;

              const requiredKeys = Object.keys({ user_id,ebook_id,quantity,is_free });

              if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
              }

              const t = await this.db.sequelize.transaction();    
              try {

                    let env = config.env;
                  
                    const userRow = await this.db.user.getData(['id','first_name','last_name','mlm_id','mobile'], {id: user_id });
                  
                    if(userRow){
                        let walletbalance = await this.db.wallet.getWalletAmount(user_id);
                        let ebookData = await this.db.ebookList.findOne({
                                where: {
                                    id:ebook_id
                                },
                              });

                        let total_ebook_amount=0;
                        let discount=0;
                        if(ebookData){
                            total_ebook_amount= parseFloat(ebookData.price) * parseInt(quantity);
                        }
                        total_ebook_amount=(is_free==1)?0:total_ebook_amount;
                       
                        if(walletbalance!==null && walletbalance > 0 && walletbalance >= total_ebook_amount)
                        {
                           
                            const order_id = utility.generateUniqueNumeric(7);
                            const orderData = {
                                user_id,
                                env: config.env,
                                tran_type: 'Debit',
                                tran_sub_type: 'Ebook Purchase',
                                tran_for: 'Ebook Purchase',
                                trans_amount: (is_free==1)?0:total_ebook_amount,
                                currency: 'INR',
                                order_id,
                                order_status: 'PENDING',
                                created_on: Date.now(),
                                created_by: user_id,
                                ip_address: 0
                            };
                           
                            const generateorder = await this.db.upi_order.insertData(orderData, { transaction: t });

                           
                            const Data = {
                                order_id,
                                user_id,
                                ebook_id,
                                quantity,
                                amount:ebookData.price,
                                total_amount:(is_free==1)?0:total_ebook_amount,
                                discount,
                                mobile_no:userRow.mobile,
                                is_free: is_free?is_free:0
                              
                            };
                            const newSales = await this.db.ebookPurchase.insertData(Data,{ transaction: t });
                            if(newSales){

                                let walletEntry = [];
                                if(parseInt(is_free)==0)
                                {
                                    const walletData={
                                        transaction_id:order_id,
                                        user_id:user_id,
                                        env:env,
                                        type:'Debit',
                                        amount:total_ebook_amount,
                                        sub_type:'EbooK Purchase',
                                        tran_for:'main'
                                    };
                                    
                                    walletEntry = await this.db.wallet.insert_wallet(walletData,{ transaction: t });
                                }
                                 const saleQty= await this.saleQuantity(user_id, quantity,ebookData.sale_quantity);
                                 console.log(saleQty);
                                 await this.db.upi_order.update(
                                    {order_status:'SUCCESS' },
                                    { where: { user_id:user_id,order_id:order_id,order_status:'PENDING' }, t }
                                  );

                                t.commit();
                            }
                             return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message: 'purchase successfully' ,data: newSales})));
                            // return res.status(200).json({ status: 200,message: 'purchase successfully' ,data: newSales});
                        }else{
                             return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'You do not have sufficient wallet balance' })));
                            // return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
                        }
                        
                    }else{
                        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'User Does Not Exists.' })));
                        // return res.status(500).json({ status: 500,error: 'User Does Not Exists.' });
                    }      
            }catch (err) {
                    logger.error(`Unable to find Ebook: ${err}`);
                if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                    // return res.status(500).json({ status: 500,errors: validationErrors });
                }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
                // return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
        
        }

        async saleQuantity(ebook_id, quantity,sale_quantity){
            
            let total_quantity ;
            total_quantity=quantity+sale_quantity;

                const data=  {
                    sale_quantity:total_quantity
                };
                const whereClause={
                    id:ebook_id
                }
               const updatedUserStatus = await this.db.ebookList.UpdateData(data,whereClause);
               return total_quantity;
            
        }


        async getPurchaseList(req,res) {
             const decryptedObject = utility.DataDecrypt(req.encReq);
              const {user_id} = decryptedObject;
              const requiredKeys = Object.keys({ user_id });
              if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
              }
              try {
                        const whereClause={
                            user_id:user_id
                        }
                      let resultPurchaseEbook = await this.db.ebookPurchaseSummery.getPurchaseList(whereClause);
                      
                      const getPlan = await this.db.PlanPurchase.findOne({
                          where: {
                              user_id:user_id
                              
                          },
                          order: [['plan_id', 'desc']]
                      });
                      const plan = getPlan?getPlan.plan_id:0;
                      
                      let freeEbook = await this.db.view_ebook_list.getRandomEbook(plan);
                      
                      let combinedEbooks = [...resultPurchaseEbook, ...freeEbook];
                    
                        if(combinedEbooks) {
                         return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data: combinedEbooks })));
                        // return res.status(200).json({ status: 200, message: 'Ebook Found', data: resultPurchaseEbook });
                        } else {
                            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message: 'Ebook Not Found', data: [] })));
                        // return res.status(200).json({ status: 200,  message: 'Ebook Not Found', data: [] });
                        }
                }
              catch (err) {
                      
                if (err.name === 'SequelizeValidationError') {
                  const validationErrors = err.errors.map((err) => err.message);
                   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                //   return res.status(500).json({ status: 500,errors: validationErrors });
                }
                 return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                //  return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                  }
        
              }
    

              async getEbookInvoice(req,res) {
                const decryptedObject = utility.DataDecrypt(req.encReq);
                const {user_id, ebook_id, order_id} = decryptedObject;
                
                const requiredKeys = Object.keys({ user_id ,ebook_id,order_id});
                
                if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
                     return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
                //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
                try {
                        const whereClause={
                            order_id:order_id,
                            user_id:user_id,
                            ebook_id:ebook_id
                        }
                        let resultPurchaseEbook = await this.db.ebookPurchaseSummery.getPurchaseList(whereClause);
                      
                          if(resultPurchaseEbook) {
                            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data: resultPurchaseEbook })));
                          return res.status(200).json({ status: 200, message: 'Ebook Found', data: resultPurchaseEbook });
                          } else {
                              return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  message: 'Ebook Not Found', data: [] })));
                        //   return res.status(200).json({ status: 200,  message: 'Ebook Not Found', data: [] });
                          }
                  }
                catch (err) {
                        
                  if (err.name === 'SequelizeValidationError') {
                    const validationErrors = err.errors.map((err) => err.message);
                    return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                    // return res.status(500).json({ status: 500,errors: validationErrors });
                  }
                  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                //   return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                }
          
                }
                
                
                
            async getEbookDetails(req,res) {
                  const decryptedObject = utility.DataDecrypt(req.encReq);
                  const { ebook_id } = decryptedObject; 
            
                      try {
              
                          let ebookData = await this.db.view_ebook_list.findOne({
                              where: {
                                  id:ebook_id
                              },
                          });
            
                        if (ebookData) {
                          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data: ebookData })));
                          // return res.status(200).json({ status: 200, message: 'Category Found', data: ebookData });
                        } else {
                          return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Ebook Not Found', data: [] })));
                          return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
                        }
                      
                    }
                  catch (err) {
                          // logger.error(`Unable to find Category: ${err}`);
                          if (err.name === 'SequelizeValidationError') {
                            const validationErrors = err.errors.map((err) => err.message);
                          //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                            return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                          }
                          // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
                           return res.status(500).json({ status: 500,token:'', message: err,data: []  });
                      }
              
                  }
                
                
    
    /////////////////////////////////////////////////ADMIN REPORT////////////////////////////////////////////////

    async getEbookReport(req,res) {
        const {from_date , to_date} = req;
      
        try {

               let whereCondition ;
              
                const startDate =new Date(from_date);
                startDate.setHours(0, 0, 0);

                const endDate =new Date(to_date);
                endDate.setHours(23, 59, 59);

                whereCondition = {
                    'status': {
                        [Op.or]: [1, 2]
                        },
                    'created_on': {
                        [Op.between]: [startDate, endDate]
                    },
                }
        
        
                const report={
                    totalEbookCount:await this.db.view_ebook_list.count(),
                    totalpendingEbook:await this.db.view_ebook_list.count({  where:{ status:`2` } }),
                    totalApproveEbook:await this.db.view_ebook_list.count({  where:{ status:`1` } }),
                    totalDeactivatedEbook:await this.db.view_ebook_list.count({  where:{ status:`0` } }),
                 }
           
                let eventDetails = [];
                let result = await this.db.view_ebook_list.getAllData(whereCondition);
              
                for (const value of result) {
                  const ebookId = value.id;
                  const resultImages = await this.db.ebookImage.getImage(ebookId);
                  const res = {
                      ...value,
                      img: [],
                  };
                  for (const img1 of resultImages) {
                      res.img.push(
                           baseurl + img1.img,
                      );
                  }
                  eventDetails.push(res);
                }

                  if(eventDetails) {
                      const responseData = eventDetails.map((item) => ({
                          ...item.dataValues,
                          img:item.img,
                      }));
                  return res.status(200).json({ status: 200, message: 'Ebook Found', data: responseData, report });
                  } else {
                  return res.status(200).json({ status: 200, token: '', message: 'Ebook Not Found', data: [] });
                  }
          }
          catch (err) {
                logger.error(`Unable to find Ebook: ${err}`);
              if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors: validationErrors });
              }
            return res.status(500).json({ status: 500,token:'', message: err,data: []  });
          }
  
        }

    async updateEbookStatus(req, res) {
      const {id,status} = req;

      const requiredKeys = Object.keys({ id,status});
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }

      let t;

    //   try {
          const currentDate = new Date();
          const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
  
          const updatedStatus = await this.db.ebookList.UpdateData(
              {
                status,
                modified_on:utility.formatDateTime(currentDate),
              },
              {id:id}
            );
              
            if (updatedStatus) {
              return res.status(200).json({ status: 200, message: 'Status Updated Successful.'});
            } else {
              return res.status(200).json({ status: 200, message: 'Failed to Update data', data: [] });
            }
          
    //   } catch (error) {
    //       logger.error(`Unable to find Category: ${error}`);
    //       if (error.name === 'SequelizeValidationError') {
    //         const validationErrors = error.errors.map((err) => err.message);
    //         return res.status(500).json({ status: 500,errors: validationErrors });
    //       }
        
    //       return res.status(500).json({ status: 500,  message: error ,data:[]});
    //   }
    }


    async getEbookData(req,res) {
        
      const { ebook_id } = req; 

          try {
  
              let ebookData = await this.db.ebookList.findOne({
                  where: {
                      id:ebook_id
                  },
              });

            if (ebookData) {
              // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: ebookCategories })));
              return res.status(200).json({ status: 200, message: 'Category Found', data: ebookData });
            } else {
              // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
              return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
            }
          
        }
      catch (err) {
              logger.error(`Unable to find Category: ${err}`);
              if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
              //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
                return res.status(500).json({ status: 500,errors: validationErrors });
              }
              // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
               return res.status(500).json({ status: 500,token:'', message: err,data: []  });
          }
  
      }


     
        async addEbook(fileName, fileNames, req, res) {
            let t;
            
            const {  ebook_name,
              author ,
              description,
              price,
              quantity,
              discount,
             created_by,
              category_id
             } = req;
       
           
            try {
              // const filePath = imgfileName;

              console.log(req);
              let filePath = '';
              let ebookImage = '';
              const path ='uploads/ebookPdf/';
              t = await this.db.sequelize.transaction();
              fileNames.forEach(filename => {
                if (filename.includes("image") === false && filename.includes("ebook_pdf") === true ) {
                  filePath = filename;
                }
  
                if (filename.includes("image") === true && filename.includes("ebook_pdf") === false) {
                  ebookImage = filename;
                }
              });

              const imageArr = [];
              for (const filename of fileNames) {
                if (filename.includes("image")) {
                  imageArr.push(path+filename);
                }
              }
            
                const Data = {
                  ebook_name,
                  author ,
                  description,
                  images: imageArr[0],
                  price,
                  quantity,
                  discount,
                    created_by,
                  category:category_id,
                  book_file:filePath? path+filePath: '',
                };

                const newGraphics = await this.db.ebookList.insertData(Data, {
                  validate: true,
                  transaction: t,
                  logging: sql => logger.info(sql),
                });
          
                await t.commit();
          
                return res.status(200).json({ status: 200, message: 'Ebook added successfully', data: newGraphics });
              
            } catch (error) {
              if (t) {
                await t.rollback();
              }
          
              logger.error(`Error in add Ebook: ${error}`);
          
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: validationErrors });
              }
          
              return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
          
      
      }  
      
      
      async addEbookApp(fileName, fileNames, req, res) {
            

            const { ebook_name,
              author ,
              description,
              price,
              quantity,
              discount,
              category_id,
              user_id
             } = req;
             

       
           let t;
            try {
              // const filePath = imgfileName;

              console.log(req);
              let filePath = '';
              let ebookImage = '';
              const path ='uploads/ebookPdf/';
              t = await this.db.sequelize.transaction();
              fileNames.forEach(filename => {
                if (filename.includes("image") === false && filename.includes("ebook_pdf") === true ) {
                  filePath = filename;
                }
  
                if (filename.includes("image") === true && filename.includes("ebook_pdf") === false) {
                  ebookImage = filename;
                }
              });

              const imageArr = [];
              for (const filename of fileNames) {
                if (filename.includes("image")) {
                  imageArr.push(path+filename);
                }
              }
            
                const Data = {
                  ebook_name,
                  author ,
                  description,
                  images: imageArr[0],
                  price,
                  quantity,
                  discount,
                  category:category_id,
                  book_file:filePath? path+filePath: '',
                  created_by: user_id,
                  status: 2
                };

                const newEbook = await this.db.ebookList.insertData(Data, {
                  validate: true,
                  transaction: t,
                  logging: sql => logger.info(sql),
                });
          
                await t.commit();
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook added successfully', data: newEbook })));
                // return res.status(200).json({ status: 200, message: 'Ebook added successfully', data: newGraphics });
              
            } catch (error) {
              if (t) {
                await t.rollback();
              }
          
              logger.error(`Error in add Ebook: ${error}`);
          
              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', error:'Internal Server Error',  data: validationErrors })));
                // return res.status(500).json({ status: 500, errors: validationErrors });
              }
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, message: error.message, data: [] })));
            //   return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
          
      
      } 


      async updateEbook(fileName, fileNames, req, res) {
        let t;
        
        const { 
          id,
          ebook_name,
          author ,
          description,
          price,
          quantity,
          discount,
        
          category_id
         } = req;
   
       
        try {
        
          let filePath = '';
          let ebookImage = '';
          const path ='uploads/ebookPdf/';
          t = await this.db.sequelize.transaction();
          fileNames.forEach(filename => {
            if (filename.includes("image") === false && filename.includes("ebook_pdf") === true ) {
              filePath = filename;
            }

            if (filename.includes("image") === true && filename.includes("ebook_pdf") === false) {
              ebookImage = filename;
            }
          });

          const imageArr = [];
          for (const filename of fileNames) {
            if (filename.includes("image")) {
              imageArr.push(path+filename);
            }
          }
        
            const Data = {
              ebook_name,
              author ,
              description,
              images: imageArr[0],
              price,
              quantity,
              discount,
            
              category:category_id,
              book_file:filePath? path+filePath: '',
            };

            const whereCondition={
              id:id
            }

            const newGraphics = await this.db.ebookList.UpdateData(Data,whereCondition);
            return res.status(200).json({ status: 200, message: 'Ebook Update successfully', data: newGraphics });
          
        } catch (error) {
         
          logger.error(`Error in Update Ebook: ${error}`);
      
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors: validationErrors });
          }
      
          return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
        }
      
  
  }  
  
  
  
  
    async getEbookDashboard(req,res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id} = decryptedObject;
        const requiredKeys = Object.keys({user_id });
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        try {
                let bookOfTheDayListCondition='';
                let bookOfTheDayList=[];
                let getRecomendedEbook=[];
                let getSimiliarEbook=[];

                bookOfTheDayListCondition = {
                    'status': {
                        [Op.or]: [1]
                        },
                    'category':59,//59 is category_id of book of the day category
                }
                bookOfTheDayList = await this.db.view_ebook_list.getAllData(bookOfTheDayListCondition);
          
                const whereClause = {
                    'user_id':user_id,
                }
                const getPreviousCategoryId = await this.db.ebookPurchaseSummery.getDistinctCategory(whereClause);
                getSimiliarEbook = await this.db.view_ebook_list.getListByCategories(getPreviousCategoryId.category);
                getRecomendedEbook = await this.db.view_ebook_list.getListByCategories(getPreviousCategoryId.category);

                const responseData = {
                  bookOfTheDayList: bookOfTheDayList,
                  similarEbooks: getSimiliarEbook,
                  recommendedEbooks: getRecomendedEbook
                };
              
                // return res.status(200).json({ status: 200, message: 'Ebook Found', data:responseData });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data:responseData })));
          }
          catch (err) {
                logger.error(`Unable to find Ebook: ${err}`);
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
            // return res.status(500).json({ status: 500,errors: validationErrors });
          }
           return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
        //   return res.status(500).json({ status: 500,token:'', message: err,data: []  });
        }

      }


  

    async getFreeEbook(req,res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id} = decryptedObject;
        const requiredKeys = Object.keys({user_id });
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
              return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
          // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        try {
                let freeBook = 0;
                const plans = await this.db.PlanPurchase.getAllPlanUser(user_id);
                
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                const result = await this.db.ebookPurchase.update(
                    { status: 2 },
                    {
                        where: {
                            user_id: user_id,
                            is_free: 1,
                            created_date: {
                                [Op.lt]: oneYearAgo
                            }
                        }
                    }
                );

                if (plans.includes(1) && plans.some(plan => [9, 10, 11].includes(plan))) {
                  freeBook = 5;
                } else if (plans.includes(2) && plans.some(plan => [9, 10, 11].includes(plan))) {
                  freeBook = 15;
                } else if (plans.includes(3) && plans.some(plan => [9, 10, 11].includes(plan))) {
                  freeBook = 20;
                }

                const getFreePurchase = await this.db.ebookPurchase.count({
                  where: {
                    user_id: user_id,
                    status:1,
                    is_free: 1
                  }
                });


                const resData = {
                  free: freeBook,
                  purchase: getFreePurchase,
                  remaining: freeBook-getFreePurchase
                }

                // return res.status(200).json({ status: 200, message: 'Ebook Found', data:resData });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Ebook Found', data:resData })));
          }
          catch (err) {
          if (err.name === 'SequelizeValidationError') {
            const validationErrors = err.errors.map((err) => err.message);
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error', data:validationErrors })));
            // return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
          }
           return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message, error: err.message, data: []  })));
          // return res.status(500).json({ status: 500,token:'', message: err.message, error: err.message, data: []  });
        }

      }




}




module.exports = new Ebook();