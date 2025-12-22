import express from "express";
import getCosmicWeather from "../controllers/weather.controller.js"

const router = express.Router();

router.get("/", getCosmicWeather);

export default router;