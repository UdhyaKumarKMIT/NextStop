const jwt = require("jsonwebtoken");
const User = require("../User"); // Correct path to User model

// Middleware to protect routes for authenticated users
const authBooking = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.header("Authorization");
    console.log("authHeader",authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied, no token" });
    }

    // 2️⃣ Extract token (Bearer <token>)
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ message: "Access denied, invalid token" });
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // 4️⃣ Find user from decoded token (_id)
    const user = await User.findOne({username:decoded.username}); // Use _id, not username
    console.log("Authenticated User:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }

    // 5️⃣ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = { authBooking };
