import express from 'express';
import { getISSLocation } from '../controllers/iss.controller.js';

const router = express.Router();

router.get('/location', getISSLocation);

export default router;