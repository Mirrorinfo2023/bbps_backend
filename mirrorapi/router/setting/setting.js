const express = require('express');
const settingController = require('../../controller/setting/setting.controller');
const panelController = require('../../controller/setting/recharge_panel.controller');
const servicesController = require('../../controller/setting/services.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');



const setting = express.Router();



const endpoints = {
    '/get-setting': '1bca5b9ab9cca837253421bedec76bd707fe86b8',
    '/recharge-panel': '99e48a8bd59105af693f6970bba7b39190d0136b',
    '/get-panel': '20e0f44a1debb6980d7cb8e03ad1348499dfd28d',
    '/get-whatsapp-setting': '7a31d17452d0bf82cb568e314db67e48feb5338f',
    '/get-whatsapp-details': '9e5cf0667ab8e9293afbfce50e0231222fb36121',
    '/get-user-eligibility': '643374621f38069fa433485e38fdad77b5c61588'
   
        
};

setting.post('/1bca5b9ab9cca837253421bedec76bd707fe86b8', authenticateJWT, logMiddleware, (req, res) => {

	settingController.SystemSetting(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Setting:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

setting.post('/99e48a8bd59105af693f6970bba7b39190d0136b', authenticateJWT, logMiddleware, (req, res) => {

	panelController.rechargePanel(req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting Recharge Panel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

setting.post('/20e0f44a1debb6980d7cb8e03ad1348499dfd28d', authenticateJWT, logMiddleware, (req, res) => {

	panelController.getPanel(req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting get Panel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

setting.post('/7a31d17452d0bf82cb568e314db67e48feb5338f', authenticateJWT, logMiddleware, (req, res) => {
	settingController.getWhatsapp(req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting whatsapp setting:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

setting.post('/9e5cf0667ab8e9293afbfce50e0231222fb36121', authenticateJWT, logMiddleware, (req, res) => {
	settingController.getwhatsappDetails(req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting whatsapp details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


setting.post('/643374621f38069fa433485e38fdad77b5c61588', authenticateJWT, logMiddleware, (req, res) => {
	servicesController.get_user_service(req.body,res).then(data => res.json(data)).catch(error => {
            console.error('Error requesting user eligibility:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




setting.post('/get-setting',(req, res) => {

	settingController.SystemSetting(req.body,res).then(data => res.json(data));
});

setting.post('/recharge-panel',(req, res) => {

	panelController.rechargePanel(req.body,res).then(data => res.json(data));
});

setting.post('/get-panel',(req, res) => {

	panelController.getPanel(req.body,res).then(data => res.json(data));
});

setting.post('/get-whatsapp-setting',(req, res) => {
	settingController.getWhatsapp(req.body,res).then(data => res.json(data));
});

setting.post('/get-whatsapp-details',(req, res) => {
	settingController.getwhatsappDetails(req.body,res).then(data => res.json(data));
});

setting.post('/get-user-eligibility-test', (req, res) => {
	servicesController.get_user_service_test(req.body,res).then(data => res.json(data)).catch(error => {
            console.error('Error requesting user eligibility:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



//
module.exports = setting;
