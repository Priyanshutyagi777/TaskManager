const Task = require("../models/taskModel");
const moment = require("moment");

const createTask = async (req, res) => {
  try {
    const { title, startTime, endTime, priority, status } = req.body;

    const newTask = new Task({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      priority,
      status,
      userId: req.userId,

    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    task.status = req.body.status;
    task.endTime = req.body.status === "finished" ? new Date() : task.endTime;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, updateTask, deleteTask, getTasks };
