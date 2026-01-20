import client from "../config/redis.js";

const getOrSetCache = async(key, fetchFunction, expirySeconds = 1800) => {
    try {
        const cachedData = await client.get(key)
        if(cachedData) {
            console.log(`Cache Hit: ${key}`);
            return JSON.parse(cachedData);
        }

        console.log(`Cache Miss: ${key}`);
        const freshData = await fetchFunction();
        
        if(freshData) {
            await client.set(key, JSON.stringify(freshData), {
                EX: expirySeconds
            })
        }

        return freshData;
    } catch (error) {
        console.error("Redis Error (Bypassing):", error);
        return await fetchFunction();
    }
}

export default getOrSetCache