const { connect,baseurl } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class employeeDetails {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	

     
    async addEmployee(req, res) 
    {

        const { 
            mobile_no,
            first_name,
            city,
            district,
            state,
            address,
            dob,
            email,
            gender,
            role_id,
            pincode,
            education } = req;
        
        const requiredKeys = Object.keys({ mobile_no,
            mobile_no,
            first_name,
            city,
            district,
            state,
            address,
            dob,
            email,
            gender,
            role_id,
            pincode,
            education });
        
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        
        let t = await this.db.sequelize.transaction();
        try 
        {

            const getUserSearchByData = { mobile:mobile_no,  email:email};
          
            if(await this.db.user.emailOrMobileExists(getUserSearchByData)>0)
            {
                //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'user Already Exist' })));
                return res.status(201).json({ status: 201,message: 'user Already Exist' });
            }


            let mrNo = utility.generateUniqueNumeric(5);
            const mlm_id=`MR${mrNo}`;
            const password = `${mlm_id}1234`;
            const userData = {
                mlm_id,
                referred_by:0,
                first_name:first_name,
                last_name:' ',
                username:mobile_no,
                email:email,
                mobile:mobile_no,
                password:bcrypt.hashSync(password, 10),
                pincode:pincode,
                district:district,
                state:state,
                dob:dob,
                email_verified: 1,
                mobile_verified: 1,
                gender:gender,
                education: education,
                is_admin: 1,
                city: city,
                address: address,
                postOfficeName: '',
                circle: '',
                division: '',
                region: ''
            }
                
            const user = await this.db.user.insertData(userData, { transaction: t });

            if(user)
            {
                const employee_code = `EMP-${first_name.substring(0, 3)}-MR${mrNo}`;
                const inputData = {
                    user_id: user.id,
                    employee_code:employee_code,
                    role_id:role_id
                };
          
                const newEmployee = await this.db.employee.insertData(inputData, { transaction: t });
          
                if(newEmployee)
                {
                    await t.commit();
                    const employeeData = await this.db.viewEmployee.getData({id: user.id});
                    return res.status(200).json({ status: 200, message: 'Employee created successfully', data: employeeData });
                }else{
                    await t.rollback();
                    return res.status(201).json({ status: 201, message: 'Failed to create', data: [] });
                }
                
            }else{
                await t.rollback();
                return res.status(201).json({ status: 201, message: 'Failed to create', data: [] });
            }
                  
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors:'Internal Server Error', data:validationErrors });
            }
        
            return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
              
           
    }  


    async getEmployeeList(req,res) 
    {

        try {
            
    
            // const startDate =new Date(from_date);
            // const endDate =new Date(to_date);
            // endDate.setHours(23, 59, 59);
    
            const whereCondition = {
                'employee_status': 1
            }

            const employeeData = await this.db.viewEmployee.getAllData(whereCondition);
            const report={                    
                totalempCount:await this.db.viewEmployee.count(),
                totalActiveempCount:await this.db.viewEmployee.count({where:{status:1}}),
                totalInactiveempCount:await this.db.viewEmployee.count({ where:{status:0}}),
             }
        
            return res.status(200).json({ status: 200,  message:'success', data : employeeData, report });
            
        }catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
        }
    
    }


    async getEmployee(req,res) 
    {
        const { employee_id } = req; 

        try {
            
    
            const whereCondition = {
                'employee_id': employee_id,
            }

            const employeeData = await this.db.viewEmployee.getData(whereCondition);
            const getData = await this.db.menuMaster.getAllData({status: 1});

            const menuData = [];
            for(const menu of getData)
            {
                const parentMenu = await this.db.menuMaster.getData({status: 1, id:menu.parent_id});
                const permission = await this.db.menuPermission.getData({status: 1, employee_id: employee_id, menu_id:menu.id});
                menuData.push({
                    'id': menu.id,
                    'menu_name': menu.menu_name,
                    'parent_id': menu.parent_id,
                    'parent_menu': parentMenu?parentMenu.menu_name: '',
                    'menu_url': menu.menu_url,
                    'list': permission?permission._list:0,
                    'insert': permission?permission._insert:0,
                    'view': permission?permission._view:0,
                    'update': permission?permission._update:0,
                    'delete': permission?permission._delete:0,
                });
            }
        
            return res.status(200).json({ status: 200,  message:'success', data : employeeData, menuData:menuData });
            
        }catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message, data: []  });
        }
    
    }

    async updateEmployee(req, res) 
    {

        const { 
            mobile_no,
            first_name,
            city,
            district,
            state,
            address,
            dob,
            email,
            gender,
            role_id,
            pincode,
            education,
            employee_id } = req;
        
        const requiredKeys = Object.keys({ mobile_no,
            mobile_no,
            first_name,
            city,
            district,
            state,
            address,
            dob,
            email,
            gender,
            role_id,
            pincode,
            education,
            employee_id
        });

        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        
        let t = await this.db.sequelize.transaction();
        try 
        {

            const getUserSearchByData = await this.db.employee.getData(['id', 'user_id'], {id: employee_id});
          
            if(getUserSearchByData && getUserSearchByData.id>0)
            {

                const userData = {
                    first_name:first_name,
                    pincode:pincode,
                    district:district,
                    state:state,
                    dob:dob,
                    gender:gender,
                    education: education,
                    city: city,
                    address: address
                }
                    
                const user = await this.db.user.updateData(userData, getUserSearchByData.user_id, { transaction: t });

                if(user)
                {
                    const inputData = {
                        role_id:role_id
                    };
            
                    const newEmployee = await this.db.employee.updateData(inputData,{'id': employee_id}, { transaction: t });
            
                    if(newEmployee)
                    {
                        await t.commit();
                        return res.status(200).json({ status: 200, message: 'Employee updated successfully', data: getUserSearchByData });
                    }else{
                        await t.rollback();
                        return res.status(201).json({ status: 201, message: 'Failed to update', data: [] });
                    }
                }
            }else{
                await t.rollback();
                return res.status(201).json({ status: 201, message: 'Staff not found', data: [] });
            }
                  
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500, errors:'Internal Server Error', data:validationErrors });
            }
        
            return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
              
           
    }  



    // async updateRole(req, res) 
    // {
    //     const { role_id, role_name, status } = req;

    //     const requiredKeys = Object.keys({ role_id, action, status });
    //     if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
    //       return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    //     }

    //     try {
    //         const currentDate = new Date();
    
    //         const updatedStatus = await this.db.employeeRole.updateData({
    //                 role_name,
    //                 status,
    //                 modified_on:currentDate.getTime()
    //             },
                
    //             { id:role_id }
    //         );
                
    //         if (updatedStatus > 0) {
    //             return res.status(200).json({ status: 200, message: 'Role Updated Successful.'});
    //         } else {
    //             return res.status(201).json({ status: 500, message: 'Failed to Update data', data: [] });
    //         }
            
    //     } catch (error) {
    //         if (error.name === 'SequelizeValidationError') {
    //           const validationErrors = error.errors.map((err) => err.message);
    //           return res.status(500).json({ status: 500,errors:'Internal Server Error', data:validationErrors });
    //         }
          
    //         return res.status(500).json({ status: 500,  message: error.message ,data:[]});
    //     }
    // }

}


module.exports = new employeeDetails();