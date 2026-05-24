const User = require('../models/User');

module.exports = async function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach fresh user object to request if needed, or just isPremium
    req.user.isPremium = user.isPremium;

    if (user.role === 'admin' || user.role === 'manager' || user.isPremium) {
      return next();
    }

    return res.status(403).json({ message: "Access Denied. Premium or Admin access required." });
  } catch (err) {
    return res.status(500).json({ message: "Server error checking permissions" });
  }
};
