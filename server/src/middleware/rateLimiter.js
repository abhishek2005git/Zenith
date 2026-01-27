// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import client from '../config/redis.js';

// /**
//  * Zenith Security Shield - Distributed Rate Limiting
//  * * FIX: The 'ERR Command is not available: S' error happens because node-redis v4 
//  * expects an array of strings for sendCommand. By using (...args) we gather the 
//  * strings "SCRIPT", "LOAD", etc. into an array. We must pass that array directly 
//  * without spreading it back out.
//  */

// const wrappedSendCommand = async (...args) => {
//     // Ensure the client is connected
//     if (!client.isOpen) {
//         try {
//             await client.connect();
//         } catch (err) {
//             // Ignore if already connecting
//             if (err.message !== 'Socket already opened') throw err;
//         }
//     }
    
//     // CRITICAL FIX: node-redis v4 expects: sendCommand(['SCRIPT', 'LOAD', '...'])
//     // 'args' is already the array gathered by the rest operator (...args).
//     // DO NOT use ...args here, or it will try to run command 'S'.
//     return client.sendCommand(args);
// };

// // 1. General API Shield (Applied to all /api routes)
// export const apiLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: wrappedSendCommand,
//         prefix: 'zenith-rl-api:',
//     }),
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//         status: 429,
//         message: '🚨 Too many requests from this sector. Systems cooling down for 15 minutes.',
//     },
// });

// // 2. Auth Shield (Strict protection against brute-force attacks)
// export const authLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: wrappedSendCommand,
//         prefix: 'zenith-rl-auth:',
//     }),
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 10,
//     message: {
//         status: 429,
//         message: '🔒 Maximum login attempts reached. Security lockout active for 1 hour.',
//     },
// });

// // 3. Calendar Shield (Protects your Google API Quota)
// export const calendarLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: wrappedSendCommand,
//         prefix: 'zenith-rl-calendar:',
//     }),
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 20,
//     message: {
//         status: 429,
//         message: '📅 Calendar sync limit reached. Please wait an hour before adding more missions.',
//     },
// });
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import client from '../config/redis.js';

const wrappedSendCommand = async (...args) => {
    if (!client.isOpen) {
        try { await client.connect(); } catch (err) {
            if (err.message !== 'Socket already opened') throw err;
        }
    }
    return client.sendCommand(args);
};

export const authLimiter = rateLimit({
    store: new RedisStore({ sendCommand: wrappedSendCommand, prefix: 'zenith-rl-auth:' }),
    windowMs: 60 * 60 * 1000, 
    max: 10,
    skip: (req) => {
        const ip = req.ip || req.connection.remoteAddress;
        return ip === '::1' || ip === '127.0.0.1'; // Skip limit for local traffic
    },
    handler: (req, res) => {
        // Check if the request wants JSON (Axios) or HTML (Browser)
        const isRequestingJson = req.xhr || req.headers.accept?.includes('json');

        if (isRequestingJson) {
            return res.status(429).json({
                status: 429,
                message: "🔒 Security lockout active. Please try again in an hour."
            });
        }

        // Direct browser navigation (like clicking the Login button)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=rate_limit`);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 1. General API Shield
export const apiLimiter = rateLimit({
    store: new RedisStore({ sendCommand: wrappedSendCommand, prefix: 'zenith-rl-api:' }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: '🚨 Systems cooling down. Please wait 15 minutes.' },
});



// 3. Calendar Shield
export const calendarLimiter = rateLimit({
    store: new RedisStore({ sendCommand: wrappedSendCommand, prefix: 'zenith-rl-calendar:' }),
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: '📅 Calendar sync limit reached.' },
});