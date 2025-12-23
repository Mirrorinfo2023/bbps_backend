const express = require('express');
const operatorController = require('../../controller/operator/serviceOperator.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 


const serviceOperator = express.Router();
const destinationPath = 'uploads/operator';
const fileUpload = configureMulter(destinationPath).single('image');

const endpoints = {
    '/add-operator': '428fd54ea9e40f7c816b6ffc2887e35015ee539e',
    '/get-operator': '8a6bb5e0bc0e95eec947e2327b2278d137373901',
    '/get-mobile-operator': '922833daa96b124c3d9de9ba182ce9a69be0f11e',
};



serviceOperator.post('/428fd54ea9e40f7c816b6ffc2887e35015ee539e',fileUpload, authenticateJWT, logMiddleware, (req, res) => {
	const fileName = req.file.filename;
	operatorController.addOperator(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Operator:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

serviceOperator.post('/8a6bb5e0bc0e95eec947e2327b2278d137373901', authenticateJWT, logMiddleware, (req, res) => {

	operatorController.getOperator(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Operator:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

serviceOperator.post('/922833daa96b124c3d9de9ba182ce9a69be0f11e', authenticateJWT, logMiddleware, (req, res) => {

	operatorController.getOperatorTest(req.body,res)
	    .then(data => res.json(data))
	   .catch(error => {
            console.error('Error requesting Get Mobile Operator:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



serviceOperator.post('/add-operator',fileUpload, async (req, res) => {
	// if (req.file.fileValidationError) {
	// 	// Handle file validation errors
	// 	return res.status(400).json({ status: 400, error: req.fileValidationError });
	// }
	const fileName = req.file.filename;
	operatorController.addOperator(fileName, req.body,res).then(data => res.json(data));
});

serviceOperator.post('/get-operator',(req, res) => {

	operatorController.getOperator(req.body,res).then(data => res.json(data));
});

serviceOperator.post('/get-mobile-operator',(req, res) => {

	operatorController.getOperatorTest(req.body,res).then(data => res.json(data));
});

//
module.exports = serviceOperator;
