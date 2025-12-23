const express = require('express');
const walletController = require('../../controller/wallet/wallet.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const wallet = express.Router();

const endpoints = {
    '/get-wallet-balance': 'e1af0d84d643e7c955bee1ee6d03a8b9a88a07fd',
    '/get-upi': 'bef0c0a17a8e08250ed3f01d12a3d90a5513685f',
    '/credit-debit-income-to-user': 'd7dfaf86f2ab8c7013f268736ab747e07bd8558e',
    '/get-balance-test': '3d0426cb4eecf64d963966f6da3852804c20a951',
        
};

wallet.post('/e1af0d84d643e7c955bee1ee6d03a8b9a88a07fd', authenticateJWT, logMiddleware, (req, res) => {

	walletController.getWalletBalance(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Wallet Balance:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
wallet.get('/bef0c0a17a8e08250ed3f01d12a3d90a5513685f', authenticateJWT, logMiddleware, (req, res) => {

	walletController.getUpiId(req,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Upi:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

wallet.post('/d7dfaf86f2ab8c7013f268736ab747e07bd8558e', authenticateJWT, logMiddleware, async (req, res) => {
	
    walletController.creditDebitIncomeToUser(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Credit Debit income to user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


wallet.post('/3d0426cb4eecf64d963966f6da3852804c20a951', authenticateJWT, logMiddleware, async (req, res) => {
	
    walletController.getWalletBalanceTest(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting get balance Test:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



wallet.post('/get-wallet-balance',(req, res) => {

	walletController.getWalletBalance(req.body,res).then(data => res.json(data));
});
wallet.get('/get-upi',(req, res) => {

	walletController.getUpiId(req,res).then(data => res.json(data));
});

wallet.post('/credit-debit-income-to-user', async (req, res) => {
	
    walletController.creditDebitIncomeToUser(req.body,res).then(data => res.json(data));
});


wallet.post('/bulk-credit-debit-income', async (req, res) => {
	
    walletController.bulkCreditDebitIncome(req.body,res).then(data => res.json(data));
});

wallet.post('/get-balance-test', async (req, res) => {
	
    walletController.getWalletBalanceTest(req.body,res).then(data => res.json(data));
});



//
module.exports = wallet;
