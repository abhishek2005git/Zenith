import express from 'express';
import { syncLaunchEvent } from '../controllers/calendar.controller.js';

const router = express.Router();

// Protected route: Only logged in users can sync to calendar
router.post('/add-launch', syncLaunchEvent);

export default router;