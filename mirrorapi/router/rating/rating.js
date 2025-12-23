const express = require('express');
const ratingController = require('../../controller/rating/rating.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 

const destinationPath = 'uploads/rating';
const fileUpload = configureMulter(destinationPath).single('image');

const rating = express.Router();


const endpoints = {
    '/add-rating': '7faeaa2d35abf1c4f3d8b09b66887a7f2bb57df1',
    '/get-rating': 'b417f7430a544d2cc3ae1ad4ed67f9e6f51453aa',
 
};

rating.post('/7faeaa2d35abf1c4f3d8b09b66887a7f2bb57df1',fileUpload, authenticateJWT, logMiddleware, (req, res) => {

    let file;

	if (req.file) {
         file = req.file.filename;
    } else {
         file = null;
    }
	
	const fileName = file;

	ratingController.addRating(fileName,req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting Add Rating:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


rating.post('/b417f7430a544d2cc3ae1ad4ed67f9e6f51453aa', authenticateJWT, logMiddleware, (req, res) => {
	ratingController.getRating(req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting Get Rating:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



rating.post('/add-rating',fileUpload,(req, res) => {

    let file;

	if (req.file) {
         file = req.file.filename;
    } else {
         file = null;
    }
	
	const fileName = file;

	ratingController.addRating(fileName,req.body,res).then(data => res.json(data));
});


rating.post('/get-rating',(req, res) => {
	ratingController.getRating(req.body,res).then(data => res.json(data));
});

//
module.exports = rating;
