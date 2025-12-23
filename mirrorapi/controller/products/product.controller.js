const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 
const fs = require('fs');
const path = require('path');

class Product {
  db = {};

  constructor() {
    this.db = connect();
  }
  
   
    
    async getProduct(req,res) 
    {
    	  
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { page } = decryptedObject;
       
        try {
     
          
            const pages = parseInt(page) || 1;
            const pageSize =  100;
            
            const result = await this.db.Product.getAllDataList(pages, pageSize);
            let resData = [];
            
            for (const item of result) {
              const prodImage = await this.db.ProductImages.getAllData({ product_id: item.id });
              
              const cleanedPlanDetails = item.benefit.replace(/^'|'$/g, '');
              const planDetailsObject = JSON.parse(cleanedPlanDetails);
              const planDetailsValuesArray = Object.values(planDetailsObject);
              
              resData.push({
                    ...item.dataValues,
                    benefits: planDetailsValuesArray,
                    images: prodImage,
                });
            }
    
            if(resData) {
                // return res.status(200).json({ status: 200, message: 'Product Found', data: resData });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Product Found', data: resData })));
            } else {
                return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, token: '', message: 'Product Not Found', data: [] })));
            }
        
      
        }
        catch (err) {
             
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
            //   return res.status(500).json((JSON.stringify({ status: 500,errors: validationErrors })));
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
            }
            
            // return res.status(500).json((JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
        }
    }





    
    
        
        async UpdateProduct(req,res) {
        
         
           const decryptedObject = utility.DataDecrypt(req.encReq);
                const {   
             name,
            unit_price,
            purchase_price,
            details,product_id } = decryptedObject;
        
        
              
                              
        let t = await this.db.sequelize.transaction();
        
        try {
          
         
         
        
            let  ProductData = {
        
              name,
            unit_price,
            purchase_price,
            details,product_id
            }
        
          
        
            const WhereClause = {
              id:product_id
            }
            
            
        
           const results = await this.db.Product.UpdateData(ProductData, WhereClause,{ transaction: t });
            
            if (results) {
            
              await t.commit();
              return res.status(200).json(
            
                
                utility.DataEncrypt(JSON.stringify({  status: 200,  message: 'Product Updated successfully' ,data:results }))
                
                );
                
                
            } else {
              await t.rollback();
              return res.status(500).json(
                  
         
                utility.DataEncrypt(JSON.stringify({  status: 500,error: 'Failed to update' }))
                
                );
            }
        } catch (error) 
        {
             await t.rollback();
             
          logger.error(`Unable to find : ${error}`);
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json(
                
              
                utility.DataEncrypt(JSON.stringify( { status: 500,errors: validationErrors } ))
              
              );
          }
          return res.status(500).json(
           
               utility.DataEncrypt(JSON.stringify( { status: 500,message: error ,data:[] } ))
               
              );
        }
        
        
        
        return res.status(400).json(
            
             utility.DataEncrypt(JSON.stringify( { status: 400,  message: 'Bad request' ,data:[]} ))
            );
        
        
        
        }
        

          
    
           
    async AddProduct(req,res) {
    
      // const decryptedObject = utility.DataDecrypt(req.encReq);
       
       const {
           name,
           unit_price,
            purchase_price,
            details,
            images
           
       } = req;
   
     
           
    const ProductData = {
          
      name,
      unit_price,
       purchase_price,
       details,
       images,
       status:1,
       created_on:new Date(),
         }
         
       
                           
     let t = await this.db.sequelize.transaction();
     
     try {
       
       
          
   
         const ProductData = {
          
          name,
           unit_price,
            purchase_price,
            details,
            images,
            status:1,
            created_on:new Date(),
         }
         
        const results = await this.db.Product.insertData(ProductData, { transaction: t });
         
         if (results) {
         
           await t.commit();
           return res.status(200).json(
             { status: 200,  message: 'product Added successfully' ,data:results});
         } else {
           await t.rollback();
           return res.status(500).json(
             { status: 500,error: 'Failed to create' });
         }
     } catch (error) 
     {
          await t.rollback();
          
     //  logger.error(Unable to find : ${error});
       if (error.name === 'SequelizeValidationError') {
         const validationErrors = error.errors.map((err) => err.message);
         return res.status(500).json(
           { status: 500,errors: validationErrors });
       }
       return res.status(500).json({ status: 500,  message: error.message ,data:[]});
     }
     return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }
   
   
   
   async getProductList(req,res) 
    {
    	  
        const { page } = req;
       
        try {
          
            
            const result = await this.db.Product.findAll({
              order: [['id', 'desc']]
            });
            let resData = [];
            
            for (const item of result) {
              // const prodImage = await this.db.ProductImages.getAllData({ product_id: item.id });
              let planDetailsValuesArray = {};
              if(item.benefit)
              {
                const cleanedPlanDetails = item.benefit.replace(/^'|'$/g, '');
                const planDetailsObject = JSON.parse(cleanedPlanDetails);
                planDetailsValuesArray = Object.values(planDetailsObject);
              }
              resData.push({
                    ...item.dataValues,
                    benefits: planDetailsValuesArray,
                    entry_date: utility.formatDateTimeDMY(item.created_on)
                    // images: prodImage,
                });
            }
    
            if(resData) {
                return res.status(200).json({ status: 200, message: 'Product Found', data: resData });
                // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Product Found', data: resData })));
            } else {
                // return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, token: '', message: 'Product Not Found', data: [] })));
                return res.status(404).json({ status: 404, message: 'Product Not Found', data: [] });
            }
        
      
        }
        catch (err) {
             
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json((JSON.stringify({ status: 500,errors: validationErrors })));
                // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
            }
            
            return res.status(500).json((JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
            // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
        }
    }


    async addProduct(fileName, fileNames, req,res) 
    {
    	  
        const {name, unit_price, purchase_price, details, created_by, benefits } = req;
       
        try {

            const path ='uploads/products/';

            if(await this.db.Product.count({where: {name: name}}) > 0)
            {
              return res.status(402).json({ status: 402, message: 'Product already exists', data: [] });
            }


            const instData = {
                name,
                unit_price,
                purchase_price,
                details,
                status:1,
                created_on: Date.now(),
                created_by: created_by,
                benefit: benefits
            };

            const product = await this.db.Product.insertData(instData);

            if(product)
            {

              for (const filename of fileNames) {
                if (filename.includes("images")) {
                  const image = path+filename;

                  const dataToInsert = {
                    'product_id': product.id,
                    'image': image,
                    'status': 1
                  }
                  
                  await this.db.ProductImages.insertData(dataToInsert);
                }
              }
              return res.status(200).json({ status: 200, message: 'Product added successfully', data: product });
            }else{
              return res.status(500).json({ status: 500, message: 'Somthing went wrong', data: [] });
            }

        }
        catch (err) {
             
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json((JSON.stringify({ status: 500,errors: 'Internal server error', data:validationErrors })));
            }
            
            return res.status(500).json((JSON.stringify({ status: 500, message: err.message, data: []  })));
        }
    }

    async getProductById(req,res) 
    {
    	  
        const { product_id } = req;
       
        try {
          
            const result = await this.db.Product.findProductById(product_id);
            
            let planDetailsValuesArray = {};
            if(result.benefit)
            {
              const cleanedPlanDetails = result.benefit.replace(/^'|'$/g, '');
              const planDetailsObject = JSON.parse(cleanedPlanDetails);
              planDetailsValuesArray = Object.values(planDetailsObject);
            }
            result.dataValues.benefits = planDetailsValuesArray;
            result.dataValues.images = await this.db.ProductImages.getAllData({ product_id: product_id });
            

            if(result) {
                return res.status(200).json({ status: 200, message: 'Product Found', data: result });
                // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Product Found', data: resData })));
            } else {
                // return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, token: '', message: 'Product Not Found', data: [] })));
                return res.status(404).json({ status: 404, message: 'Product Not Found', data: [] });
            }
        
      
        }
        catch (err) {
             
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json((JSON.stringify({ status: 500,errors: validationErrors })));
                // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
            }
            
            return res.status(500).json((JSON.stringify({ status: 500,message: err.message,data: []  })));
            // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,message: err.message,data: []  })));
        }
    }

    async deleteProductImage(req,res)
    {
      const { item_detail_id } = req;

      const getImage = await this.db.ProductImages.findOne({where:{id: item_detail_id}});

      if(getImage)
      {
        const imagePath = `./${getImage.image}`;

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image at ${imagePath}:`, err);
            return;
          }
        });

        await this.db.ProductImages.destroy({
          where: {
              id: item_detail_id
          }
        });
  
        return res.status(200).json({ status: 200, message: 'Image removed successfully', data: [] });
      }else{
        return res.status(500).json({ status: 500, message: 'Wrong credentials', data: [] });
      }
      
    }

    async updateProduct(fileName, fileNames, req,res) 
    {
    	  
        const {product_id, name, unit_price, purchase_price, details, benefits } = req;
       
        try {

            const path ='uploads/products/';

            if(await this.db.Product.count({where: {id: product_id}}) == 0)
            {
              return res.status(402).json({ status: 402, message: 'Product not found', data: [] });
            }


            const upData = {
                name,
                unit_price,
                purchase_price,
                details,
                benefit:benefits
            };

            const product = await this.db.Product.UpdateData(upData, [{'id': product_id }]);

            if(product)
            {

              for (const filename of fileNames) {
                if (filename.includes("images")) {
                  const image = path+filename;

                  const dataToInsert = {
                    'product_id': product_id,
                    'image': image,
                    'status': 1
                  }
                  
                  await this.db.ProductImages.insertData(dataToInsert);
                }
              }
              return res.status(200).json({ status: 200, message: 'Product updated successfully', data: product });
            }else{
              return res.status(500).json({ status: 500, message: 'Somthing went wrong', data: [] });
            }

        }
        catch (err) {
             
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json((JSON.stringify({ status: 500,errors: 'Internal server error', data:validationErrors })));
            }
            
            return res.status(500).json((JSON.stringify({ status: 500, message: err.message, data: []  })));
        }
    }


    async updateProductStatus(req,res)
    {
      const { product_id, action, status } = req;

      const getProduct = await this.db.Product.findOne({where:{id: product_id}});

      if(getProduct)
      {

        await this.db.Product.UpdateData(
          {status}, 
          { id:product_id }
        );
  
        return res.status(200).json({ status: 200, message: 'Product updated successfully', data: [] });
      }else{
        return res.status(500).json({ status: 500, message: 'Wrong credentials', data: [] });
      }
      
    }
   


  
  
}

module.exports = new Product();