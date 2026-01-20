import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import passport from 'passport';
import cookieSession from 'cookie-session';

import connectDB from "./config/db.js";
import launchRoutes from "./routes/launch.route.js"
import weatherRoutes from "./routes/weather.route.js"
import astronomyRoutes from "./routes/astronomy.route.js"
import issRoutes from './routes/iss.routes.js';
import { connectRedis } from './config/redis.js'; 
import configurePassport from './config/passport.js';

import authRoutes from "./routes/auth.route.js"
import userRoutes from './routes/user.route.js';

dotenv.config();

configurePassport(passport);


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Crucial for passing cookies!
    methods: "GET,POST,PUT,DELETE",
}));

app.use(express.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: [process.env.COOKIE_KEY] // Create this in your .env file
    })
);

app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

connectDB();
connectRedis(); 
// client;

app.get("/", (req, res) => {res.send("Hi there this is the / route of Zenith")})


app.use("/api/launches", launchRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/astronomy", astronomyRoutes);
app.use('/api/iss', issRoutes);
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})