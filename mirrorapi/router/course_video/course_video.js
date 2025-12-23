const express = require('express');
const courseVideoController = require('../../controller/course_video/course_video.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const course_video = express.Router();

const destinationPath = './uploads/video_category';
const fileUpload = configureMulter(destinationPath).single('image');


const endpoints = {
    '/get-video-list': '1f26852c050c3b94cddee4bd73cc2a40b4a1f2f1',
    '/get-videos-admin': 'b469cf21e80b0fa0e85d3395d46e166a1ba11898',
    '/add-course-video': 'bd1288f00cc1808cbfb80d733cb27679270cf32f',
    '/get-video-course': 'b7ca2cdfce8d1ec0812385316c76e50d31e6f693',
    '/update-video-course': '40554376bbb6e31e0bc64423ded5cc004fb482cb',
    '/update-course-status': 'bdbb2b9906271845aa0b56afb52ac99d0d1cdbea'
};

course_video.post('/1f26852c050c3b94cddee4bd73cc2a40b4a1f2f1', authenticateJWT, logMiddleware, async (req, res) => {
	
	courseVideoController.getVideoList(req.body,res).then(data => res.json(data));
});

course_video.post('/b469cf21e80b0fa0e85d3395d46e166a1ba11898', authenticateJWT, logMiddleware, async (req, res) => {
	courseVideoController.getVideoListAdmin(req.body,res).then(data => res.json(data));
});


course_video.post('/bd1288f00cc1808cbfb80d733cb27679270cf32f',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	const fileName = req.file.filename;
	courseVideoController.addCourseVideo(fileName, req.body,res).then(data => res.json(data));
});


course_video.post('/b7ca2cdfce8d1ec0812385316c76e50d31e6f693', authenticateJWT, logMiddleware, async (req, res) => {
	courseVideoController.getVideoCourses(req.body,res).then(data => res.json(data));
});

course_video.post('/40554376bbb6e31e0bc64423ded5cc004fb482cb',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	const fileName = req.file.filename;
	courseVideoController.updateVideoCourse(fileName, req.body,res).then(data => res.json(data));
});

course_video.post('/bdbb2b9906271845aa0b56afb52ac99d0d1cdbea', authenticateJWT, logMiddleware, async (req, res) => {
	// const fileName = req.file.filename;
	courseVideoController.updateVideoCourseStatus(req.body,res).then(data => res.json(data));
});





course_video.post('/get-video-list', async (req, res) => {
	
	courseVideoController.getVideoList(req.body,res).then(data => res.json(data));
});

course_video.post('/get-videos-admin', async (req, res) => {
	courseVideoController.getVideoListAdmin(req.body,res).then(data => res.json(data));
});


course_video.post('/add-course-video',fileUpload, async (req, res) => {
	const fileName = req.file.filename;
	courseVideoController.addCourseVideo(fileName, req.body,res).then(data => res.json(data));
});


course_video.post('/get-video-course', async (req, res) => {
	courseVideoController.getVideoCourses(req.body,res).then(data => res.json(data));
});

course_video.post('/update-video-course',fileUpload, async (req, res) => {
	const fileName = req.file.filename;
	courseVideoController.updateVideoCourse(fileName, req.body,res).then(data => res.json(data));
});

course_video.post('/update-course-status', async (req, res) => {
	// const fileName = req.file.filename;
	courseVideoController.updateVideoCourseStatus(req.body,res).then(data => res.json(data));
});




module.exports = course_video;
