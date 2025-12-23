const { connect,baseurl,config  } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const utility = require('../../utility/utility');

class Ebook {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	

    async getCategoryList(req,res) {
        
        // const { from_date, to_date} = req; 

            try {
            
                // let whereCondition ;

                // const startDate =new Date(from_date);
                // const endDate =new Date(to_date);
                // endDate.setHours(23, 59, 59);

                // whereCondition = {
                //     'status': {
                //         [Op.or]: [1]
                //         },
                //     'created_on': {
                //         [Op.between]: [startDate, endDate]
                //     },
                // }
                
                
            
                let ebooks = await this.db.view_ebook_list.findAll({
                        where: { status: 1},
                        order: [['id', 'DESC']]
                      });
              
                
                let ebookByCategory = {};
                const catGroup = [];
             
                for (const item of ebooks) {
                  const ebooksId = item.id;
    
                  const cat_name = await this.db.ebookCategories.findOne({
                    where: {id:item.category},
                  });
    
                 
                  const cat_group = cat_name.category_name;
                 
                  if (!catGroup.includes(cat_group)) {
                    catGroup.push(cat_group);
                  }
                
                  if (!ebookByCategory[cat_group]) {
                    ebookByCategory[cat_group] = [];
                  }
               
                
                  ebookByCategory[cat_group].push({
                    id: item.id,
                    image: baseurl + item.imges,
                    ebook_name: item.ebook_name,
                    category: item.category,
                    book_file: item.book_file,
                    status: item.status,
                    price: item.price,
                    discount: item.discount,
                    author: item.author,
                    description: item.description,
                    category_name: item.category_name,
                  });
                }
             
                // Modify ebookByCategory to include only the first 5 records for each category
            
                const ebooksByCategory = await Promise.all(catGroup.map(async (cat_group) => {
                  const cat = await this.db.ebookCategories.findOne({
                    where: { category_name: cat_group },
                  });
                  
                  return {
                    category_id: cat ? cat.id : null,
                    cat_name: cat_group,
                    cat_data: ebookByCategory[cat_group].slice(0, 5), // Include only the first 5 records
                  };
                }));
        
           
            let ebookCategories = await this.db.ebookCategories.getData();

            
              if (ebookCategories.length > 0) {
                // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: ebookCategories, ebooksByCategory: ebooksByCategory })));
                return res.status(200).json({ status: 200, message: 'Category Found', data: ebookCategories, ebooksByCategory: ebooksByCategory });
              } else {
                // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
                return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
              }
              
            
          }
        catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
                //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
                // return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
	
        }



        async addCategory( req, res) {
          
            const { category_name } = req;
          
            try {
                const existingCategory = await this.db.ebookCategories.getDataWithClause(category_name);
          
                if (!existingCategory) {
                    const categoryData = {
                        category_name,
                    //   description,
                    //   image:filePath
                };
          
                const newCategory = await this.db.ebookCategories.insertData(categoryData);
                    return res.status(200).json({ status: 200, message: 'Category added successfully', data: newCategory });
                } else {
                    return res.status(200).json({ status: 200, message: 'Already Exist' });
                }
            } catch (error) {
                logger.error(`Error in addCategory: ${error}`);
                if (error.name === 'SequelizeValidationError') {
                    const validationErrors = error.errors.map((err) => err.message);
                    return res.status(500).json({ status: 500, errors: validationErrors });
                }
                return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
            }
               
        }

        
        async updateCategoryStatus(req, res) {
            const {id,status} = req;

            const requiredKeys = Object.keys({ id,status});
            if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
              return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            }
  
            let t;
  
            try {
                const currentDate = new Date();
                const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
        
                const updatedStatus = await this.db.ebookCategories.UpdateData(
                    {
                      status,
                      modified_on:utility.formatDateTime(currentDate),
                    },
                    {id:id}
                  );
                    
                  if (updatedStatus) {
                    return res.status(200).json({ status: 200, message: 'Category Status Updated Successful.'});
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



          async getcategoryData(req,res) {
        
            const { category_id} = req; 
    
                try {
        
                    let ebookCategories = await this.db.ebookCategories.findOne({
                        where: {
                            id:category_id
                        },
                    });

                  if (ebookCategories) {
                    // return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: ebookCategories })));
                    return res.status(200).json({ status: 200, message: 'Category Found', data: ebookCategories });
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

            async updateCategory(req, res) {
                const {id,category_name} = req;
    
                const requiredKeys = Object.keys({ id,category_name});

                if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
                  return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
                }
      
                let t;
      
                try {
                    const currentDate = new Date();
                    const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
                    const existingCategory = await this.db.ebookCategories.getDataWithClause(category_name);
          
                    if (!existingCategory) {
                        const updatedStatus = await this.db.ebookCategories.UpdateData(
                            {
                            category_name,
                            modified_on:utility.formatDateTime(currentDate),
                            },
                            {id:id}
                        );
                            
                      if (updatedStatus) {
                        return res.status(200).json({ status: 200, message: 'Category Updated Successful.'});
                      } else {
                        return res.status(200).json({ status: 200, message: 'Failed to Update data', data: [] });
                      }
                    } else {
                        return res.status(200).json({ status: 200, message: 'Already Exist' });
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
    
    
    



}




module.exports = new Ebook();