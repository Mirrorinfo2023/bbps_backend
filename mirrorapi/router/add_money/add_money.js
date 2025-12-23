const express = require('express');
const AddMoneyController = require('../../controller/add_money/add_money.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const cronaddmoneyController = require('../../cron/add_money/AddMoney.cron');

const { configureMulter } = require('../../utility/upload.utility'); 


const AddMoney = express.Router();
const destinationPath = 'uploads/add_money';
const fileUpload = configureMulter(destinationPath).single('img');

const endpoints = {
    '/add-money-request': '53aeb245864f03638400271b8a13ac38bad62be5',
    '/add-money-order': '73697b4574fc8005d16a942782a86562b6760252',
    '/add-money-list': '2ffbd5ac811ff7360bd1599ac7eaf56b689da024',
    '/update-add-money': '5242f89dd23b3e850a2e8eb1d935b80206bff9e0',
    '/add-money-histroy': '098263ebb9bde3adcfc7761f4072b46c9fc7e9eb'
};

AddMoney.post('/53aeb245864f03638400271b8a13ac38bad62be5', fileUpload, logMiddleware, async (req, res) => {
    if (req.file.fileValidationError) {
        return res.status(400).json({ status: 400, error: req.fileValidationError });
    }
    const fileName = req.file.filename;
    AddMoneyController.addMoneyRequest(fileName, req, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Add Money Request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Add money order
AddMoney.post('/73697b4574fc8005d16a942782a86562b6760252', logMiddleware, authenticateJWT, async (req, res) => {

	AddMoneyController.addMoneyOrder(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Money Order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Add money list
AddMoney.post('/2ffbd5ac811ff7360bd1599ac7eaf56b689da024', logMiddleware, authenticateJWT, async (req, res) => {
    
    AddMoneyController.addMoneyRequestReport(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Add Money List:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// update add money
AddMoney.post('/5242f89dd23b3e850a2e8eb1d935b80206bff9e0', logMiddleware, authenticateJWT, async (req, res) => {
	ipAddress =req.clientIp;
    AddMoneyController.updateMoneyStatus(req.body,res,ipAddress)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting update add Money:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Add money history
AddMoney.post('/098263ebb9bde3adcfc7761f4072b46c9fc7e9eb', async (req, res) => {
    AddMoneyController.addMoneyRequestHistory(req.body,res)
    .then(data => res.json(data))
    .catch(error => {
            console.error('Error in add money history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




AddMoney.post('/add-money-request' ,fileUpload, async (req, res) => {
	if (req.file.fileValidationError) {
		// Handle file validation errors
		return res.status(400).json({ status: 400, error: req.fileValidationError });
	}
	const fileName = req.file.filename;
	AddMoneyController.addMoneyRequest(fileName, req.body,res).then(data => res.json(data));
});


AddMoney.post('/add-money-order',async (req, res) => {

	AddMoneyController.addMoneyOrder(req.body,res).then(data => res.json(data));
});


AddMoney.post('/add-money-list', async (req, res) => {
    
    AddMoneyController.addMoneyRequestReport(req.body,res).then(data => res.json(data));
});

AddMoney.post('/update-add-money', async (req, res) => {
	ipAddress =req.clientIp;
    AddMoneyController.updateMoneyStatus(req,res,ipAddress).then(data => res.json(data));
});


//add-money-histroy
AddMoney.post('/add-money-histroy', async (req, res) => {
    AddMoneyController.addMoneyRequestHistory(req.body,res).then(data => res.json(data));
});


AddMoney.post('/excute-cron', async (req, res) => {
    cronaddmoneyController.WalletJob(req.body,res).then(data => res.json(data));
});


module.exports = AddMoney;
