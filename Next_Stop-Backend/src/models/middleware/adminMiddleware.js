// Middleware to check admin access
const adminCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized, user not attached" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

module.exports = { adminCheck };
