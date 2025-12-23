const express = require('express');
const rechargeServiceDiscount = require('../../controller/recharge/rechargeServiceDiscount.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const ServiceDiscount = express.Router();


const endpoints = {
    '/add-discount': '027bfc4af2a5f930499e0e05ab8e0a5b018bf81c',
    '/get-discount': '5f7c6a3ea38c126af8aff474e7ffeaf473bae80e',
};

ServiceDiscount.post('/027bfc4af2a5f930499e0e05ab8e0a5b018bf81c', authenticateJWT, logMiddleware, (req, res) => {

	rechargeServiceDiscount.mapServiesDiscount(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Discount:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ServiceDiscount.post('/5f7c6a3ea38c126af8aff474e7ffeaf473bae80e', authenticateJWT, logMiddleware, (req, res) => {

	rechargeServiceDiscount.getRechargeServiesDiscount(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Discount:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ServiceDiscount.post('/add-discount',(req, res) => {

	rechargeServiceDiscount.mapServiesDiscount(req.body,res).then(data => res.json(data));
});

ServiceDiscount.post('/get-discount',(req, res) => {

	rechargeServiceDiscount.getRechargeServiesDiscount(req.body,res).then(data => res.json(data));
});

//
module.exports = ServiceDiscount;
