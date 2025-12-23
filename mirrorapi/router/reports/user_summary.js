const express = require('express');
const UserSummaryController = require('../../controller/reports/user_summary.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const { configureMulter } = require('../../utility/upload.utility'); 


const UserSummary = express.Router();

const cacheMiddleware = require('../../middleware/cacheMiddleware');
const initializeRedis = require('../../../redis');
const redisClient = initializeRedis();

const endpoints = {
    '/user-summary': 'fb3898964f85e3cd9680f6f23606c2fceffad842',
};


UserSummary.post('/fb3898964f85e3cd9680f6f23606c2fceffad842', authenticateJWT, logMiddleware, cacheMiddleware(900),async (req, res) => {
   /* UserSummaryController.summary(req.body,res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting User Summery:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });*/
        
        try {
                const key = req.originalUrl;
                const data = await UserSummaryController.summary(req.body, res);
                // Cache the data in Redis
                await redisClient.setex(key, 900, JSON.stringify(data));
                
                res.json(data); // Send the response and cache data
                } catch (error) {
                    console.error('Error requesting User Summary:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
});


UserSummary.post('/user-summary', cacheMiddleware(900), async (req, res) => {
    // const userDetails = req.user;
    // const requestData = req.body;
    // const combinedData = {...userDetails,...requestData};
	
    // UserSummaryController.summary(req.body,res).then(data => res.json(data));
     try {
                const key = req.originalUrl;
                const data = await UserSummaryController.summary(req.body, res);
                // Cache the data in Redis
                await redisClient.setex(key, 900, JSON.stringify(data));
                
                res.json(data); // Send the response and cache data
                } catch (error) {
                    console.error('Error requesting User Summary:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
});


//
module.exports = UserSummary;
