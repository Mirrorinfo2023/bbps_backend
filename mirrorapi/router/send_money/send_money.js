const express = require('express');
const SendMoneyController = require('../../controller/send_money/send_money.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 


const SendMoney = express.Router();


const endpoints = {
    '/send-money': '9d9a5bf0e229c2340d44805887783031a827d011',
    '/send-money-histroy': 'f5567273ef3f87304e5836a8d3cd1bfc0df63f00',
};

SendMoney.post('/9d9a5bf0e229c2340d44805887783031a827d011', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
    SendMoneyController.sendMoney(req.body,res, ipAddress)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Send Money:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


SendMoney.post('/f5567273ef3f87304e5836a8d3cd1bfc0df63f00', authenticateJWT, logMiddleware, (req, res) => {
    SendMoneyController.sendMoneyList(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Send Money Histroy:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


SendMoney.post('/send-money-test', (req, res) => {
    SendMoneyController.sendMoneyTest(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Send Money Histroy:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});








SendMoney.post('/send-money', async (req, res) => {
    const ipAddress =req.clientIp;
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
	
    SendMoneyController.sendMoney(req.body,res, ipAddress).then(data => res.json(data));
});


SendMoney.post('/send-money-histroy', async (req, res) => {
    
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
	
    SendMoneyController.sendMoneyList(req.body,res).then(data => res.json(data));
});

SendMoney.post('/check-notification', async (req, res) => {

	SendMoneyController.check_Notification(req.body,res).then(data => res.json(data));
});

SendMoney.post('/send-money-test', async (req, res) => {

	SendMoneyController.sendMoneyTest(req.body,res).then(data => res.json(data));
});


//
module.exports = SendMoney;
