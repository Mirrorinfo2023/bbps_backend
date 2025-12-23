const express = require('express');
const pageController = require('../../controller/page/page.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const page = express.Router();

const endpoints = {
    '/get-page': 'b22516f0a4f88a3a79027dec614ba2dfc442c9c5',
    '/get-pages-admin': '60ecd0ba1b16c34dc7a3cd0c761c59d44e53e55d',
    '/get-page-details': 'bd67f188ee4c2fb79955e5fbf75018143ae01929',
    '/update-page': '7d94231e94c1036e65cccdeac60878e5430e9cd9',
    '/add-page' : '57f3ba8ca0e89e3dd67a9f9da17d15d6e285497d'
};

page.post('/b22516f0a4f88a3a79027dec614ba2dfc442c9c5', authenticateJWT, logMiddleware, (req, res) => {

	pageController.getPageDetails(req.body,res).then(data => res.json(data))   
	    .catch(error => {
            console.error('Error requesting Get Page:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

page.post('/60ecd0ba1b16c34dc7a3cd0c761c59d44e53e55d', authenticateJWT, logMiddleware, (req, res) => {

	pageController.getPageList(req.body,res).then(data => res.json(data))
	   .catch(error => {
            console.error('Error requesting get Pages Admin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

page.post('/bd67f188ee4c2fb79955e5fbf75018143ae01929', authenticateJWT, logMiddleware, (req, res) => {
	pageController.getPage(req.body,res).then(data => res.json(data))
	   .catch(error => {
            console.error('Error requesting Get Page Details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

page.post('/7d94231e94c1036e65cccdeac60878e5430e9cd9', authenticateJWT, logMiddleware, (req, res) => {
	pageController.updatePage(req.body,res).then(data => res.json(data))
	   .catch(error => {
            console.error('Error requesting Update Page:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

page.post('/57f3ba8ca0e89e3dd67a9f9da17d15d6e285497d',(req, res) => {
	pageController.addPage(req.body,res).then(data => res.json(data));
});



page.post('/get-page',(req, res) => {

	pageController.getPageDetails(req.body,res).then(data => res.json(data));
});

page.post('/get-pages-admin',(req, res) => {

	pageController.getPageList(req.body,res).then(data => res.json(data));
});

page.post('/get-page-details',(req, res) => {
	pageController.getPage(req.body,res).then(data => res.json(data));
});

page.post('/update-page',(req, res) => {
	pageController.updatePage(req.body,res).then(data => res.json(data));
});

page.post('/add-page',(req, res) => {
	pageController.addPage(req.body,res).then(data => res.json(data));
});


module.exports = page;
