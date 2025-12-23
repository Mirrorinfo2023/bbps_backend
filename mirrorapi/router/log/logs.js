const express = require('express');
const recentAppUseController = require('../../controller/logs/recent_use_app.controller');
const userActionController = require('../../controller/logs/user_action.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const destinationPath1 = 'uploads/referral/task';
const fileUpload = configureMulter(destinationPath1).single('image');

const RecentAppUse = express.Router();

const endpoints = {
    '/recent-app-use': 'be73328de90054a298492739452104ae92c2259d',
    '/user-action-log': 'ac9e00dee34fc7aa3a4a3c1fce59687d6692c03b',
	'/user-log': 'dd45b284e58675cc86d9d21c43d5e7b01080ff87',
	'/user-history': '8bfb991219038f7a6d6280638842ddcb231dac71',
	'/user-add-show': '83e391a2187df82b00469f4d9763944d787905b0',
	'/add-referral-task': '25ADE2A63E2457324F3FFE3F5FC8B2418DFF76A7',
	'/user-data-notification': '1327eb5d664b5a90e612f3c106584092e9087d74',
		'/task-history': '1ea6e51f2fa628c26bfc0a5be24c7fb55cfd2ac6',
	
   
};



RecentAppUse.post('/be73328de90054a298492739452104ae92c2259d', authenticateJWT, logMiddleware, (req, res) => {
	recentAppUseController.RecentAppUseLog(req.body,res)
	   .then(data => res.json(data))
	   .catch(error => {
            console.error('Error requesting Recent App Use:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

RecentAppUse.post('/ac9e00dee34fc7aa3a4a3c1fce59687d6692c03b', authenticateJWT, logMiddleware, (req, res) => {
	userActionController.user_action_log(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting User Action Log:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


RecentAppUse.get('/dd45b284e58675cc86d9d21c43d5e7b01080ff87',authenticateJWT, logMiddleware,(req, res) => {
 const { user_id, request_type,task_id } = req.query;
    userActionController.user_log({ user_id, request_type,task_id }, res)
        .then(data => res.json(data));
});


RecentAppUse.post('/8bfb991219038f7a6d6280638842ddcb231dac71',authenticateJWT, logMiddleware,(req, res) => {
 userActionController.user_todayHistory(req.body,res).then(data => res.json(data));
});

RecentAppUse.post('/83e391a2187df82b00469f4d9763944d787905b0', logMiddleware, (req, res) => {
	userActionController.user_adds_log(req.body,res).then(data => res.json(data));
});

RecentAppUse.post('/1327eb5d664b5a90e612f3c106584092e9087d74', logMiddleware, (req, res) => {
	userActionController.user_data_notification(req.body,res).then(data => res.json(data));
});



RecentAppUse.post('/recent-app-use',(req, res) => {
	recentAppUseController.RecentAppUseLog(req.body,res).then(data => res.json(data));
});

RecentAppUse.post('/user-action-log',(req, res) => {
	userActionController.user_action_log(req.body,res).then(data => res.json(data));
});


RecentAppUse.get('/user-log',logMiddleware,(req, res) => {
 const { user_id, request_type,task_id } = req.query;
    userActionController.user_log({ user_id, request_type,task_id }, res)
        .then(data => res.json(data));
});


RecentAppUse.post('/user-history',logMiddleware,(req, res) => {
 userActionController.user_todayHistory(req.body,res).then(data => res.json(data));
});

RecentAppUse.post('/1ea6e51f2fa628c26bfc0a5be24c7fb55cfd2ac6',(req, res) => {
 userActionController.TaskHistory(req.body,res).then(data => res.json(data));
});



RecentAppUse.post('/user-add-show',(req, res) => {
	userActionController.user_adds_log(req.body,res).then(data => res.json(data));
});

//authenticateJWT
RecentAppUse.post('/25ADE2A63E2457324F3FFE3F5FC8B2418DFF76A7',fileUpload,logMiddleware, async (req, res) => {
    
    
	const fileName = req.file.filename;
	userActionController.addReferralTask(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

RecentAppUse.post('/add-test-sxcvnmhjfs',(req, res) => {
	recentAppUseController.Test(req.body,res).then(data => res.json(data));
});
RecentAppUse.get('/getTestlist',(req, res) => {
	recentAppUseController.getTestlist(req.body,res).then(data => res.json(data));
});

RecentAppUse.post('/user-data-notification',(req, res) => {
	userActionController.user_data_notification(req.body,res).then(data => res.json(data));
});


module.exports = RecentAppUse;
