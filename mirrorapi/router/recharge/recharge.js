const express = require('express');
const rechargeController = require('../../controller/recharge/recharge.controller');
const rechargeTestController = require('../../controller/recharge/recharge_test.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');


const recharge = express.Router();


const endpoints = {
    '/recharge-cashback-eligibility': '805880501bb5826b5b9306ff0c8518fe26f30560',
    '/make-payment': '6dedab379214aed7d90729f2f290bccd37e88ab2',
    '/recharge-histroy': 'ebf2afb945bb7d02dd95ef376e7cd9b7142345fd',
    '/panel-test': '7442f092f20d00d79fdb4efaa85d2172962ec4ba',
    '/recharge-hold-approved': 'fdfbf5dddb53c5f525bf8b07a57855b37a001b1f',
    '/recharge-reject': 'b41896dc264935ca7e6c7b973142fdffa826cd9a',
    '/make-recharge-test': 'b60154dcc8efaf5aabe33ec5d78aa1401d191e48',
    '/check-notification': '0804f5aafcc9fa0064ae8f9d262907fd737831b5',
    '/make-recharge-testing': '2a49fd6b0fccb20121181c5105b7272626c471b9'
};


recharge.post('/805880501bb5826b5b9306ff0c8518fe26f30560', authenticateJWT, logMiddleware, (req, res) => {
	rechargeController.recharge_cashback_eligibility(req.body,res)
	    .then(data => res.json(data))
    	.catch(error => {
            console.error('Error requesting Recharge Cashback Eligibilty:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

recharge.post('/6dedab379214aed7d90729f2f290bccd37e88ab2', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.recharge(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting make payment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

recharge.post('/7442f092f20d00d79fdb4efaa85d2172962ec4ba', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.panelTest(req.body,res).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Panel Test:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

recharge.post('/ebf2afb945bb7d02dd95ef376e7cd9b7142345fd', authenticateJWT, logMiddleware, async (req, res) => {
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
    rechargeController.rechargeHistoryList(req.body,res).then(data => res.json(data))
    .catch(error => {
            console.error('Error requesting Recharge Histroy:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


recharge.post('/b60154dcc8efaf5aabe33ec5d78aa1401d191e48', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.recharge(req.body,res, ipAddress).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Make Recharge Test:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

recharge.post('/0804f5aafcc9fa0064ae8f9d262907fd737831b5', authenticateJWT, logMiddleware, async (req, res) => {
	rechargeController.shoot_Notification(req.body,res).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Check Notification:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


recharge.post('/fdfbf5dddb53c5f525bf8b07a57855b37a001b1f', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.rechargeHoldApproved(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Recharge Hold Approved:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});

recharge.post('/b41896dc264935ca7e6c7b973142fdffa826cd9a', authenticateJWT, logMiddleware, (req, res) => {
	rechargeController.rechargeReject(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Recharge Reject:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


recharge.post('/2a49fd6b0fccb20121181c5105b7272626c471b9', authenticateJWT, logMiddleware, (req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.recharge(req.body,res, ipAddress)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting make payment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



recharge.post('/recharge-cashback-eligibility',(req, res) => {
	rechargeController.recharge_cashback_eligibility(req.body,res).then(data => res.json(data));
});

recharge.post('/make-payment',(req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.recharge(req.body,res, ipAddress).then(data => res.json(data));
});

recharge.post('/panel-test',(req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.panelTest(req.body,res).then(data => res.json(data));
});

recharge.post('/recharge-histroy', async (req, res) => {
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
    rechargeController.rechargeHistoryList(req.body,res).then(data => res.json(data));
});


recharge.post('/make-recharge-test',(req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.recharge(req.body,res, ipAddress).then(data => res.json(data));
});


recharge.post('/make-recharge-testing',(req, res) => {
    const ipAddress =req.clientIp;
	//rechargeTestController.recharge(req.body,res, ipAddress).then(data => res.json(data));
	rechargeController.recharge(req.body,res, ipAddress).then(data => res.json(data));
});

recharge.post('/check-notification', async (req, res) => {
	rechargeController.shoot_Notification(req.body,res).then(data => res.json(data));
});


recharge.post('/recharge-hold-approved',(req, res) => {
    const ipAddress =req.clientIp;
	rechargeController.rechargeHoldApproved(req.body,res, ipAddress).then(data => res.json(data));
});

recharge.post('/recharge-reject',(req, res) => {
	rechargeController.rechargeReject(req.body,res).then(data => res.json(data));
});

module.exports = recharge;
