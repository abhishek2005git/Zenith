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
import calendarRoutes from './routes/calender.route.js';

import { connectRedis } from './config/redis.js'; 
import configurePassport from './config/passport.js';
import { initCalendarWorker } from './workers/calendar.worker.js';
import { apiLimiter, authLimiter, calendarLimiter } from './middleware/rateLimiter.js';


import authRoutes from "./routes/auth.route.js"
import userRoutes from './routes/user.route.js';

dotenv.config();

configurePassport(passport);


const app = express();
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: [
        'http://localhost:5173', 
        '[https://your-project-name.vercel.app](https://your-project-name.vercel.app)' // Replace with your actual Vercel URL later
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
}));


app.use(express.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_KEY],
        // Apply these production settings:
        sameSite: 'none', 
        secure: true      
    })
);

app.use(function(req, res, next) {
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

initCalendarWorker();


connectDB();
connectRedis(); 
// client;

app.get("/", (req, res) => {res.send("Hi there this is the / route of Zenith")})

app.use('/auth', authLimiter, authRoutes);
app.use("/api/launches", apiLimiter, launchRoutes);
app.use("/api/weather", apiLimiter, weatherRoutes);
app.use("/api/astronomy", apiLimiter, astronomyRoutes);
app.use('/api/iss', apiLimiter, issRoutes);
app.use('/api/user', apiLimiter,userRoutes);
app.use('/api/calendar', calendarLimiter, calendarRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})