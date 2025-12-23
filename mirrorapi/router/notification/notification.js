const express = require('express');
const notificationController = require('../../controller/notification/notification.controller');
const appTypeController = require('../../controller/notification/app_type.controller');
const fcmNotificationController = require('../../controller/notification/fcm_notification.controller');
const notificationCron = require('../../cron/notification/fcm_notification.cron');
const idslevelCron = require('../../cron/referral/idslevel.cron');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 

const notification = express.Router();

const destinationPath = 'uploads/notification';
const fileUpload = configureMulter(destinationPath).single('image');

const endpoints = {
    '/add-notification': 'a10541257fe7fa6bd3f2e0422b287a0304cab4b4',
    '/get-notification': '5dfe9b4e98a6db4b15d381d44d2ebaa1b965a70f',
    '/get-notification-category': 'a29aa177fc78c32cf15df22d81d0d7d7a0496487',
    '/get-app-type': '3c25fb65f1dc491cc8b5ec9d833fa38ed8b93725',
    '/register-fcm-token': '1805329ff272b1a833a0527a4328c6db0c386a81',
    '/get-fcm-notification': 'a34637968c76992fdbb2911b6025e15e2aad555d',
    
};

notification.post('/a10541257fe7fa6bd3f2e0422b287a0304cab4b4',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	
	const fileName = req.file.filename;
	notificationController.addNotification(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Notification:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.post('/5dfe9b4e98a6db4b15d381d44d2ebaa1b965a70f', authenticateJWT, logMiddleware, async (req, res) => {
	
	notificationController.getNotification( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Notification:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.get('/a29aa177fc78c32cf15df22d81d0d7d7a0496487', authenticateJWT, logMiddleware, async (req, res) => {
	
	notificationController.getNotificationCategory( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Notification Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.get('/3c25fb65f1dc491cc8b5ec9d833fa38ed8b93725', authenticateJWT, logMiddleware, async (req, res) => {
	
	appTypeController.getAppType( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get App Type:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.post('/1805329ff272b1a833a0527a4328c6db0c386a81', authenticateJWT, logMiddleware, async (req, res) => {
	
	fcmNotificationController.addFcmTokenRegister( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Register Fcm Token:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.post('/a34637968c76992fdbb2911b6025e15e2aad555d', authenticateJWT, logMiddleware, async (req, res) => {
    
	fcmNotificationController.getFcmNotification( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Fcm Notification:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});



notification.post('/030e3c663b8b979f2d164d53d1ae660b67e6894c', authenticateJWT, logMiddleware, (req, res) => {

	notificationCron.NotificationJob(req,res).then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Send Notification:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


notification.post('/e059a45f3565f55ef54938bfdb5088392920e3ab', authenticateJWT, logMiddleware, (req, res) => {

	notificationCron.NotificationJobAdmin(req,res).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Send Notification Admin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


notification.post('/ae5eabd67d009d3acf1edede18ddb17ec5997dc5', authenticateJWT, logMiddleware, (req, res) => {

	appTypeController.sendEmail(req,res).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

notification.post('/81baeb70757bb180b75416fe3f296e4d0149b743', authenticateJWT, logMiddleware, (req, res) => {

	idslevelCron.ReferIDJob(req,res).then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting check level:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




notification.post('/add-notification',fileUpload, async (req, res) => {
	
	const fileName = req.file.filename;
	notificationController.addNotification(fileName, req.body,res).then(data => res.json(data));
});

notification.post('/get-notification', async (req, res) => {
	
	notificationController.getNotification( req.body,res).then(data => res.json(data));
});

notification.get('/get-notification-category', async (req, res) => {
	
	notificationController.getNotificationCategory( req.body,res).then(data => res.json(data));
});

notification.get('/get-app-type', async (req, res) => {
	
	appTypeController.getAppType( req.body,res).then(data => res.json(data));
});

notification.post('/register-fcm-token', async (req, res) => {
	
	fcmNotificationController.addFcmTokenRegister( req.body,res).then(data => res.json(data));
});

notification.post('/get-fcm-notification', async (req, res) => {
    
	fcmNotificationController.getFcmNotification( req.body,res).then(data => res.json(data));
	
});



notification.post('/send-notification',(req, res) => {

	notificationCron.NotificationJob(req,res).then(data => res.json(data));
});


notification.post('/send-notification-admin',(req, res) => {

	notificationCron.NotificationJobAdmin(req,res).then(data => res.json(data));
});


notification.post('/send-email',(req, res) => {

	appTypeController.sendEmail(req,res).then(data => res.json(data));
});

notification.post('/check-level-cron',(req, res) => {

	idslevelCron.ReferIDJob(req,res).then(data => res.json(data));
});




module.exports = notification;
