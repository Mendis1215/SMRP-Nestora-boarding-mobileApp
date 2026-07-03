const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ error: 'User not found, token invalid.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided.' });
  }
};

// Middleware: only allow a specific role
const requireRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ error: `Access denied. ${role} role required.` });
  }
};

module.exports = { protect, requireRole };
