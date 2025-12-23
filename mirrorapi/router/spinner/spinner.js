const express = require('express');
const SpinnerController = require('../../controller/spinner/spinner.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const Spinner = express.Router();


const endpoints = {
    '/get-spin': '878bd8db91d37f08f7832eb1ac257c5630d02a0c',
    '/get-cashback-users': 'e3684976683a3095455bb2635a5f771e88ed865a',
    '/get-spinner-cashback': '4df54ead729413b48907e5c340ffb34a41f31438',
};


Spinner.post('/878bd8db91d37f08f7832eb1ac257c5630d02a0c', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
    SpinnerController.getCashback(req.body,res, ipAddress)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get SPIN:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


Spinner.post('/e3684976683a3095455bb2635a5f771e88ed865a', authenticateJWT, logMiddleware, (req, res) => {
    SpinnerController.getCashbackUsers(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Cashback User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Spinner.post('/4df54ead729413b48907e5c340ffb34a41f31438', authenticateJWT, logMiddleware, (req, res) => {
    SpinnerController.getSpinnerData(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting get spinner cashback:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    
    
});


Spinner.post('/get-spin', async (req, res) => {
    const ipAddress =req.clientIp;
    SpinnerController.getCashback(req.body,res, ipAddress).then(data => res.json(data));
});


Spinner.post('/get-cashback-users', async (req, res) => {
    SpinnerController.getCashbackUsers(req.body,res).then(data => res.json(data));
});

Spinner.post('/get-spinner-cashback', async (req, res) => {
    SpinnerController.getSpinnerData(req.body,res).then(data => res.json(data));
});

//
module.exports = Spinner;
