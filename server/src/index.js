import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import launchRoutes from "./routes/launch.route.js"
import weatherRoutes from "./routes/weather.route.js"
import astronomyRoutes from "./routes/astronomy.route.js"
import issRoutes from './routes/iss.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {res.send("Hi there this is the / route of Zenith")})


app.use("/api/launches", launchRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/astronomy", astronomyRoutes);
app.use('/api/iss', issRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})