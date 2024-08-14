const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const mongoose = require('mongoose');

const admin = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    

    
    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      return res.status(400).json({ message: 'Invalid user ID in token.' });
    }

    const user = await userModel.findById(decoded._id);
    

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    req.user = user;
    next();
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = admin;
