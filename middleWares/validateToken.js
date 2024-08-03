const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (!authHeader) {
      console.error("No authorization header found");
      return res.status(401).json({ message: "Access Denied" });
    }
    const token = authHeader.split(' ')[1];
    console.log("Token:", token);
    if (!token) {
      console.error("No token found after splitting");
      return res.status(401).json({ message: "Access Denied" });
    }

    const decryptObj = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded Token:", decryptObj);
    req.user = decryptObj;
    req.token = token;
    next();
  } catch (error) {
    console.error("Token validation error:", error.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = validateToken;
