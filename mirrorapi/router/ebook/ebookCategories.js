const express = require('express');
const ebookCategoryController = require('../../controller/ebook/ebookCategory.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const ebookCategory = express.Router();


const endpoints = {
    '/get-category': '006db6cc97a5160392932874bf6539ad2f0caea4',
    '/add-category': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/update-status': 'c47742a47f95494d4ae9f39171b1900745c703df',
    '/get-category-data': '8b2ff2806f93320c67953d8562cab1c947c263d9',
    '/update-category': 'b2d693d17afe90dc9f365b4fb12dce684c54a908',
};

ebookCategory.post('/006db6cc97a5160392932874bf6539ad2f0caea4', logMiddleware, authenticateJWT, (req, res) => {
	ebookCategoryController.getCategoryList(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebookCategory.post('/e8c972c374e0499787cf9a6674ee95ba94e2731f', logMiddleware, authenticateJWT, (req, res) => {
	ebookCategoryController.addCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting addCategory:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebookCategory.post('/c47742a47f95494d4ae9f39171b1900745c703df', logMiddleware, authenticateJWT, (req, res) => {
	ebookCategoryController.updateCategoryStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update Status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebookCategory.post('/8b2ff2806f93320c67953d8562cab1c947c263d9', logMiddleware, authenticateJWT, (req, res) => {
	ebookCategoryController.getcategoryData(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebookCategory.post('/b2d693d17afe90dc9f365b4fb12dce684c54a908', logMiddleware, authenticateJWT, (req, res) => {
	ebookCategoryController.updateCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




ebookCategory.post('/get-category',(req, res) => {
	ebookCategoryController.getCategoryList(req.body,res).then(data => res.json(data));
});

ebookCategory.get('/get-category',(req, res) => {
	ebookCategoryController.getCategoryList(req.body,res).then(data => res.json(data));
});

ebookCategory.post('/add-category',(req, res) => {
	ebookCategoryController.addCategory(req.body,res).then(data => res.json(data));
});

ebookCategory.post('/update-status',(req, res) => {
	ebookCategoryController.updateCategoryStatus(req.body,res).then(data => res.json(data));
});

ebookCategory.post('/get-category-data',(req, res) => {
	ebookCategoryController.getcategoryData(req.body,res).then(data => res.json(data));
});

ebookCategory.post('/update-category',(req, res) => {
	ebookCategoryController.updateCategory(req.body,res).then(data => res.json(data));
});


module.exports = ebookCategory;
