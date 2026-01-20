import User from '../models/user.model.js';

// @desc    Toggle a favorite launch
// @route   POST /api/user/favorites
export const toggleFavorite = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const { launchId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    // Check if ID exists in array
    const index = user.favorites.indexOf(launchId);

    if (index === -1) {
      // Add it
      user.favorites.push(launchId);
    } else {
      // Remove it
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites); // Return updated list
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user favorites
// @route   GET /api/user/favorites
export const getFavorites = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    try {
        const user = await User.findById(req.user.id);
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}