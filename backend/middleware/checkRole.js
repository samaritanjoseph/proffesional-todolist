module.exports = (role) => {
  return (req, res, next) => {
    // This depends on verifyToken running first so req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found." });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: `Forbidden: This action requires the ${role} role.` 
      });
    }

    next(); // Role matches, proceed to the route
  };
};