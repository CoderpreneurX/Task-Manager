require("dotenv").config(); // Load environment variables from .env

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "your_super_secret_key",
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "1h", // Default: 1 hour
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d", // Default: 7 days
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10, // Default: 10 rounds
  EMAIL_VERIFICATION_EXPIRY: process.env.EMAIL_VERIFICATION_EXPIRY || "24h", // Default: 24 hours
};
