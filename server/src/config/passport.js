import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export default function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true // Important for cloud deployments (like Vercel/Render)
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if user already exists
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          }

          // 2. If not, create new user
          const newUser = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
          });

          done(null, newUser);
        } catch (err) {
          console.error('Passport Error:', err);
          done(err, null);
        }
      }
    )
  );

  // Serialize: Save user.id to the cookie session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize: Read cookie -> find User in DB
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}