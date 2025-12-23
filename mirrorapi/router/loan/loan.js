const express = require('express');
const loanController = require('../../controller/loan/loan.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const loanModule = express.Router();



const endpoints = {
    '/loan-request': '257FA3B11A5A85CC276C77409203576692C9D26B',
     '/Update-Loan-Request': 'df5bf2c47789c8812486d21bd26506201a5623b7',
        '/getLoan-Request-List': '4af1e5c48c835a239fda790472993c693aab8044',
     
   
};


loanModule.post('/257FA3B11A5A85CC276C77409203576692C9D26B',  async (req, res) => {
	loanController.AddLoanRequest(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

loanModule.post('/df5bf2c47789c8812486d21bd26506201a5623b7',  async (req, res) => {
	loanController.UpdateLoanRequest(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
loanModule.get('/4af1e5c48c835a239fda790472993c693aab8044',  async (req, res) => {
	loanController.getLoanRequestList(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//
module.exports = loanModule;
