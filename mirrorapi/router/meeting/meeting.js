const express = require('express');
const meetingController = require('../../controller/meeting/meeting.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility');
const meeting = express.Router();

const destinationPath = 'uploads/meeting';
// const destinationPath = './uploads/meeting';
const fileUpload = configureMulter(destinationPath).single('image');


const endpoints = {
	'/add-meeting': '5cf462f2376d2a717f10a3eb66bf6294d01825b9',
	'/get-meeting-list': '6a6b430a42c06b39a979950519f8d6732aeba6ea',
	'/get-meeting': '42e8346e210d48ec003fc542756243cb1f032a5f',
	'/update-userwise-meeting-details': 'e6e2c7ed01d29c4186419bbb869fcd5756e5d18b',
	'/meeting-user-enrollment-details': '3bacf58678791b87d5e04e8b23d36b55107c2e08',

};

meeting.post('/5cf462f2376d2a717f10a3eb66bf6294d01825b9', fileUpload, logMiddleware, async (req, res) => {

	meetingController.addMeeting(req, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Add Meeting:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});


meeting.post('/6a6b430a42c06b39a979950519f8d6732aeba6ea', logMiddleware, async (req, res) => {

	meetingController.meetingList(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Get Meeting List:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});


meeting.post('/42e8346e210d48ec003fc542756243cb1f032a5f', authenticateJWT, logMiddleware, async (req, res) => {

	meetingController.getMeeting(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting Get Meeting:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

meeting.post('/e6e2c7ed01d29c4186419bbb869fcd5756e5d18b', authenticateJWT, logMiddleware, async (req, res) => {

	meetingController.updateUserwiseMeetingDetails(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting update user meeting details:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});

});

meeting.post('/3bacf58678791b87d5e04e8b23d36b55107c2e08', authenticateJWT, logMiddleware, async (req, res) => {

	meetingController.meetingEnrollReport(req.body, res)
		.then(data => res.json(data))
		.catch(error => {
			console.error('Error requesting meeting enrollment details:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});





meeting.post('/add-meeting', fileUpload, async (req, res) => {
	const fileName = req.file.filename;
	meetingController.addMeeting(fileName, req.body, res).then(data => res.json(data));
});


meeting.post('/get-meeting-list', async (req, res) => {

	meetingController.meetingList(req, res);
});


meeting.post('/get-meeting', async (req, res) => {

	meetingController.getMeeting(req.body, res).then(data => res.json(data));
});

meeting.post('/update-userwise-meeting-details', async (req, res) => {

	meetingController.updateUserwiseMeetingDetails(req.body, res).then(data => res.json(data));

});

meeting.post('/meeting-user-enrollment-details', async (req, res) => {

	meetingController.meetingEnrollReport(req.body, res).then(data => res.json(data));
});


meeting.post('/get-upcoming-list', async (req, res) => {

	meetingController.upcomming_meetings(req, res);
});

meeting.post('/delete-meeting', async (req, res) => {

	meetingController.deleteMeeting(req, res);
});

meeting.post('/update-meeting', async (req, res) => {

	meetingController.updateMeeting(req, res);
});


module.exports = meeting;
