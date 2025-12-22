import express from "express"
import { getNextLaunch, getUpcomingLaunches } from "../controllers/launch.controller.js";
const router = express.Router();

router.get("/next", getNextLaunch);
router.get("/upcoming", getUpcomingLaunches)

export default router