const { connect,baseurl } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 


class employeeRole {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async getRoles(req,res) 
    {
	  
        try {
           
            const employeRole = await this.db.employeeRole.getAllData({status:1});

            if (employeRole) {
                //return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Category Found', data: graphicsResult, todaysStatus: graphicsTodaysStatus })));
                return res.status(200).json({ status: 200, message: 'Employee role Found', data: employeRole });
            } else {
                //return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Category Not Found', data: [] })));
                return res.status(401).json({ status: 401, token: '', message: 'Employee role Not Found', data: [] });
            }
            
        }catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
                return res.status(500).json({ status: 500, message: err.message, data: [] });
        }
	
    }

     
    async addRole(req, res) 
    {

        const { role_name } = req;
        
        const requiredKeys = Object.keys({ role_name });
        
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
              
        try 
        {
            if(await this.db.employeeRole.getDataCount({role_name}) == 0)
            {
                const inputData = {
                    role_name,
                };
          
                const newRole = await this.db.employeeRole.insertData(inputData);
          
                if(newRole)
                {
                    return res.status(200).json({ status: 200, message: 'Role added successfully', data: newRole });
                }else{
                    return res.status(201).json({ status: 201, message: 'Failed to create', data: [] });
                }
                
            }else{
                return res.status(201).json({ status: 201, message: 'Sorry role already exists', data: [] });
            }
                  
        } catch (error) {
        
            if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors:'Internal Server Error', data:validationErrors });
            }
        
            return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
              
           
    }  


    async getRoleList(req,res) 
    {
        

        try {
            
    
            // const startDate =new Date(from_date);
            // const endDate =new Date(to_date);
            // endDate.setHours(23, 59, 59);
    
            const whereCondition = null

            const employeRole = await this.db.employeeRole.getAllData(whereCondition);
        
            return res.status(200).json({ status: 200,  message:'success', data : employeRole });
            
        }catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
        }
    
    }


    async updateRole(req, res) 
    {
        const { role_id, role_name, status } = req;

        const requiredKeys = Object.keys({ role_id, action, status });
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        try {
            const currentDate = new Date();
    
            const updatedStatus = await this.db.employeeRole.updateData({
                    role_name,
                    status,
                    modified_on:currentDate.getTime()
                },
                
                { id:role_id }
            );
                
            if (updatedStatus > 0) {
                return res.status(200).json({ status: 200, message: 'Role Updated Successful.'});
            } else {
                return res.status(201).json({ status: 500, message: 'Failed to Update data', data: [] });
            }
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
          
            return res.status(500).json({ status: 500,  message: error.message ,data:[]});
        }
    }

}


module.exports = new employeeRole();