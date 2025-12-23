const express = require('express');
const stateController = require('../../controller/state/state.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const state = express.Router();

const endpoints = {
    '/get-state': 'd23d7537f9a6da6fd195810c82699cb2f81c3d11',
};


state.post('/d23d7537f9a6da6fd195810c82699cb2f81c3d11', logMiddleware, (req, res) => {

	stateController.getState(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get State:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


state.post('/get-state',(req, res) => {

	stateController.getState(req.body,res).then(data => res.json(data));
});

state.post('/get-state-test',(req, res) => {

	stateController.getStateTest(req.body,res).then(data => res.json(data));
});



//
module.exports = state;
