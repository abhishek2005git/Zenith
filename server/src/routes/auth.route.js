import express from 'express';
import passport from 'passport';
import { googleCallback, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * PATH: server/src/routes/auth.route.js
 * Optimized for Production: Uses FRONTEND_URL for dynamic redirects
 * and includes required scopes for Google Calendar synchronization.
 */

// Get the frontend URL from environment variables, fallback to localhost for safety
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * @desc    Start Google OAuth Flow
 * @route   GET /auth/google
 * we include the 'offline' access and 'calendar' scope here in the middleware config
 */
router.get('/google', passport.authenticate('google', { 
    scope: [
        'profile', 
        'email', 
        'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent' 
}));

/**
 * @desc    Google auth callback
 * @route   GET /auth/google/callback
 */
router.get(
    '/google/callback', 
    passport.authenticate('google', { 
        // Dynamic failure redirect for production
        failureRedirect: `${FRONTEND_URL}/login` 
    }),
    googleCallback
);

/**
 * @desc    User Management
 */
router.get('/logout', logoutUser);
router.get('/current_user', getCurrentUser);

export default router;