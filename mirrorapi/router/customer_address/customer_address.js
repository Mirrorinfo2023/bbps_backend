
const express = require('express');
const customerAddressController = require('../../controller/customer_address/customer_address.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const customerAddress = express.Router();


const endpoints = {
    '/get-customer-address': '924e10678a6fa219b8ebcbf08aa4a5035df960f9',
    '/add-address': 'b043867f6e1df043ebf5b1204d518704edce51f9'
};


customerAddress.post('/924e10678a6fa219b8ebcbf08aa4a5035df960f9', authenticateJWT, logMiddleware, async (req, res) => {
	customerAddressController.getAddress(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


customerAddress.post('/b043867f6e1df043ebf5b1204d518704edce51f9', authenticateJWT, logMiddleware, async (req, res) => {
    customerAddressController.addAddress(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error add address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


customerAddress.post('/add-address', async (req, res) => {
    customerAddressController.addAddress(req, res);
});


customerAddress.post('/get-customer-address',  async (req, res) => {
	customerAddressController.getAddress(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


module.exports = customerAddress;