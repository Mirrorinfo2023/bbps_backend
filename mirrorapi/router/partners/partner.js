const express = require('express');
const patnerController = require('../../controller/partners/partner.controller');

const partnerRoute = express.Router();



// partnerRoute.post('/get-admin-balance',(req, res) => {
// 	patnerController.getWalletBalance(req.body,res).then(data => res.json(data));
// });

partnerRoute.post('/get-partners',(req, res) => {
	patnerController.getPartners(req.body,res);
});


partnerRoute.post('/get-partner-transactions',(req, res) => {
	patnerController.getTransactionHistory(req.body,res).then(data => res.json(data));
});

partnerRoute.post('/credit-debit-wallet',(req, res) => {
	patnerController.creditDebitToWallet(req.body,res).then(data => res.json(data));
});

module.exports = partnerRoute;
