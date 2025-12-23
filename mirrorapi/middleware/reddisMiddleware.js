const initializeRedis = require('../../redis');
const redisClient = initializeRedis();

// Cache today’s earnings for all users
const cacheTodayEarnings = async () => {
    const todayKey = 'profit_report:today';
    let cachedData = await redisClient.get(todayKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    return null; // No cache
};

const setTodayEarningsCache = async (data) => {
    const todayKey = 'profit_report:today';
    await redisClient.set(todayKey, JSON.stringify(data), 'EX', 86400); // 24h expiry
};

module.exports = { cacheTodayEarnings, setTodayEarningsCache };
