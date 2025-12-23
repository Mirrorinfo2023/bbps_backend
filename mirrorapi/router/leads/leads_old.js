const express = require('express');
const leadController = require('../../controller/leads/lead.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const lead = express.Router();

const destinationPath = 'uploads/leads';

//const destinationPath = './uploads/leads';
const fileUpload = configureMulter(destinationPath).single('image');


lead.post('/add-leads',fileUpload, async (req, res) => {
	
	const fileName = req.file.filename;
	leadController.addLead(fileName, req.body,res).then(data => res.json(data));
});

lead.post('/get-leads', async (req, res) => {
	leadController.getLeads(req.body,res).then(data => res.json(data));
});


lead.post('/add-leads-details', async (req, res) => {
	leadController.addLeadDetails(req.body,res).then(data => res.json(data));
});

lead.post('/get-leads-details', async (req, res) => {
	leadController.getLeadDetails(req.body,res).then(data => res.json(data));
});


lead.post('/get-leads-report', async (req, res) => {
	
	leadController.getLeadReport(req.body,res).then(data => res.json(data));
});


lead.post('/get-leads-details-report', async (req, res) => {
	
	leadController.getLeadDetailsReport(req.body,res).then(data => res.json(data));
});


lead.post('/track-lead-user', async (req, res) => {
	
	leadController.getLeadTrackDetails(req.body,res).then(data => res.json(data));
});


lead.post('/get-track-lead-user-report', async (req, res) => {
	
	leadController.getLeadTrackDetailsReport(req.body,res).then(data => res.json(data));

});


lead.post('/update-lead-status', async (req, res) => {
	
	leadController.updateLeadsStatus(req.body,res).then(data => res.json(data));
	
});


lead.post('/get-lead-admin', async (req, res) => {
	
	leadController.getSeletedLeadsAdmin(req.body,res).then(data => res.json(data));
	
});

lead.post('/update-status', async (req, res) => {
	
	leadController.updateStatus(req.body,res).then(data => res.json(data));
	
});

lead.post('/update-lead',fileUpload, async (req, res) => {
	let file;

	if (req.file) {
         file = req.file.filename;
    } else {
         file = null;
    }
	const fileName = file;
	leadController.updateLead(fileName,req.body,res).then(data => res.json(data));
	
});







module.exports = lead;
