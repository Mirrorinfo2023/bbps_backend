
const express = require('express');

const CartController = require('../../controller/cart/cart.controller')
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');


const cart = express.Router();

const endpoints = {
    'add-to-cart': '1a99043aa93a3927da3db0174f6a2258e1996db7',
    'get-cart': 'bba547748575790ed065424899d31bcca5641aa8',
    'update-cart-item': '1769d8589215ad6132ec3d3ccaa275b7a58d0be9'
   
};


cart.post('/1a99043aa93a3927da3db0174f6a2258e1996db7', authenticateJWT, logMiddleware, async (req, res) => {
    CartController.addToCart(req.body, res).then(data => res.json(data));
});


cart.post('/bba547748575790ed065424899d31bcca5641aa8', authenticateJWT, logMiddleware, async (req, res) => {
    CartController.getCartList(req.body, res)
    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting cart items:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


cart.post('/1769d8589215ad6132ec3d3ccaa275b7a58d0be9', authenticateJWT, logMiddleware, async (req, res) => {
    
    CartController.updateCartItem(req.body, res)
    .then(data => res.json(data))
    .catch(error => {
        console.error('Error requesting cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


cart.post('/add-to-cart', async (req, res) => {
    CartController.addToCart(req.body, res).then(data => res.json(data));
});


cart.post('/get-cart', async (req, res) => {
    CartController.getCartList(req.body, res)
    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting cart items:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



cart.post('/update-cart-item', async (req, res) => {
    
    CartController.updateCartItem(req.body, res)
    .then(data => res.json(data))
    .catch(error => {
        console.error('Error requesting cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});




module.exports = cart;