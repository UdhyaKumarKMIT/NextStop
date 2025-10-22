const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ✅ Configure nodemailer (use env variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ----------------- REGISTER -----------------
const register = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    mobileNo,
    altMobileNo,
    dob,
    address
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // ✅ Check existing username or email
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser)
      return res.status(400).json({ message: "Username or email already exists" });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      mobileNo,
      altMobileNo,
      dob,
      address
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- LOGIN -----------------
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Allow login with either username or email
    const user = await User.findOne({ 
      $or: [{ username:username }, { email: username }] 
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // ✅ Generate JWT
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token ,role : user.role});
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- FORGOT PASSWORD -----------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    // ✅ Send email
    await transporter.sendMail({
      from: '"NextStop Support" <studycegmit@gmail.com>',
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is ${code}. It will expire in 10 minutes.`
    });

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- RESET PASSWORD -----------------
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found Register First" });

    // ✅ Validate code and expiry
    if (user.resetCode !== code || user.resetCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // ✅ Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };