const express = require('express');
const productController = require('../../controller/products/product.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const products = express.Router();



const endpoints = {
    '/get-product': '8a33850983a1706de1f305494233e2437aeb28ad',
    '/UpdateProduct': '74f93c67cb464d16a730c2e371de9c74ce82886d',
    '/AddProduct':'0b413de492a1065e169c81db4a55926e8f756adf'
};

const destinationPath = './uploads/products';
const fileUpload = configureMulter(destinationPath).any();

products.post('/8a33850983a1706de1f305494233e2437aeb28ad', authenticateJWT,  logMiddleware, async(req, res) => {
	productController.getProduct(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


products.post('/74f93c67cb464d16a730c2e371de9c74ce82886d',  async (req, res) => {
	productController.UpdateProduct(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

products.post('/0b413de492a1065e169c81db4a55926e8f756adf',  async (req, res) => {
	productController.AddProduct(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

products.post('/get-product', (req, res) => {
	productController.getProduct(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


products.post('/get-product-list', (req, res) => {
	productController.getProductList(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

products.post('/add-new-product', fileUpload, (req, res) => {
    let fileName = '';
	let fileNames = '';

	if (req.files) {
		fileNames = req.files.map(file => file.filename);
	}
	productController.addProduct(fileName, fileNames, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


products.post('/get-product-by-id', (req, res) => {
	productController.getProductById(req.body,res).then(data => res.json(data));
});

products.post('/delete-product-image', (req, res) => {
	productController.deleteProductImage(req.body,res).then(data => res.json(data));
});

products.post('/update-product-status', (req, res) => {
	productController.updateProductStatus(req.body,res).then(data => res.json(data));
});



products.post('/update-product', fileUpload, (req, res) => {
    let fileName = '';
	let fileNames = '';

	if (req.files) {
		fileNames = req.files.map(file => file.filename);
	}
	productController.updateProduct(fileName, fileNames, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting product :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//
module.exports = products;
