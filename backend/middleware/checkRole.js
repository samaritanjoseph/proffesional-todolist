module.exports = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    // This depends on verifyToken running first so req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(', ')}.` 
      });
    }

    next(); // Role matches, proceed to the route
  };
};
