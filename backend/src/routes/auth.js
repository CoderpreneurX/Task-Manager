const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../models");
const settings = require("../utils/settings");
const crypto = require("crypto")
const nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
// router.use(authMiddleware)
const JWT_SECRET = settings.JWT_SECRET;

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "Full name is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
    });

    // Generate a unique verification code
    const verificationCode = crypto.randomBytes(3).toString("hex"); // 6 character code

    // Store the verification code in the Token model
    const token = await Token.create({
      userId: user.id,
      code: verificationCode,
      purpose: "email_verification",
      createdAt: new Date(),
    });

    // Send email with the verification code
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any other service
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    const domain = process.env.FRONTEND_DOMAIN

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Please click this link to verify your email: ${domain}/verify-email?email=${email}&code=${verificationCode}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Error sending verification email" });
      }
      console.log("Email sent: " + info.response);
    });

    // Return success response
    return res.status(201).json({
      message:
        "User registered successfully. A verification code has been sent to your email.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  }

  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: settings.TOKEN_EXPIRY,
    });

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    // Validate input
    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if there is a token associated with the email and code
    const token = await Token.findOne({ where: { userId: user.id, code, purpose: 'email_verification' } });
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Check if the token has expired
    if (Token.isExpired(token)) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark the token as used by deleting it
    await token.destroy(); // Delete the token after successful verification

    // Update the user's email verification status
    user.isEmailVerified = true;
    await user.save();

    return res.json({
      message: "Email successfully verified",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/validate-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // If the token is valid, return a success message
    return res.status(200).json({ message: "Token is valid", user: decoded });
  } catch (err) {
    // If the token is invalid or expired, send an error response
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
