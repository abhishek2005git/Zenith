/**
 * PATH: server/src/controllers/auth.controller.js
 * Optimized for Production: Redirects users based on the FRONTEND_URL environment variable.
 */

// Define the landing zone for redirects (Vercel URL in prod, Localhost in dev)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * @desc    Handle success callback from Google
 * @route   GET /auth/google/callback
 */
export const googleCallback = (req, res) => {
    // Passport has already handled the token exchange and user creation.
    // We now send the user back to the frontend dashboard.
    res.redirect(FRONTEND_URL);
};

/**
 * @desc    Logout user and clear session
 * @route   GET /auth/logout
 */
export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return next(err);
        }
        
        // Ensure the session is cleared and the user is redirected to the home/login page
        res.redirect(FRONTEND_URL);
    });
};

/**
 * @desc    Get current logged in user from session
 * @route   GET /auth/current_user
 */
export const getCurrentUser = (req, res) => {
    // Passport automatically attaches the user object to 'req.user' if authenticated
    if (!req.user) {
        return res.status(200).json(null);
    }
    res.status(200).json(req.user);
};