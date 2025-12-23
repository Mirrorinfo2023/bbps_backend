const express = require('express');
const categoriesController = require('../../controller/course_video/categories.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 


const leadsCategories = express.Router();
const destinationPath = './uploads/video_category';
const fileUpload = configureMulter(destinationPath).single('category_image');



const endpoints = {
    '/add-category': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/get-category': '006db6cc97a5160392932874bf6539ad2f0caea4',
    '/get-child-category': '2ffbd5ac811ff7360bd1599ac7eaf56b689da024',
    '/get-video-category': 'c5e745c59ec5219f05683fb31d419d41f431d61e',
    '/update-status-category': '081c13d3d222eff121b42d31a246e368acdf5c4a',
    '/update-video-category': 'b234bc654e925e853866831a6430b243ff46bb39'
};

leadsCategories.post('/e8c972c374e0499787cf9a6674ee95ba94e2731f',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	const fileName = req.file.filename;
	categoriesController.addCategory(fileName, req.body,res).then(data => res.json(data));
});

leadsCategories.post('/006db6cc97a5160392932874bf6539ad2f0caea4', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/b68e6676a2eacb73d64c914f3281d8d05d9abdb0', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getChildCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/c5e745c59ec5219f05683fb31d419d41f431d61e', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.getvideoCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/081c13d3d222eff121b42d31a246e368acdf5c4a', authenticateJWT, logMiddleware, (req, res) => {

	categoriesController.updateStatusCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/b234bc654e925e853866831a6430b243ff46bb39',fileUpload, authenticateJWT, logMiddleware, (req, res) => {
	const fileName = req.file.filename;
	categoriesController.updateVideoCategory(fileName, req.body,res).then(data => res.json(data));
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

leadsCategories.post('/get-video-category',(req, res) => {

	categoriesController.getvideoCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/update-status-category',(req, res) => {

	categoriesController.updateStatusCategory(req.body,res).then(data => res.json(data));
});

leadsCategories.post('/update-video-category',fileUpload, (req, res) => {
	const fileName = req.file.filename;
	categoriesController.updateVideoCategory(fileName, req.body,res).then(data => res.json(data));
});


//
module.exports = leadsCategories;
