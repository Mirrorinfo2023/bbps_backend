const express = require('express');
const bannerController = require('../../controller/banners/banner.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility');

const destinationPath = 'uploads/banners';

// upload in the localstorage with multer
const fileUpload = configureMulter(destinationPath).single('img');



const multer = require('multer');
// const storage = multer.memoryStorage(); // use memory to send buffer to B2
// const fileUpload = multer({ storage }).single('img');

const banner = express.Router();

const endpoints = {
	'/get-banner': '338876c40d469f2abe060d986593e12dfc9aa48c',
	'/get-banner-report': 'b0922bbeca57785f0add2136bca4786594e739cd',
	'/update-banner-status': 'ddeb0530275df10eb908150c0c14f0a7c10dd586',
	'/get-banner-category': '66a815be731fee133d7ecc8f240447c14e770b83',
	'/add-new-banner': '848c9e6b17fd0bab24254d057a09a88e8db32bcc',
};

//get-banner
banner.post('/338876c40d469f2abe060d986593e12dfc9aa48c', logMiddleware, authenticateJWT, (req, res) => {

	bannerController.getBanner(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Get Banner:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//get-banner-report
banner.post('/b0922bbeca57785f0add2136bca4786594e739cd', logMiddleware, authenticateJWT, (req, res) => {

	bannerController.getBannerReport(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Get Banner Report:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//update-banner-status
banner.post('/ddeb0530275df10eb908150c0c14f0a7c10dd586', logMiddleware, authenticateJWT, (req, res) => {

	bannerController.updateBannerStatus(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Update Banner Status:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//get-banner-category
banner.post('/66a815be731fee133d7ecc8f240447c14e770b83', logMiddleware, authenticateJWT, (req, res) => {

	bannerController.getBannerCategory(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Banner Category:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

//add-new-banner
banner.post('/848c9e6b17fd0bab24254d057a09a88e8db32bcc', logMiddleware, authenticateJWT, (req, res) => {
	const fileName = req.file;
	bannerController.addBanner(req.file, req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Add Banner:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

banner.post('/get-banner', logMiddleware, authenticateJWT, (req, res) => {
	bannerController.getBanner(req.body, res); // controller handles res.json()
});

banner.post('/get-banner-report', (req, res) => {

	bannerController.getBannerReport(req, res);
});
banner.post('/get-categorywise-banner-report', (req, res) => {

	bannerController.getBannerReportbycategory(req, res);
});

banner.post('/update-banner-status', (req, res) => {

	bannerController.updateBannerStatus(req.body, res);
});

banner.get('/get-banner-category', (req, res) => {

	bannerController.getBannerCategory(req.body, res);
});

// const upload = multer({ dest: 'uploads/' });
// banner.post('/add-new-banner', upload.single("img"), async (req, res) => {
// 	console.log("hello", req.file);

// 	if (!req.file) {
// 		return res.status(400).json({ status: 400, message: "No file uploaded" });
// 	}

// 	// Pass req and res directly
// 	await bannerController.addBanner(req, res);
// });


const bannerUpload = configureMulter('uploads/banners').single('img');

banner.post('/add-new-banner', logMiddleware, (req, res) => {
    bannerUpload(req, res, async (err) => {
        if (err) return res.status(500).json({ status: 500, message: err.message });

        if (!req.file) return res.status(400).json({ status: 400, message: "No file uploaded" });

        try {
            await bannerController.addBanner(req, res);  // req.file is now available in controller
        } catch (error) {
            console.error('Error in addBanner:', error);
            res.status(500).json({ status: 500, message: error.message });
        }
    });
});
// Get all banner images
banner.get("/list-banner-images", (req, res) => bannerController.getAllBannerImages(req, res));


module.exports = banner;
