import express from 'express';
import passport from 'passport';
import { googleCallback, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

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
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    googleCallback
);

/**
 * @desc    User Management
 */
router.get('/logout', logoutUser);
router.get('/current_user', getCurrentUser);

export default router;