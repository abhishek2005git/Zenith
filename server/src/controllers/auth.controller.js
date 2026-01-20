// @desc    Handle success callback from Google
// @route   GET /auth/google/callback
export const googleCallback = (req, res) => {
    // Successful authentication, redirect to client dashboard
    res.redirect('http://localhost:5173/');
};

// @desc    Logout user
// @route   GET /auth/logout
export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:5173/');
    });
};

// @desc    Get current logged in user
// @route   GET /auth/current_user
export const getCurrentUser = (req, res) => {
    res.status(200).json(req.user || null);
};