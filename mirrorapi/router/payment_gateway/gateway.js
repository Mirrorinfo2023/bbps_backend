const express = require('express');
const gatewayController = require('../../controller/payment_gateway/gateway.controller');
const checkoutController = require('../../controller/payment_gateway/checkout.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');



const gateway = express.Router();
const endpoints = {
    '/generate-payment-order': 'ea7d93eb0f6d7396c2338431050333c132eb8592',
    'get-last-transaction': 'b5f4a6bac902b04607346ad97fffb5140e0cc910',
    '/payment-checkout': '5039e7f3252a4afb7ca31c5f63011313cd1639da'
};

gateway.post('/ea7d93eb0f6d7396c2338431050333c132eb8592',(req, res) => {
    const ipAddress =req.clientIp;
	gatewayController.payment_request(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Money Order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


gateway.post('/b5f4a6bac902b04607346ad97fffb5140e0cc910',(req, res) => {

	gatewayController.getLastTransaction(req.body,res).then(data => res.json(data));
});


gateway.post('/5039e7f3252a4afb7ca31c5f63011313cd1639da',(req, res) => {

	checkoutController.paymentRequest(req.body,res).then(data => res.json(data));
});


//phonepe-payment-request

gateway.post('/e4561381f02acefda0b268807bf21a8e27771861', async (req, res) => {
	try {

	  const requestData = req.body;
	  const headers = req.headers; 
	  const { working_key, access_token } = headers;

	  const requiredHeaderKey = 'access_token';
		if (!headers[requiredHeaderKey]) {
			return res.status(400).json({ error: `Please set ${requiredHeaderKey} on Header` });
		}
  
	  const data = await gatewayController.phonepeRequest(requestData, headers, res);
  
	  res.json(data);
	} catch (error) {
	  console.error('Error processing PhonePe payment request:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });

gateway.post('/phonepy-gateway-callback',(req, res) => {
	const ipAddress =req.clientIp;
	gatewayController.phonePecallBack(req.body,res, ipAddress).then(data => res.json(data));
});


//phonepy-payment-check-status
gateway.post('/88a26c9cd9e3aedc14087269f5b903b7749efe56', async (req, res) => {
	try {

	  const requestData = req.body;
	  const headers = req.headers; 
	  const { working_key, access_token } = headers;

	  const requiredHeaderKey = 'access_token';
		if (!headers[requiredHeaderKey]) {
			return res.status(400).json({ error: `Please set ${requiredHeaderKey} on Header` });
		}
  
	  const data = await gatewayController.phonepePaymentCheck(requestData, headers, res);
  
	  res.json(data);
	} catch (error) {
	  console.error('Error processing PhonePe payment request:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });



gateway.post('/metapay-payment-request',(req, res) => {
    const ipAddress =req.clientIp;
	gatewayController.metapay_payment_request(req.body,res, ipAddress).then(data => res.json(data));
});

gateway.post('/metapay-gateway-callback',(req, res) => {
	gatewayController.metapaycallBack(req.body,res).then(data => res.json(data));
});



// Partner bbps
gateway.get('/bbps/biller/category', (req, res) => {

	if (!req.headers['token']) {
		return res.status(400).json({ error: `Please use token and working_key on Header` });
	}

	gatewayController.getBillerCategory(req.headers, req.body,res).then(data => res.json(data));
});

gateway.post('/bbps/biller/get', (req, res) => {

	if (!req.headers['token']) {
		return res.status(400).json({ error: `Please use token and working_key on Header` });
	}
	gatewayController.getBiller(req.headers, req.body,res).then(data => res.json(data));
});

gateway.post('/bbps/biller/info', (req, res) => {
	if (!req.headers['token']) {
		return res.status(400).json({ error: `Please use token and working_key on Header` });
	}

	gatewayController.billerInfo(req.headers, req.body,res).then(data => res.json(data));
});


gateway.post('/bbps/bill/fetch',(req, res) => {
    const ipAddress = req.clientIp;
	if (!req.headers['token']) {
		return res.status(400).json({ error: `Please use token and working_key on Header` });
	}
	gatewayController.billFetch(req.headers,req.body,res, ipAddress).then(data => res.json(data));
});


gateway.post('/bbps/bill/pay',(req, res) => {

	if (!req.headers['token']) {
		return res.status(400).json({ error: `Please use token and working_key on Header` });
	}
	
	gatewayController.billPay(req.headers,req.body,res).then(data => res.json(data));
});


//
module.exports = gateway;