const express = require('express');
const cityController = require('../../controller/city/city.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const city = express.Router();


const endpoints = {
    '/get-citys': 'e2caa4a86f1cda61fa7efc12c7a8791a8c59bc90',
};

city.post('/e2caa4a86f1cda61fa7efc12c7a8791a8c59bc90', logMiddleware, (req, res) => {

	cityController.getCity(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Citys:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


city.post('/get-citys',(req, res) => {

	cityController.getCity(req.body,res).then(data => res.json(data));
});


//
module.exports = city;
