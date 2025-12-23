const express = require('express');
const phonepeController = require('../../controller/phonepe/phonepe.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const phonepe = express.Router();


const endpoints = {
    '/pay': 'bfc95e50f828f0aecd632c939fd45c1bf5272127',
    '/check-status': 'fe4377c1db87fe69403f84ba8dcd3883a77f01a0',
    '/payment-request': '0db3156bd697581daee4c197622a61ec1bcc3055',
    '/payment-response': '67fdcae6c0d5714bd23a983962aa834b782f9f6f',
    '/redirect-url': 'c7d90b69c7326dd99053fddd1f2053a7e8113105',
};


// phonepe.post('/bfc95e50f828f0aecd632c939fd45c1bf5272127', logMiddleware, (req, res) => {
// 	phonepeController.makePayment(req.body,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting Pay:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

// phonepe.get('/c7d90b69c7326dd99053fddd1f2053a7e8113105', logMiddleware, (req, res) => {

//     phonepeController.phonepayRedirect(req.body,res, req.query).then(data => res.json(data))
//       .catch(error => {
//             console.error('Error requesting Redirect Url:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

// phonepe.post('/fe4377c1db87fe69403f84ba8dcd3883a77f01a0', logMiddleware, (req, res) => {
// 	phonepeController.checkStatus(req.body,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting Check Status:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

phonepe.post('/0db3156bd697581daee4c197622a61ec1bcc3055', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	phonepeController.paymentRequest(req.body,res, ipAddress).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting Payment Request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// phonepe.post('/67fdcae6c0d5714bd23a983962aa834b782f9f6f', authenticateJWT, logMiddleware, (req, res) => {
// 	phonepeController.paymentResponse(req.body,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting Payment Response:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });


// phonepe.post('/pay',(req, res) => {
// 	phonepeController.makePayment(req.body,res).then(data => res.json(data));
// });

phonepe.get('/redirect-url',(req, res) => {

    phonepeController.phonepayRedirect(req.body,res, req.query).then(data => res.json(data));
});

// phonepe.post('/check-status',(req, res) => {
// 	phonepeController.checkStatus(req.body,res).then(data => res.json(data));
// });

phonepe.post('/payment-request',(req, res) => {
    const ipAddress =req.clientIp;
	phonepeController.paymentRequest(req.body,res, ipAddress).then(data => res.json(data));
});

phonepe.post('/payment-response',(req, res) => {
	phonepeController.paymentResponse(req.body,res).then(data => res.json(data));
});



module.exports = phonepe;
