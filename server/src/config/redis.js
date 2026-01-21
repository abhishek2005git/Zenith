import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('❌ Redis Client Error', err));

/**
 * Idempotent Connect Function
 * Ensures we only ever call .connect() once.
 */
const connectRedis = async () => {
    // 1. If already open or connecting, do nothing
    if (client.isOpen) {
        return client;
    }

    try {
        await client.connect();
        console.log('✅ Redis Connected');
    } catch (error) {
        // 2. Catch race conditions where another part of the app connected 
        // while this function was awaiting
        if (error.message === 'Socket already opened') {
            return client;
        }
        console.error('❌ Redis Connection Failed:', error);
        process.exit(1); 
    }
};

export { connectRedis, client };
export default client;