const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class ProductPackage {
  db = {};

  constructor() {
    this.db = connect();
  }
  
    async getPackage(req,res) {
	  
                //const decryptedObject = utility.DataDecrypt(req.encReq);
                const { page } = req;

               
                try {
             
                  
                  const pages = parseInt(page) || 1;
                  const pageSize =  10;
                
                  const result = await this.db.Package.getAllDataList(pages,pageSize);
                 
                //utility.DataEncrypt
                if(result) {
                    return res.status(200).json((JSON.stringify({ status: 200, message: 'Package Found', data: result })));
                } else {
                    return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Package Not Found', data: [] })));
                }
                
              
            }
          catch (err) {
                 
            if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map((err) => err.message);
              return res.status(500).json((JSON.stringify({ status: 500,errors: validationErrors })));
            }
             return res.status(500).json((JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
              }
    
    
    
    
          }
          
          
        
        async UpdatePackage(req,res) {
        
         
           const decryptedObject = utility.DataDecrypt(req.encReq);
                const {   
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            package_id,
            modified_by } = decryptedObject;
        
        
              
                              
        let t = await this.db.sequelize.transaction();
        
        try {
          
         
         
        
            let  ProductData = {
        
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            package_id,
            modified_by,
            modified_on:new Date(),
              status:1
            }
        
          
        
            const WhereClause = {
              id:package_id
            }
            
            
        
           const results = await this.db.Package.UpdateData(ProductData, WhereClause,{ transaction: t });
            
            if (results) {
            
              await t.commit();
              return res.status(200).json(
            
                
                utility.DataEncrypt(JSON.stringify({  status: 200,  message: 'Package Updated successfully' ,data:results }))
                
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
        

              
            
        async AddPackage(req,res) {
    
       // const decryptedObject = utility.DataDecrypt(req.encReq);
        
        const {
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            created_by
            
        } = req;
    
      
            
     const ProductData = {
           
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            status:1,
            created_by,
            created_on:new Date()
          }
          
        
                            
      let t = await this.db.sequelize.transaction();
      
      try {
        
        
           
    
          const ProductData = {
           
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            status:1,
            created_by,
            created_on:new Date()
          }
          
         const results = await this.db.Package.insertData(ProductData, { transaction: t });
          
          if (results) {
          
            await t.commit();
            return res.status(200).json(
              { status: 200,  message: 'Package Added successfully' ,data:results});
          } else {
            await t.rollback();
            return res.status(500).json(
              { status: 500,error: 'Failed to create' });
          }
      } catch (error) 
      {
           await t.rollback();
           
        logger.error(`Unable to find : ${error}`);
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json(
            { status: 500,errors: validationErrors });
        }
        return res.status(500).json({ status: 500,  message: error ,data:[]});
      }
      return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
      
    
    }

  
  
   


  
  
}

module.exports = new ProductPackage();