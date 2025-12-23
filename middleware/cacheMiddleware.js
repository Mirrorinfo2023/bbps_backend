const initializeRedis = require('../../redis');
const redisClient = initializeRedis();

// Middleware function for caching
const cacheMiddleware = (expirationTime) => async(req, res, next) => {
    const key = req.originalUrl;
   
    try {
        const data = await redisClient.get(key);
        if (data) {
             console.log("res from redis");
           // res.send({ message: JSON.parse(data) });
                const responseData = JSON.parse(data);
                res.json(responseData);
        } else {
            next();
        }
    } catch (error) {
        console.log("Error retrieving data from Redis:", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


module.exports = cacheMiddleware;