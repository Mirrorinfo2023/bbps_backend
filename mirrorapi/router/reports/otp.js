const express = require('express');
const OtpController = require('../../controller/reports/otp.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 


const Otp = express.Router();

const endpoints = {
    '/otp': '7a20aecd2cb38bc00e301d11d10224588104c366',
};



Otp.post('/7a20aecd2cb38bc00e301d11d10224588104c366', authenticateJWT, logMiddleware, async (req, res) => {
    OtpController.otpReport(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Otp:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Otp.post('/otp', async (req, res) => {
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
	
    OtpController.otpReport(req.body,res).then(data => res.json(data));
});


//
module.exports = Otp;
