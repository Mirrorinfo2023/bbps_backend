const express = require('express');
const rechargeController = require('../../controller/recharge/recharge.controller');
const phonepeController = require('../../controller/phonepe/phonepe.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');



const callBack = express.Router();


callBack.get('/omegaCallback',(req, res) => {
	const ipAddress =req.clientIp;
	rechargeController.omegaCallback(req.body,res, req.query, ipAddress).then(data => res.json(data));
});

callBack.get('/payboomCallback',(req, res) => {
	const ipAddress =req.clientIp;
	rechargeController.payboomCallback(req.body,res, req.query, ipAddress).then(data => res.json(data));
});

callBack.get('/tekdigiCallback',(req, res) => {
	const ipAddress =req.clientIp;
	rechargeController.tekdigiCallback(req.body,res, req.query, ipAddress).then(data => res.json(data));
});


callBack.get('/ambikaCallback',(req, res) => {
	const ipAddress =req.clientIp;
	rechargeController.ambikaCallback(req.body,res, req.query, ipAddress).then(data => res.json(data));
});

callBack.get('/kkpaymentCallback',(req, res) => {
	const ipAddress =req.clientIp;
	rechargeController.kkCallback(req.body,res, req.query, ipAddress).then(data => res.json(data));
});



callBack.post('/phonepeCallback',(req, res) => {
	const ipAddress =req.clientIp;
	phonepeController.phonePeCallbackResponse(req.body,res, req.query, ipAddress).then(data => res.json(data));
});


//
module.exports = callBack;
