const express = require('express');
const router = express.Router();

const {authAdmin} = require('../models/middleware/adminMiddleware');


const {
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  adminRegister,
  adminLogin,
  adminForgotPassword,
  adminResetPassword,
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/authController');

console.log({
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  adminRegister,
  adminLogin,
  adminForgotPassword,
  adminResetPassword,
  getAdminProfile,
  updateAdminProfile
});



// User routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin routes
router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.post('/admin/forgot-password', adminForgotPassword);
router.post('/admin/reset-password', adminResetPassword);

// No auth middleware needed
router.get("/getAdminProfile", authAdmin, getAdminProfile);
router.post("/updateAdminProfile", authAdmin, updateAdminProfile);
module.exports = router;
