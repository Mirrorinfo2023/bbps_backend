const express = require('express');
const affiliate_linkController = require('../../controller/affiliate_link/affiliate_link.controller');
const affiliateCatgoryController = require('../../controller/affiliate_link/affiliate_linkCategories.controller');
const cuelinkController = require('../../controller/affiliate_link/cuelinks.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 

const affiliate_link = express.Router();
const destinationPath = 'uploads/affiliate_link';
const fileUpload = configureMulter(destinationPath).single('image');

const invoicedestinationPath = 'uploads/affiliate_link/invoice';
const invoiceUpload = configureMulter(invoicedestinationPath).single('image');




 const endpoints = {
    '/get-affiliate-category': '6e4ec75bfe256470804819074a120e9ccfd6cb7e',
    '/get-affiliate-links': 'bd00204ea14e557e454c51823dedd2c0a4da579a',
    '/add-affiliate-Link': 'ab9988b0751d26b32b574cd050f5cb7cf6311c5a',
    '/get-affiliate-links-all': '0c67d4a4f349531562df9f4aafddd24a811db6db',
    '/get-affiliate-links-Admin': 'e72c90df7056e7008a36a0287ebbfb51cf9731d2',
    '/update-affiliate-link-status': 'b9e0cc3cfc57cfbf38164df0b8fc16a72a77e5c2',
    '/get-link': 'b54a06dd1eeca4958790e76736f887a40183b7d5',
    '/update-affiliate-link': '91d1c5b20e70088cd3e1d1c3ea02ca68f817454b',
    '/get-affiliate-user-details': '72c881d7c9725765e2a37351e77500fd1649ea2f',
    '/get-affiliate-user-track-report': 'd2eac550a02e6238e96e808cd4b9e0ff4ebe7ddc',
    '/update-affiliate-track-status': '4a23a6ca7d17731af792568c65f0cbb6a1e6661a',
    '/upload-invoice': '546495c89fdc493ea1707aa96031c773ec515a95',
	'/affiliate-order-history': 'b181d284f6057c53a8e95155befb0e6e4b81decd',
	'/get-affiliate-upload-invoice-report': '391d57946a1fbfb51b0f09f8438f81b8ecfeb60d',
	'/update-invoice-track-status': '44c85ba50ec2ba5c8bb73dbf786f5fecb71cdc7e',
	'/get-latest-affiliate-track': 'b18ff172edba7ecd9a2cae0e601985a4566f5861'
        
};



// get-affiliate-category
affiliate_link.post('/6e4ec75bfe256470804819074a120e9ccfd6cb7e', logMiddleware, authenticateJWT, (req, res) => {
	affiliateCatgoryController.getAffiliateCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting affiliate Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// get-affiliate-links
affiliate_link.post('/bd00204ea14e557e454c51823dedd2c0a4da579a', logMiddleware, authenticateJWT, (req, res) => {
	affiliate_linkController.getAffiliateLinks(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Affiliate Link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// add-affiliate-Link
affiliate_link.post('/ab9988b0751d26b32b574cd050f5cb7cf6311c5a',fileUpload, logMiddleware, authenticateJWT, async (req, res) => {
	const fileName = req.file.filename;
	affiliate_linkController.addAffiliateLink(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Affiliate Link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//get-affiliate-links-all
affiliate_link.post('/0c67d4a4f349531562df9f4aafddd24a811db6db', logMiddleware, authenticateJWT, (req, res) => {
	affiliate_linkController.getAffiliateLinksAll(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Affiliate Link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//get-affiliate-links-Admin
affiliate_link.post('/e72c90df7056e7008a36a0287ebbfb51cf9731d2', logMiddleware, authenticateJWT, (req, res) => {
	affiliate_linkController.getAffiliateLinksAdmin(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Affiliate Link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//update-affiliate-link-status
affiliate_link.post('/b9e0cc3cfc57cfbf38164df0b8fc16a72a77e5c2', logMiddleware, authenticateJWT, (req, res) => {
	affiliate_linkController.updateAffiliateLinkStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update affiliate link status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// get-link
affiliate_link.post('/b54a06dd1eeca4958790e76736f887a40183b7d5', logMiddleware, authenticateJWT, (req, res) => {
	affiliate_linkController.getLink(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//update-affiliate-link
affiliate_link.post('/91d1c5b20e70088cd3e1d1c3ea02ca68f817454b',fileUpload, logMiddleware, authenticateJWT, (req, res) => {
    const fileName = req.file.filename;
	affiliate_linkController.updateAffiliateLink(fileName,req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update affiliate link:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
/******************************************API'S FOR Affiliate TRACK USER DETAILS*******************************************************/

// get-affiliate-user-details
affiliate_link.post('/72c881d7c9725765e2a37351e77500fd1649ea2f', logMiddleware, authenticateJWT, async(req, res) => {
	affiliate_linkController.getAffiliateUserSDetails(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting affiliate user details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//get-affiliate-user-track-report
affiliate_link.post('/d2eac550a02e6238e96e808cd4b9e0ff4ebe7ddc', logMiddleware, authenticateJWT, async(req, res) => {
	affiliate_linkController.getAffiliateUserDetailsReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get affiliate track report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//update-affiliate-track-status
affiliate_link.post('/4a23a6ca7d17731af792568c65f0cbb6a1e6661a', logMiddleware, authenticateJWT, async(req, res) => {
	affiliate_linkController.updateTrackUserStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update affiliate track status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

/******************************************API'S FOR Affiliate TRACK USER DETAILS*********************************************************/


// upload-invoice
affiliate_link.post('/546495c89fdc493ea1707aa96031c773ec515a95', invoiceUpload, async (req, res) => {
	const fileName = req.file.filename;
	affiliate_linkController.upload_invoice(fileName, req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting update affiliate track status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//affiliate-order-history'
affiliate_link.post('/b181d284f6057c53a8e95155befb0e6e4b81decd', async (req, res) => {
	affiliate_linkController.getInvoiceOrderHistory(req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting update affiliate track status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//get-affiliate-upload-invoice-report
affiliate_link.post('/391d57946a1fbfb51b0f09f8438f81b8ecfeb60d',async(req, res) => {
	affiliate_linkController.getAffiliateUploadInvoiceReport(req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting update affiliate track status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//update-invoice-track-status
affiliate_link.post('/44c85ba50ec2ba5c8bb73dbf786f5fecb71cdc7e',(req, res) => {
	affiliate_linkController.updateInvoiceStatus(req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting update affiliate track status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// get-latest-affiliate-track
affiliate_link.post('/b18ff172edba7ecd9a2cae0e601985a4566f5861',(req, res) => {
	affiliate_linkController.getAffiliateUserTrack(req.body,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error in affiliate latest track:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



affiliate_link.post('/get-compaigns', async (req, res) => {
	cuelinkController.get_campaigns(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-affiliatelink', async (req, res) => {
	cuelinkController.get_links(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-offers', async (req, res) => {
	cuelinkController.get_Offers(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-compaigns-admin', async (req, res) => {
	cuelinkController.getMyCampagins(req.body,res).then(data => res.json(data));
});



affiliate_link.post('/get-affiliate-category',(req, res) => {
	affiliateCatgoryController.getAffiliateCategory(req.body,res).then(data => res.json(data));
});

//'/get-affiliate-links'
affiliate_link.post('/get-affiliate-links',(req, res) => {
	affiliate_linkController.getAffiliateLinks(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/add-affiliate-Link',fileUpload, async (req, res) => {
	const fileName = req.file.filename;
	affiliate_linkController.addAffiliateLink(fileName, req.body,res).then(data => res.json(data));
});

//'/get-affiliate-links-all'
affiliate_link.post('/get-affiliate-links-all',(req, res) => {
	affiliate_linkController.getAffiliateLinksAll(req.body,res).then(data => res.json(data));
});


affiliate_link.post('/get-affiliate-links-Admin',(req, res) => {
	affiliate_linkController.getAffiliateLinksAdmin(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/update-affiliate-track-status',(req, res) => {
	affiliate_linkController.updateAffiliateLinkStatus(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-link',(req, res) => {
	affiliate_linkController.getLink(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/update-affiliate-link',fileUpload,(req, res) => {
    const fileName = req.file.filename;
	affiliate_linkController.updateAffiliateLink(fileName,req.body,res).then(data => res.json(data));
});
/******************************************API'S FOR Affiliate TRACK USER DETAILS*******************************************************/
//'/get-affiliate-user-details'
affiliate_link.post('/get-affiliate-user-details',async(req, res) => {
	affiliate_linkController.getAffiliateUserSDetails(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-affiliate-user-track-report',async(req, res) => {
	affiliate_linkController.getAffiliateUserDetailsReport(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/update-affiliate-track-status',async(req, res) => {
	affiliate_linkController.updateTrackUserStatus(req.body,res).then(data => res.json(data));
});

/******************************************API'S FOR Affiliate TRACK USER DETAILS*********************************************************/


affiliate_link.post('/upload-invoice', invoiceUpload, async (req, res) => {
	const fileName = req.file.filename;
	affiliate_linkController.upload_invoice(fileName, req.body,res).then(data => res.json(data));
});

//'/affiliate-order-history'
affiliate_link.post('/affiliate-order-history', async (req, res) => {
	affiliate_linkController.getInvoiceOrderHistory(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/get-affiliate-upload-invoice-report',async(req, res) => {
	affiliate_linkController.getAffiliateUploadInvoiceReport(req.body,res).then(data => res.json(data));
});

affiliate_link.post('/update-invoice-track-status',(req, res) => {
	affiliate_linkController.updateInvoiceStatus(req.body,res).then(data => res.json(data));
});





module.exports = affiliate_link;
