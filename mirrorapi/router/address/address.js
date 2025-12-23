const express = require('express');
const addressController = require('../../controller/address/address.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const address = express.Router();


const endpoints = {
    '/get-address': '51904cbe0e71b248e4eabfac4f6c11fe96e2aeac',
};

// Get Address
address.post('/51904cbe0e71b248e4eabfac4f6c11fe96e2aeac', logMiddleware, (req, res) => {
	addressController.getAddress(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//'/get-address'
address.post('/get-address',(req, res) => {

	addressController.getAddress(req.body,res).then(data => res.json(data));
});

//
module.exports = address;
