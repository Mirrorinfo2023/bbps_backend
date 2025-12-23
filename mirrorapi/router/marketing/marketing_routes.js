const express = require('express');
const MarketingController = require('../../controller/marketing/marketing.controller');

const marketingModule = express.Router();

// Insert marketing content
marketingModule.post('/insert', (req, res) => {
    MarketingController.insertMarketingContent(req, res);
});

// Get all marketing content
marketingModule.get('/all', (req, res) => {
    MarketingController.getAllMarketingContent(req, res);
});

// Get by type
marketingModule.get('/type/:type', (req, res) => {
    MarketingController.getByType(req, res);
});

// Get by templateType
marketingModule.get('/template/:templateType', (req, res) => {
    MarketingController.getByTemplateType(req, res);
});

// Get grouped data (with attributes)
marketingModule.post('/grouped', (req, res) => {
    MarketingController.getGroupedData(req, res);
});

// Update marketing content by id
marketingModule.post('/update/:id', (req, res) => {
  MarketingController.updateMarketingContent(req, res);
});

// Delete marketing content by id
marketingModule.post('/delete/:id', (req, res) => {
  MarketingController.deleteMarketingContent(req, res);
});

module.exports = marketingModule;
