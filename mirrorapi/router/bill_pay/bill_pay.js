const express = require('express');
const billPayController = require('../../controller/bill_pay/bill_pay.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const bbpsauthenticateJWT = require('../../middleware/bbpsauthMiddleware');
const ccavenueController = require('../../controller/bill_pay/ccavenue_payment.controller');
const logMiddleware = require('../../middleware/logMiddleware');
const billDeskController = require('../../controller/billdesk/billdesk.controller');

const BillPayment = express.Router();

const endpoints = {
	'/biller-info': '454a048ee09f82be251a44b976fadb1bf3f3a4e6',
	'/bill-fetch': 'f308eae69c85a45d634afbcc76a5d94609b832dd',
	'/bill-pay': '44672b279d2d2f4cf1a9ea3fae4029bfd1674e39',
	'/bulkFetch': '06c8b786438b945e65c4315fd78e7cf347a62212',
	'/bill-pay-quick': 'f570e94788c88dc689374a4d3d6ee5db74442b1a',
	'/get-payment-option': '55e3f98d27579774b66738a6eb56a56e679d6173',
	'/bill-pay-hold-approve': 'e87404491a0739b5e952c8d64cf240bff3128cbb',
	'/bill-pay-hold-reject': 'faa5056c14d8982ea58cc934a84f9e014c70e0c3',
	'/billdesk-request': 'f68534f063ce1c646c6f583277c58cdbf28aa878',
	'/billdesk-request-test': 'fbb3906322cc5a738e6eb701776514bece1cdab9',
	'/billdesk-payment-status': 'ba55310a1bc86a8727fa0f61325b3078809e6df9'
};


BillPayment.post('/454a048ee09f82be251a44b976fadb1bf3f3a4e6', bbpsauthenticateJWT, logMiddleware, (req, res) => {
	billPayController.billerInfo(req, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Biller info:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

BillPayment.post('/f308eae69c85a45d634afbcc76a5d94609b832dd',bbpsauthenticateJWT, logMiddleware, (req, res) => {
	billPayController.billFetch(req, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting bill fetch:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//bbpsauthenticateJWT, logMiddleware

BillPayment.post('/44672b279d2d2f4cf1a9ea3fae4029bfd1674e39', (req, res) => {
	billPayController.billPay(req, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting bill pay:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

BillPayment.post('/f570e94788c88dc689374a4d3d6ee5db74442b1a', bbpsauthenticateJWT, logMiddleware, (req, res) => {
	billPayController.quickPay(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting bill pay quick:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});


BillPayment.post('/06c8b786438b945e65c4315fd78e7cf347a62212', logMiddleware, (req, res) => {
	billPayController.bulkBiller(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting bulkfetch:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

BillPayment.post('/55e3f98d27579774b66738a6eb56a56e679d6173', logMiddleware, (req, res) => {
	ccavenueController.getOption(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting get payment option:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//bill-pay-hold-approve
BillPayment.post('/e87404491a0739b5e952c8d64cf240bff3128cbb', logMiddleware, (req, res) => {
	billPayController.billPayHoldApprove(req.body, res).then(data => res.json(data));
});

//bill-pay-hold-reject
BillPayment.post('/faa5056c14d8982ea58cc934a84f9e014c70e0c3', logMiddleware, (req, res) => {
	billPayController.billPaymentReject(req.body, res).then(data => res.json(data));
});

// billdesk-request
BillPayment.post('/f68534f063ce1c646c6f583277c58cdbf28aa878', logMiddleware, (req, res) => {
	const ipAddress = req.clientIp;
	billDeskController.billdesk_request(req.body, res, ipAddress).then(data => res.json(data));
});

//billdesk-request-test
BillPayment.post('/fbb3906322cc5a738e6eb701776514bece1cdab9', logMiddleware, (req, res) => {
	const ipAddress = req.clientIp;
	billDeskController.billdesk_request_test(req.body, res, ipAddress).then(data => res.json(data));
});

// billdesk-payment-status
BillPayment.post('/ba55310a1bc86a8727fa0f61325b3078809e6df9', logMiddleware, (req, res) => {
	billDeskController.billdesk_status_check(req.body, res).then(data => res.json(data));
});

// 
BillPayment.post('/biller-info',bbpsauthenticateJWT, (req, res) => {
	billPayController.billerInfo(req.body, res).then(data => res.json(data));
});


BillPayment.post('/bill-fetch', bbpsauthenticateJWT, (req, res) => {
	billPayController.billFetch(req.body, res).then(data => res.json(data));
});


BillPayment.post('/bill-fetch-test', (req, res) => {
	billPayController.billFetchTesting(req.body, res).then(data => res.json(data));
});


BillPayment.post('/bill-pay', bbpsauthenticateJWT, (req, res) => {
	billPayController.billPay(req.body, res).then(data => res.json(data));
});

// '/bulkFetch'
BillPayment.post('/bulkFetch', (req, res) => {
	billPayController.bulkBiller(req.body, res).then(data => res.json(data));
});


BillPayment.post('/bill-pay-quick',bbpsauthenticateJWT, (req, res) => {
	billPayController.quickPay(req.body, res).then(data => res.json(data));
});

//
BillPayment.post('/get-payment-option', (req, res) => {
	ccavenueController.getOption(req.body, res).then(data => res.json(data));
});

BillPayment.post('/bill-pay-hold-approve', (req, res) => {
	billPayController.billPayHoldApprove(req.body, res).then(data => res.json(data));
});

BillPayment.post('/bill-pay-hold-reject', (req, res) => {
	billPayController.billPaymentReject(req.body, res).then(data => res.json(data));
});

// 
BillPayment.post('/billdesk-request', (req, res) => {
	const ipAddress = req.clientIp;
	billDeskController.billdesk_request(req.body, res, ipAddress).then(data => res.json(data));
});

BillPayment.post('/billdesk-request-test', (req, res) => {
	const ipAddress = req.clientIp;
	billDeskController.billdesk_request_test(req.body, res, ipAddress).then(data => res.json(data));
});

// '/billdesk-response'
BillPayment.post('/billdesk-response', (req, res) => {
	billDeskController.billdesk_response(req.body, res).then(data => res.json(data));
});


BillPayment.post('/billdesk-transaction-check', (req, res) => {
	billDeskController.billdesk_status_check(req.body, res).then(data => res.json(data));
});

//
module.exports = BillPayment;
