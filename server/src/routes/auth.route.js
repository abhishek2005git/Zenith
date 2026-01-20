import express from 'express';
import passport from 'passport';
import { googleCallback, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

// 1. Start Google Login Flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback (After user clicks "Allow")
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    googleCallback
);

// 3. User Management
router.get('/logout', logoutUser);
router.get('/current_user', getCurrentUser);

export default router;