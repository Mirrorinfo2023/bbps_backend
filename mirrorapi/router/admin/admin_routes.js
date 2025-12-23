const express = require('express');
const adminController = require('../../controller/admin/admin_controller');

const adminModule = express.Router();

// Dashboard route
adminModule.get('/dashboardData', (req, res) => {
    adminController.getDashboardData(req, res);
});

adminModule.get('/latestUsersByFilter', (req, res) => { adminController.getLatestUsersByFilter(req, res) });

adminModule.get('/getprimeusers', (req, res) => { adminController.getPrimeUsersByCycle(req, res) });


adminModule.get('/testmessage', (req, res) => { adminController.testEndpoint(req, res) });

adminModule.get('/profitreturnreport', (req, res) => { adminController.getProfitReturnReport(req, res) });

module.exports = adminModule;
