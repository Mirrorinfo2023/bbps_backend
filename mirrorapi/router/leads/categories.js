const express = require('express');
const categoriesController = require('../../controller/leads/categories.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 


const leadsCategories = express.Router();
const destinationPath = 'uploads/leads_category';
const fileUpload = configureMulter(destinationPath).single('category_image');


const endpoints = {
    '/add-category': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/get-category': '006db6cc97a5160392932874bf6539ad2f0caea4',
    '/get-child-category': 'b68e6676a2eacb73d64c914f3281d8d05d9abdb0',
    '/get-lead-category': '55f2b36ffe7142259776f916868b2911d08b3594',
    '/update-status-category': '081c13d3d222eff121b42d31a246e368acdf5c4a',
    '/update-lead-category': 'fa9b4fe13fd9fff1aed0fc77d4e4a9c211eab1d5',
};


leadsCategories.post('/e8c972c374e0499787cf9a6674ee95ba94e2731f',fileUpload, authenticateJWT, logMiddleware, (req, res) => {
	const fileName = req.file.filename;
	categoriesController.addCategory(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting add Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

leadsCategories.post('/006db6cc97a5160392932874bf6539ad2f0caea4', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

leadsCategories.post('/b68e6676a2eacb73d64c914f3281d8d05d9abdb0', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getChildCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Child Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

leadsCategories.post('/55f2b36ffe7142259776f916868b2911d08b3594', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getLeadCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Lead Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

leadsCategories.post('/081c13d3d222eff121b42d31a246e368acdf5c4a', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.updateStatusCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update status category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

leadsCategories.post('/fa9b4fe13fd9fff1aed0fc77d4e4a9c211eab1d5', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.updateLeadCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update lead category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});






leadsCategories.post('/add-category',fileUpload, async (req, res) => {
	const fileName = req.file.filename;
	categoriesController.addCategory(fileName, req.body,res).then(data => res.json(data));
});

leadsCategories.post('/get-category',(req, res) => {

	categoriesController.getCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/get-child-category',(req, res) => {

	categoriesController.getChildCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/get-lead-category',(req, res) => {

	categoriesController.getLeadCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/update-status-category',(req, res) => {

	categoriesController.updateStatusCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/update-lead-category',fileUpload,(req, res) => {
const fileName = req.file.filename;
	categoriesController.updateLeadCategory(fileName,req.body,res).then(data => res.json(data));
});


module.exports = leadsCategories;
