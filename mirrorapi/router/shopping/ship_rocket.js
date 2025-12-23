const express = require('express');
const ShipController = require('../../controller/shopping/ship_rocket.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const ship_rocket = express.Router();



const endpoints = {
    '/update-wallet-amount': '36eaedd6dc5293e46b59c318ae1a47a1df0fda44',
  
};

ship_rocket.post('/36eaedd6dc5293e46b59c318ae1a47a1df0fda44', authenticateJWT, logMiddleware, (req, res) => {
	ShipController.updateWalletBalance(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update wallet Amount:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



ship_rocket.post('/update-wallet-amount',(req, res) => {
	ShipController.updateWalletBalance(req.body,res).then(data => res.json(data));
});



module.exports = ship_rocket;
