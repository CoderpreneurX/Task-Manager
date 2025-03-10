const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, updateTaskStatus, retrieveTask } = require("../controllers/tasksController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to protect routes
router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", retrieveTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
