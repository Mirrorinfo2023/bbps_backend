const express = require('express');
const categoriesController = require('../../controller/affiliate_link/affiliate_linkCategories.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 


const affiliateCategories = express.Router();
const destinationPath = 'uploads/affiliate_category';
const fileUpload = configureMulter(destinationPath).single('category_image');


 const endpoints = {
    '/add-category': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/get-category': '006db6cc97a5160392932874bf6539ad2f0caea4'
        
};


// add-category
affiliateCategories.post('/e8c972c374e0499787cf9a6674ee95ba94e2731f', authenticateJWT, logMiddleware, async (req, res) => {
	// const fileName = req.file.filename;
	categoriesController.addCategory( req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error in add affiliate Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// get-category
affiliateCategories.post('/006db6cc97a5160392932874bf6539ad2f0caea4', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getCategory(req.body,res)
	.then(data => res.json(data)).catch(error => {
            console.error('Error in get affiliate Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




affiliateCategories.post('/add-category', async (req, res) => {
	// const fileName = req.file.filename;
	categoriesController.addCategory( req.body,res).then(data => res.json(data));
});

affiliateCategories.post('/get-category',(req, res) => {

	categoriesController.getCategory(req.body,res).then(data => res.json(data));
});



module.exports = affiliateCategories;
