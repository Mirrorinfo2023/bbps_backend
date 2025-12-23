const express = require('express');
const pincodeController = require('../../controller/pincode/pincode.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const pincode = express.Router();


const endpoints = {
    '/get-pincode': '916e4eb592f2058c43a3face75b0f9d49ef2bd17',
 
};


pincode.post(`/916e4eb592f2058c43a3face75b0f9d49ef2bd17`, logMiddleware, (req, res) => {

	pincodeController.getPincode(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Pincode:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


pincode.post('/get-pincode',(req, res) => {

	pincodeController.getPincode(req.body,res).then(data => res.json(data));
});

//pincode.post('/save-pincode',(req, res) => {

//	pincodeController.savePincode(req.body,res).then(data => res.json(data));
//});

//
module.exports = pincode;
