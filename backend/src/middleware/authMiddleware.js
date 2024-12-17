const jwt = require("jsonwebtoken");

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Use decoded.id to decode the userid
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid or expired" });
  }
};

module.exports = protect;
