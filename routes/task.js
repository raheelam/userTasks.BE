const express = require("express");
require("dotenv").config();
const { body } = require("express-validator");

const taskController = require("../controllers/task");

const router = express.Router();

// GET /api/tasks
router.get("/tasks", taskController.getTasks);

// POST /api/task
router.post(
  "/task",
  [
    body("description").trim().isLength({ min: 5 }),
    body("userId").trim().isLength({ min: 1 }),
  ],
  taskController.createTask
);

router.get("/task/:taskId", taskController.getTask);

router.put(
  "/task/:taskId",
  [
    body("description").trim().isLength({ min: 5 }),
    body("state").trim().isBoolean(),
  ],
  taskController.updateTask
);

router.delete("/task/:taskId", taskController.deleteTask);

module.exports = router;
