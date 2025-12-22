import express from "express"
import { getAPOD } from "../controllers/astronomy.controller.js";

const router = express.Router();

router.get("/apod", getAPOD);

export default router;