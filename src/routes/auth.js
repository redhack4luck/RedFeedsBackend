const express = require('express');
const { body } = require('express-validator');
const {
  register,
  verifyEmail,
  login,
  getMe,
  logout,
  forgotPassword,
  validateResetToken,
  resetPassword
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

const registerValidation = [
  body('fullName').isString().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'monitor', 'admin'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail()
];

const resetPasswordValidation = [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
];

router.post('/register', registerValidation, register);
router.get('/verify-email', verifyEmail);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.get('/reset-password', validateResetToken);
router.post('/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;
