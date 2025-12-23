const express = require('express');
const countriesController = require('../../controller/countries/countries.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');


const countries = express.Router();


const endpoints = {
    '/get-countries': '8f8b98d6e5b01b9822050ede3c5d3ef017cf9d8d',
};

countries.get('/8f8b98d6e5b01b9822050ede3c5d3ef017cf9d8d', logMiddleware, (req, res) => {

	countriesController.getCountries(req.query,res)
	    .then(data => res.json(data)) 
	    .catch(error => {
            console.error('Error requesting Get Countries:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



countries.get('/get-countries',(req, res) => {

	countriesController.getCountries(req.query,res).then(data => res.json(data));
});


//
module.exports = countries;
