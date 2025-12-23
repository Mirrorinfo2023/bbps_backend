const express = require('express');
const feedbackController = require('../../controller/feedback/feedback.controller');
const frequentQuestionariesController = require('../../controller/feedback/frequentQuestion.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const feedback = express.Router();

const destinationPath = 'uploads/feedback';
// const destinationPath = './uploads/feedback';
const fileUpload = configureMulter(destinationPath).single('image');



const endpoints = {
    '/get-feedback-category': 'ed77dffbfc0792816d0a00f05b0d47bcabe65b66',
    '/get-feedback-reason': '063938be72c470c5758523bc343e1db1d01da302',
    '/add-feedback': '7bfe376e3188d3d98cb093fc5a55531d8c59eb65',
    '/get-feedback-report': '267156fd48d2ae207275d1c29cc7c92d1e22f38d',
    '/update-feedback': '5e018aeed4fdad6f2cb1ee03803c18bdda198995',
    '/get-question-answer-list': 'e52e67ddfffe8f538855f8cacfee372b176fb5f5',
    '/add-faq': 'c35307e98af31565e3846e9bc8a9a9453808ee74',
    '/get-faq-report': '169458f2f6c3eaf358923e88f95d4d8a33c712ca',
    '/get-feedback-history': 'c885615aa65b75ce262cc175338d56ad646815b1'
        
};

feedback.post('/ed77dffbfc0792816d0a00f05b0d47bcabe65b66', logMiddleware, authenticateJWT, (req, res) => {

	feedbackController.getFeedbackCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Feddback Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


feedback.post('/063938be72c470c5758523bc343e1db1d01da302', logMiddleware, authenticateJWT, (req, res) => {

	feedbackController.getFeedbackReason(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Feedback Reason:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


feedback.post('/7bfe376e3188d3d98cb093fc5a55531d8c59eb65',fileUpload, logMiddleware, authenticateJWT, async (req, res) => {
	
	const fileName = req.file.filename;
	feedbackController.addFeedback(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Feedback:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


feedback.post('/267156fd48d2ae207275d1c29cc7c92d1e22f38d', logMiddleware, authenticateJWT, async (req, res) => {
	
	feedbackController.getFeedbackReport( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting feedback report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


feedback.post('/5e018aeed4fdad6f2cb1ee03803c18bdda198995', logMiddleware, authenticateJWT, async (req, res) => {
	
	feedbackController.updateFeedbackStatus( req.body,res).then(data => res.json(data))
	  .catch(error => {
            console.error('Error requesting Update feedback:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



//////////////////////////////////////FREQUENTLY ASKED QUESTIONS//////////////////////////////////////
feedback.post('/e52e67ddfffe8f538855f8cacfee372b176fb5f5', logMiddleware, authenticateJWT, async (req, res) => {
	
	frequentQuestionariesController.getFAQList( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting question answer list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
feedback.post('/c35307e98af31565e3846e9bc8a9a9453808ee74', logMiddleware, authenticateJWT, async (req, res) => {
	
	frequentQuestionariesController.addFAQ( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Faq:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
feedback.post('/169458f2f6c3eaf358923e88f95d4d8a33c712ca', logMiddleware, authenticateJWT, async (req, res) => {
	
	frequentQuestionariesController.getFaqReport( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get FAQ Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
//////////////////////////////////////FREQUENTLY ASKED QUESTIONS//////////////////////////////////////

feedback.post('/c885615aa65b75ce262cc175338d56ad646815b1', logMiddleware, authenticateJWT, async (req, res) => {
	feedbackController.getFeedbackHistory( req.body,res).then(data => res.json(data));
});




feedback.post('/get-feedback-category',(req, res) => {

	feedbackController.getFeedbackCategory(req.body,res).then(data => res.json(data));
});



feedback.post('/get-feedback-reason',(req, res) => {

	feedbackController.getFeedbackReason(req.body,res).then(data => res.json(data));
});


feedback.post('/add-feedback',fileUpload, async (req, res) => {
	
// 	const fileName = req.file.filename;
	let file;
	if (req.file) {
         file = req.file.filename;
    } else {
         file = null;
    }
	const fileName = file;
	feedbackController.addFeedback(fileName, req.body,res).then(data => res.json(data));
});


feedback.post('/get-feedback-report', async (req, res) => {
	
	feedbackController.getFeedbackReport( req.body,res).then(data => res.json(data));
});


feedback.post('/update-feedback', async (req, res) => {
	
	feedbackController.updateFeedbackStatus( req.body,res).then(data => res.json(data));
});



//////////////////////////////////////FREQUENTLY ASKED QUESTIONS//////////////////////////////////////
feedback.post('/get-question-answer-list', async (req, res) => {
	
	frequentQuestionariesController.getFAQList( req.body,res).then(data => res.json(data));
});
feedback.post('/add-faq', async (req, res) => {
	
	frequentQuestionariesController.addFAQ( req.body,res).then(data => res.json(data));
});
feedback.post('/get-faq-report', async (req, res) => {
	
	frequentQuestionariesController.getFaqReport( req.body,res).then(data => res.json(data));
});
//////////////////////////////////////FREQUENTLY ASKED QUESTIONS//////////////////////////////////////

feedback.post('/get-feedback-history', async (req, res) => {
	feedbackController.getFeedbackHistory( req.body,res).then(data => res.json(data));
});

module.exports = feedback;
