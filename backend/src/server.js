require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parses JSON request body

// Routes
app.use("/api/auth", authRoutes);

// Start the server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
