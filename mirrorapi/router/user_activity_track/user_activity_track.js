const express = require('express');
const activityTrackController = require('../../controller/user_activity_track/user_activity_track.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const contactlog = express.Router();

// const destinationPath = 'public_html/projects/nodejsproject/uploads/meeting';

const destinationPath = './uploads/video_category';
const fileUpload = configureMulter(destinationPath).single('image');


const endpoints = {
    '/add-user-contact-log': 'e234b3d608b29624376a57c611be205d190a03fe',
    '/get-today-notification-content': 'a2dd37876fb4f77b42cc0f987292f06735f61d47',
};

contactlog.post('/e234b3d608b29624376a57c611be205d190a03fe', authenticateJWT, logMiddleware, (req, res) => {
	activityTrackController.addContactLog(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting User Contact Log:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


contactlog.post('/a2dd37876fb4f77b42cc0f987292f06735f61d47', authenticateJWT, logMiddleware, (req, res) => {
	activityTrackController.getNotificationContent(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Notification Content:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


contactlog.post('/add-user-contact-log', async (req, res) => {
	activityTrackController.addContactLog(req.body,res).then(data => res.json(data));
});


contactlog.post('/get-today-notification-content', async (req, res) => {
	activityTrackController.getNotificationContent(req.body,res).then(data => res.json(data));
});





module.exports = contactlog;
