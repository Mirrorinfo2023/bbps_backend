const express = require('express');
const courseVideoController = require('../../controller/courses/coursevideo.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const course_video = express.Router();

const endpoints = {
    '/get-video-list': '1f26852c050c3b94cddee4bd73cc2a40b4a1f2f1',
    '/get-videos-admin': 'b469cf21e80b0fa0e85d3395d46e166a1ba11898',
    '/add-course-video': 'bd1288f00cc1808cbfb80d733cb27679270cf32f',
    '/get-video-course': 'b7ca2cdfce8d1ec0812385316c76e50d31e6f693',
    '/update-video-course': '40554376bbb6e31e0bc64423ded5cc004fb482cb',
    '/update-course-status': 'bdbb2b9906271845aa0b56afb52ac99d0d1cdbea',
    '/delete-video-course': 'bdbb2b9906271845aa0b56afb52ac99d0d1cd345',
    '/add-video-course-intraction': 'bdbb2b9906271845aa0b56afb52ac99d0d1cd3df',
    '/get-video-course-intraction': 'b45b2b9906271845aa0b56afb52ac99d0d1cd3df',
    '/get-favorite-video': '215b2b9906271845aa0b56afb52ac99d0d1cd3df',

};
// Add video
course_video.post("/add-video", (req, res) => courseVideoController.addCourseVideo(req, res));

// Update video
course_video.post("/update-video", (req, res) => courseVideoController.updateVideoCourse(req, res));

// Video interaction
course_video.post("/video-interaction", (req, res) => courseVideoController.videoInteraction(req, res));

// Get course video list
course_video.post("/get-videos", (req, res) => courseVideoController.getVideoCourses(req, res));

// Get video details
course_video.post("/get-video-details", (req, res) => courseVideoController.getVideoDetails(req, res));


module.exports = course_video;
