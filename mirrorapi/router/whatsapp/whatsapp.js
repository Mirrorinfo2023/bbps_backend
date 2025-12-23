const express = require('express');
const whatsappCron = require('../../cron/whatsapp/whatsapp.cron');
const logMiddleware = require('../../middleware/logMiddleware');


const whatsapp = express.Router();


const endpoints = {
    '/send-whatsapp': 'd3c2d996e20867ebecb5b7d00f5af8f58d6bc93f',
};

whatsapp.post('/d3c2d996e20867ebecb5b7d00f5af8f58d6bc93f', logMiddleware, (req, res) => {

	whatsappCron.WhatappJob(req,res)
	.then(data => res.json(data))
	.catch(error => {
            console.error('Error requesting Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


whatsapp.post('/send-whatsapp',(req, res) => {

	whatsappCron.AddMoneyWhatappJob(req,res).then(data => res.json(data));
});

module.exports = whatsapp;
