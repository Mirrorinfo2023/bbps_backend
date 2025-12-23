const express = require('express');
const passbookController = require('../../controller/reports/passbook.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const cacheMiddleware = require('../../middleware/cacheMiddleware');
const initializeRedis = require('../../../redis');
const redisClient = initializeRedis();

const passbook = express.Router();


const endpoints = {
    '/get-passbook': 'f1d27ae35a092cf166f67073a450fd6d759430e8',
    '/get-cashback-passbook': '3289bc508f971f36c114d93c2bb11979117be3c5',
    '/get-prime-passbook': '1da0647f209c89e214485f6cedfc94975fcbdfda',
    '/get-income-passbook': 'dbafcc3a978c44e1e6255bfda23d108c5463cf16',
    '/get-hold-income-passbook': '8f85d04cb8637d920044199bfab7f44edc650fc8',
};


passbook.post('/f1d27ae35a092cf166f67073a450fd6d759430e8', authenticateJWT, logMiddleware, (req, res) => {
	passbookController.passbook(req.body,res)
	    .then(data => res.json(data))  
	    .catch(error => {
            console.error('Error requesting get Passbook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

passbook.post('/3289bc508f971f36c114d93c2bb11979117be3c5', authenticateJWT, logMiddleware, (req, res) => {
	passbookController.cashbackPassbook(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Cashback Passbook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

passbook.post('/1da0647f209c89e214485f6cedfc94975fcbdfda', authenticateJWT, logMiddleware, (req, res) => {
	passbookController.primePassbook(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get prime passbook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//authenticateJWT

passbook.post('/dbafcc3a978c44e1e6255bfda23d108c5463cf16', logMiddleware, (req, res) => {
	passbookController.incomePassbook(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get income passbook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


passbook.post('/8f85d04cb8637d920044199bfab7f44edc650fc8', authenticateJWT, logMiddleware, (req, res) => {
	passbookController.holdIncomePassbook(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get income passbook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



passbook.post('/get-passbook',(req, res) => {
	passbookController.passbook(req.body,res).then(data => res.json(data));
});

passbook.post('/get-cashback-passbook',(req, res) => {
	passbookController.cashbackPassbook(req.body,res).then(data => res.json(data));
});

passbook.post('/get-prime-passbook',(req, res) => {
	passbookController.primePassbook(req.body,res).then(data => res.json(data));
});


passbook.post('/get-income-passbook',(req, res) => {
	passbookController.incomePassbook(req.body,res).then(data => res.json(data));
});

passbook.post('/get-hold-income-passbook',(req, res) => {
	passbookController.holdIncomePassbook(req.body,res).then(data => res.json(data));
});

//
module.exports = passbook;
