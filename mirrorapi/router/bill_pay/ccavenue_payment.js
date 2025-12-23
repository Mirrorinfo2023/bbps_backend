const express = require('express');
const ccavenueController = require('../../controller/bill_pay/ccavenue_payment.controller');
const authenticateJWT = require('../../middleware/authMiddleware');



const CcavenuePayment = express.Router();

CcavenuePayment.post('/ccavenue-generate-request',(req, res) => {
    const ipAddress =req.clientIp;
	ccavenueController.generateOrder(req.body,res, ipAddress).then(data => res.json(data));
});

CcavenuePayment.post('/ccavenue-callback-response',(req, res) => {
	ccavenueController.ccAvenueResponse(req.body,res).then(data => res.json(data));
});




//
module.exports = CcavenuePayment;
