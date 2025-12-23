const express = require('express');
const planController = require('../../controller/plan/plan.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const mplan = express.Router();


const endpoints = {
    '/get-plan': 'ae92b245c360cdc9c1e6aba93d0f1fb4b1bbe1cc',
    '/get-offer-plan': 'b8ff50760f4096f61c509fd28c503063060156e2',
    '/get-mobile-operator': '922833daa96b124c3d9de9ba182ce9a69be0f11e',
};


mplan.post('/ae92b245c360cdc9c1e6aba93d0f1fb4b1bbe1cc', authenticateJWT, logMiddleware, (req, res) => {

	planController.browsePlan(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


mplan.post('/b8ff50760f4096f61c509fd28c503063060156e2', authenticateJWT, logMiddleware, (req, res) => {

	planController.rofferPlan(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Offer Plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


mplan.post('/922833daa96b124c3d9de9ba182ce9a69be0f11e', authenticateJWT, logMiddleware, (req, res) => {

	planController.checkOperator(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Mobile Operator:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


mplan.post('/get-plan',(req, res) => {

	planController.browsePlan(req.body,res).then(data => res.json(data));
});


mplan.post('/get-offer-plan',(req, res) => {

	planController.rofferPlan(req.body,res).then(data => res.json(data));
});


mplan.post('/get-mobile-operator',(req, res) => {

	planController.checkOperator(req.body,res).then(data => res.json(data));
});

//
module.exports = mplan;
