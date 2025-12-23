const express = require('express');
const rechargeServicesOperator = require('../../controller/recharge/rechargeServiceOperator.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const rechargeServiceOperator = express.Router();

const endpoints = {
    '/add-operator-code': '206bf813581c3c892033755934d4211bcfc3533b',
    '/get-operator-code': 'ef9eb3dfc13388a082a9cce653f11cbacc111cd9',
};


rechargeServiceOperator.post('/206bf813581c3c892033755934d4211bcfc3533b', authenticateJWT, logMiddleware, (req, res) => {

	rechargeServicesOperator.mapServiesOperator(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Operator Code:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

rechargeServiceOperator.post('/ef9eb3dfc13388a082a9cce653f11cbacc111cd9', authenticateJWT, logMiddleware, (req, res) => {

	rechargeServicesOperator.getRechargeServiesOperator(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Operator Code:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


rechargeServiceOperator.post('/add-operator-code',(req, res) => {

	rechargeServicesOperator.mapServiesOperator(req.body,res).then(data => res.json(data));
});

rechargeServiceOperator.post('/get-operator-code',(req, res) => {

	rechargeServicesOperator.getRechargeServiesOperator(req.body,res).then(data => res.json(data));
});

//
module.exports = rechargeServiceOperator;
