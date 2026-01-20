import express from 'express';
import { toggleFavorite, getFavorites } from '../controllers/user.controller.js';

const router = express.Router();

// Middleware to check if user is logged in
const protect = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;