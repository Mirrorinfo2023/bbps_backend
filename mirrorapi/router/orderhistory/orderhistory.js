const express = require('express');
const orderController = require('../../controller/orderhistory/orderhistory.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const router = express.Router();


router.post('/orderhistory',  async (req, res) => {
	orderController.getOrderhistory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting order history :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

module.exports = router;