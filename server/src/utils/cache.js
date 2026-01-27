import client from '../config/redis.js';

/**
 * Smart Caching Wrapper
 * Optimized to handle external API throttling (429 errors)
 */
const getOrSetCache = async (key, fetchFunction, expirySeconds = 3600) => {
    let isRedisDown = false;

    // 1. ATTEMPT TO GET FROM REDIS
    try {
        if (client.isOpen) {
            const cachedData = await client.get(key);
            if (cachedData) {
                console.log(`⚡ Cache HIT: ${key}`);
                return JSON.parse(cachedData);
            }
        }
    } catch (redisError) {
        console.error("⚠️ Redis Read Error:", redisError.message);
        isRedisDown = true;
    }

    // 2. FETCH FRESH DATA
    try {
        console.log(`🐢 Cache MISS/BYPASS: ${key}`);
        const freshData = await fetchFunction();

        // 3. SAVE TO REDIS (if connection is healthy)
        if (!isRedisDown && client.isOpen && freshData) {
            await client.set(key, JSON.stringify(freshData), {
                EX: expirySeconds
            });
        }

        return freshData;
    } catch (apiError) {
        // If the EXTERNAL API is the one that failed (like a 429)
        // We throw the error so the controller can handle fallbacks
        throw apiError;
    }
};

export default getOrSetCache;