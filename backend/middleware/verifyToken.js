const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the 'Authorization' header (Format: Bearer <token>)
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    // Verify the token using your secret key from .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user data (id and role) to the request object
    req.user = verified;
    
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};