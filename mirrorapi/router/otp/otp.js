const express = require('express');
const otpController = require('../../controller/otp/otp.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const otp = express.Router();

const endpoints = {
    '/get-otp': '8930cae4a942a0286226f1651dfbff89216174c8',
    '/verify-otp': '3ae2750febeb3583bec28c67c42063120cb72963',
    '/register': '89fce89cab631860e6ed7602c2a8ac2117a07039',
  
        
};


otp.post('/8930cae4a942a0286226f1651dfbff89216174c8', (req, res) => {
	otpController.getOtp(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Otp:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

otp.post('/3ae2750febeb3583bec28c67c42063120cb72963', (req, res) => {

	otpController.VerifyOtp(req.body,res)
	    .then(data => res.json(data))
	     .catch(error => {
            console.error('Error requesting Verify Otp:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

otp.post('/89fce89cab631860e6ed7602c2a8ac2117a07039', (req, res) => {

	otpController.CheckOtp(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Check Otp:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


otp.post('/get-otp',(req, res) => {

	otpController.getOtp(req.body,res).then(data => res.json(data));
});

otp.post('/verify-otp',(req, res) => {

	otpController.VerifyOtp(req.body,res).then(data => res.json(data));
});

otp.post('/check-otp',(req, res) => {

	otpController.CheckOtp(req.body,res).then(data => res.json(data));
});

otp.post('/country-get-otp',(req, res) => {

	otpController.countryGetOtp(req.body,res).then(data => res.json(data));
});


//
module.exports = otp;
