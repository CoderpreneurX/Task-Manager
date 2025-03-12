const { Task } = require("../models");

// ✅ Create a task
exports.createTask = async (req, res) => {
  console.log("Task created for user", req.user.userId);
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, user_id: req.user.userId });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get all tasks (with filtering & pagination)
exports.getTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (req.user.role === "user") {
      whereClause.user_id = req.user.userId; // Restrict to only the logged-in user's tasks
    }

    if (status) whereClause.status = status;

    const tasks = await Task.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User, // Include the user details
          attributes: ["id", "email"], // Specify only required user fields
        },
      ],
    });

    return res.json({ total: tasks.count, tasks: tasks.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.retrieveTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, user_id: req.user.userId } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    return res.json(task);
  }

  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ✅ Update a task (using optimistic locking)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findOne({ where: { id, user_id: req.user.userId } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.title = title || task.title;
    task.description = description || task.description;
    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Soft delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, user_id: req.user.userId } });

    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.destroy(); // Soft delete
    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const task = await Task.findOne({ where: { id, user_id: req.user.userId } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status;
    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
