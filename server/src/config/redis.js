import {createClient} from "redis";
import dotenv from "dotenv";

dotenv.config()

const client = createClient({
    url : process.env.REDIS_URL,
    pingInterval : 1000
})

client.on('error', (err) => console.log("Redis client error:", err));

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('✅ Redis Connected');
    } catch (error) {
        console.error('❌ Redis Connection Failed:', error);
        process.exit(1);
    }
};

export { connectRedis, client };

export default client