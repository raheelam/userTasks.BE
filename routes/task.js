const express = require("express");
require("dotenv").config();
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");

const taskController = require("../controllers/task");

const router = express.Router();

// GET /api/tasks
router.get("/tasks", isAuth, taskController.getTasks);

// POST /api/task
router.post(
  "/task",
  isAuth,
  [
    body("description").trim().isLength({ min: 5 }),
    body("userId").trim().isLength({ min: 1 }),
  ],
  taskController.createTask
);

router.get("/task/:taskId", isAuth, taskController.getTask);

router.put(
  "/task/:taskId",
  isAuth,
  [
    body("description").trim().isLength({ min: 5 }),
    body("state").trim().isBoolean(),
  ],
  taskController.updateTask
);

router.delete("/task/:taskId/:userId", isAuth, taskController.deleteTask);

module.exports = router;
