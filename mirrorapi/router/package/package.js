const express = require('express');
const packageController = require('../../controller/package/package.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 

const destinationPath = 'uploads/vendor';
const fileUpload = configureMulter(destinationPath).single('img');

const packages = express.Router();



const endpoints = {
    'get-packages': '082a7348c9b07d31dfdf26ae6ce71e99d3703f4b',
    'package-purchase': 'eeacebb7b87f1fef5940903d73376b5a39063117',
    'package-purchase-history': '841736fadb1b2b2ddfdfcad8f7a16c4c087b0209'
};


packages.post('/082a7348c9b07d31dfdf26ae6ce71e99d3703f4b',  authenticateJWT, logMiddleware, async (req, res) => {
	packageController.getPackage(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


packages.post('/eeacebb7b87f1fef5940903d73376b5a39063117',  authenticateJWT, logMiddleware, async (req, res) => {
    const ipAddress =req.clientIp;
	packageController.packagePurchase(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

packages.post('/841736fadb1b2b2ddfdfcad8f7a16c4c087b0209', authenticateJWT, logMiddleware, async (req, res) => {
    const ipAddress =req.clientIp;
	packageController.packagePurchaseHistory(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


packages.post('/package-purchase',  async (req, res) => {
    const ipAddress =req.clientIp;
	packageController.packagePurchase(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


packages.post('/package-purchase-history',  async (req, res) => {
    const ipAddress =req.clientIp;
	packageController.packagePurchaseHistory(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


packages.post('/fcf270b419b51742e676be61ce846f5bcba40329',fileUpload,  async (req, res) => {

    //console.log(req.file.filename);
	const fileName = req.file.filename;

	packageController.AddPackage(fileName,req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
packages.post('/18b22f6d444663a32bf2ece9527dcafa3f428a88',fileUpload,  async (req, res) => {
	packageController.UpdatePackage(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


packages.post('/package-purchase-request',  async (req, res) => {
	packageController.packagePurchaseRequest(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

packages.post('/update-package-purchase-status',  async (req, res) => {
    const ipAddress =req.clientIp;
	packageController.updatePackagePurchaseStatus(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting packages purchase request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//
module.exports = packages;
