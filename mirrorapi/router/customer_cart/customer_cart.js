// routes/customer_address.js
const express = require('express');
const router = express.Router();
const customerCartController = require('../../controller/customer_cart/customer_cart.controller');


router.post('/getcustomercart',  async (req, res) => {
	customerCartController.getCart(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.post('/add-cart', async (req, res) => {
    customerCartController.addCart(req, res);
});

module.exports = router;