const Redis = require('ioredis');

let redisClient = null;

function initializeRedis() {
    if (!redisClient) {
        redisClient = new Redis(/* your Redis configuration */);
        redisClient.on('connect', () => {
            console.log('Connected to Redis server');
        });
        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }
    return redisClient;
}

module.exports = initializeRedis;
