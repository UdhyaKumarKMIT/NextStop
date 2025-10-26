// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token, access denied' 
      });
    }

    // Remove "Bearer " from token if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'your-fallback-secret-key');
    
    // Verify user still exists
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid - user not found' 
      });
    }
    
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;