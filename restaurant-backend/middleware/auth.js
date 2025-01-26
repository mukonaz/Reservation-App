const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

const checkAdminAccess = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin' && user.role !== 'restaurant_admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = authMiddleware;