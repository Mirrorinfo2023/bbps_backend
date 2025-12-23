const express = require('express');
const roleController = require('../../controller/employee/role.controller');
const employeeController = require('../../controller/employee/employee.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');

const role = express.Router();


role.get('/get-roles',(req, res) => {

	roleController.getRoles(req.body,res).then(data => res.json(data));
});


role.post('/add-role', async (req, res) => {
	roleController.addRole(req.body,res).then(data => res.json(data));
});


role.post('/get-role-list', async (req, res) => {
	
	roleController.getRoleList( req.body,res).then(data => res.json(data));
});


role.post('/update-role', async (req, res) => {
	
	roleController.updateRole( req.body,res).then(data => res.json(data));
});


role.post('/add-employee', async (req, res) => {
	employeeController.addEmployee(req.body,res).then(data => res.json(data));
});

role.post('/get-employee-list', async (req, res) => {
	
	employeeController.getEmployeeList( req.body,res).then(data => res.json(data));
});


role.post('/get-employee', async (req, res) => {
	
	employeeController.getEmployee( req.body,res).then(data => res.json(data));
});

role.post('/edit-employee', async (req, res) => {
	
	employeeController.updateEmployee( req.body,res).then(data => res.json(data));
});


module.exports = role;
