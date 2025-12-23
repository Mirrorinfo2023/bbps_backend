const express = require('express');
const serviceController = require('../../controller/recharge/rechargeServices.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const rechargeServices = express.Router();


const endpoints = {
    '/add-service': 'f9037c7814e6a783390ebf7487dd7cdad1380efb',
    '/get-service': '81511bc93cd6be112f5fb92495e3c776a419d302',
};



rechargeServices.post('/f9037c7814e6a783390ebf7487dd7cdad1380efb', authenticateJWT, logMiddleware, (req, res) => {

	serviceController.services(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Service:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

rechargeServices.post('/81511bc93cd6be112f5fb92495e3c776a419d302', authenticateJWT, logMiddleware, (req, res) => {

	serviceController.getServices(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Service:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


rechargeServices.post('/add-service',(req, res) => {

	serviceController.services(req.body,res).then(data => res.json(data));
});

rechargeServices.post('/get-service',(req, res) => {

	serviceController.getServices(req.body,res).then(data => res.json(data));
});

//
module.exports = rechargeServices;
