import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

const configurePassport = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        proxy: true // Required for deployment (Heroku/Render)
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
            // We store the tokens here
            accessToken: accessToken,
            refreshToken: refreshToken // This is the 'Master Key'
        };

        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // If user exists, update their profile and access token
                user.displayName = newUser.displayName;
                user.image = newUser.image;
                user.accessToken = accessToken;
                
                // IMPORTANT: Google only sends refreshToken on the first consent.
                // We only overwrite it if a new one is provided.
                if (refreshToken) {
                    user.refreshToken = refreshToken;
                }
                
                await user.save();
                return done(null, user);
            } else {
                // Create new user
                user = await User.create(newUser);
                return done(null, user);
            }
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

export default configurePassport;