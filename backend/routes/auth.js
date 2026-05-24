const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../utils/email');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── REGISTER ──────────────────────────────────────────────────────────
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (existingUser) {
      // Update pending user with new OTP
      existingUser.name = name;
      existingUser.password = password; // Middleware hashes this on save
      existingUser.otpCode = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Create new pending user
      const user = new User({ 
        name, 
        email, 
        password, 
        otpCode: otp, 
        otpExpires 
      });
      await user.save();
    }

    const message = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    // Log OTP for development/testing when email fails
    console.log(`\n========================================`);
    console.log(`[DEVELOPMENT] OTP for ${email}: ${otp}`);
    console.log(`========================================\n`);
    
    await sendEmail(email, 'Verify Your Email - OTP', message);

    res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration." });
  } catch (err) {
    next(err);
  }
});

// ─── VERIFY REGISTRATION OTP ──────────────────────────────────────────
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Email required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otpCode: otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    next(err);
  }
});

// ─── RESEND OTP ────────────────────────────────────────────────────────
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const message = `Your new verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;

    // Log OTP for development/testing when email fails
    console.log(`\n========================================`);
    console.log(`[DEVELOPMENT] Resend OTP for ${email}: ${otp}`);
    console.log(`========================================\n`);

    await sendEmail(email, 'Verify Your Email - New OTP', message);

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    next(err);
  }
});

// ─── LOGIN ─────────────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role, 
        avatar: user.avatar,
        isPremium: user.isPremium,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan
      } 
    });
  } catch (err) {
    next(err);
  }
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findOne({ email: req.body.email, isVerified: true });
    if (!user) return res.status(404).json({ message: "User not found or not verified" });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const message = `Your password reset code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    // Log OTP for development/testing when email fails
    console.log(`\n========================================`);
    console.log(`[DEVELOPMENT] Reset OTP for ${user.email}: ${otp}`);
    console.log(`========================================\n`);

    await sendEmail(user.email, 'Password Reset OTP', message);

    res.json({ message: "Reset OTP sent to your email." });
  } catch (err) {
    next(err);
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────
router.post('/reset-password', [
  body('email').isEmail().withMessage('Email required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ 
      email, 
      resetOTP: otp, 
      resetOTPExpires: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired reset OTP" });

    user.password = newPassword; // Middleware hashes this on save
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;