const express = require('express');
const ebookController = require('../../controller/ebook/ebook.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 

const destinationPath = 'uploads/ebookPdf';
const fileUpload = configureMulter(destinationPath).any();

const ebook = express.Router();



const endpoints = {
    '/get-ebook-list': 'ed17795bf5e9af85a4885476188473ba56a71ad6',
    '/get-ebook-details': '74b90ced3b6c9e2621349daf5149dd063ff973b8',
    '/ebook-dashboard': '9f96cd095811578066e6b1382bfb0a82b5f861af',
    '/buy-ebook': '6642bab65d405b900d2003c7ca6303315230ad39',
    '/get-purchase-history': 'a10209b657be958d67b0e66d31c294ac0c36e86d',
    '/get-ebook-invoice': 'ba95c5a32382137eb201b1a2c61fd74590d55b40',
    '/ebook-list': 'ed914e1b6358d452cd0baad795097c6bf1ccc084',
    '/update-ebook-status': '4e91b59616cb27978fed838684dd14f79dc14df5',
    '/get-ebook-data': '12f40908f9f9e83d1dedc80b91ae70b780f46e90',
    '/add-ebook': '943c51160bc0dcef12b798eb0eb9ad89aa31027b',
    '/update-ebook': 'a925b61fbc8fb450354deb8500e8a8fe530cb66a',
    '/get-free-ebook': 'd4e0944fcc2a4f31cc969713cd4f0e382d964317'
};


ebook.post('/ed17795bf5e9af85a4885476188473ba56a71ad6', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookList(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting ebook list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ebook.post('/74b90ced3b6c9e2621349daf5149dd063ff973b8', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookDetails(req.body,res).then(data => res.json(data))
	 .catch(error => {
            console.error('Error requesting Ebbok Details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/9f96cd095811578066e6b1382bfb0a82b5f861af', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookDashboard(req.body,res).then(data => res.json(data))
	 .catch(error => {
            console.error('Error requesting ebook dashboard:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ebook.post('/6642bab65d405b900d2003c7ca6303315230ad39', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.ebookPurchase(req.body,res).then(data => res.json(data))
	 .catch(error => {
            console.error('Error requesting Buy Ebook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ebook.post('/a10209b657be958d67b0e66d31c294ac0c36e86d', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getPurchaseList(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting purchase History:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/ba95c5a32382137eb201b1a2c61fd74590d55b40', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookInvoice(req.body,res).then(data => res.json(data))
	 .catch(error => {
            console.error('Error requesting Ebook Invoice:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/ed914e1b6358d452cd0baad795097c6bf1ccc084', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Ebook List:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/4e91b59616cb27978fed838684dd14f79dc14df5', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.updateEbookStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update Ebook Status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/12f40908f9f9e83d1dedc80b91ae70b780f46e90', logMiddleware, authenticateJWT, (req, res) => {
	ebookController.getEbookData(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Ebook Data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ebook.post('/943c51160bc0dcef12b798eb0eb9ad89aa31027b',fileUpload, logMiddleware, authenticateJWT, (req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	ebookController.addEbookApp(fileName, fileNames,req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Ebook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

ebook.post('/a925b61fbc8fb450354deb8500e8a8fe530cb66a',fileUpload, logMiddleware, authenticateJWT, (req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	ebookController.updateEbook(fileName, fileNames,req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update Ebook:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


ebook.post('/d4e0944fcc2a4f31cc969713cd4f0e382d964317',(req, res) => {
	ebookController.getFreeEbook(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Free Ebook count:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});





ebook.post('/get-ebook-list',(req, res) => {
	ebookController.getEbookList(req.body,res).then(data => res.json(data));
});


ebook.post('/get-ebook-details',(req, res) => {
	ebookController.getEbookDetails(req.body,res).then(data => res.json(data));
});

ebook.post('/ebook-dashboard',(req, res) => {
	ebookController.getEbookDashboard(req.body,res).then(data => res.json(data));
});


ebook.post('/buy-ebook',(req, res) => {
	ebookController.ebookPurchase(req.body,res).then(data => res.json(data));
});


ebook.post('/get-purchase-history',(req, res) => {
	ebookController.getPurchaseList(req.body,res).then(data => res.json(data));
});

ebook.post('/get-ebook-invoice',(req, res) => {
	ebookController.getEbookInvoice(req.body,res).then(data => res.json(data));
});

ebook.post('/ebook-list',(req, res) => {
	ebookController.getEbookReport(req.body,res).then(data => res.json(data));
});

ebook.post('/update-ebook-status',(req, res) => {
	ebookController.updateEbookStatus(req.body,res).then(data => res.json(data));
});

ebook.post('/get-ebook-data',(req, res) => {
	ebookController.getEbookData(req.body,res).then(data => res.json(data));
});


ebook.post('/add-ebook',fileUpload,(req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	ebookController.addEbook(fileName, fileNames,req.body,res).then(data => res.json(data));
});

ebook.post('/update-ebook',fileUpload,(req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	ebookController.updateEbook(fileName, fileNames,req.body,res).then(data => res.json(data));
});


ebook.post('/get-free-ebook',(req, res) => {
	ebookController.getFreeEbook(req.body,res).then(data => res.json(data));
});


module.exports = ebook;
