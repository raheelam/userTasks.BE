const { validationResult } = require("express-validator");

const Task = require("../models/task");
const User = require("../models/user");

exports.getTasks = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Task.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Task.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((tasks) => {
      res.status(200).json({
        message: "Fetched tasks successfully.",
        tasks: tasks,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const description = req.body.description;
  let creator;
  const task = new Task({
    description,
    creator: req.body.userId,
  });
  task
    .save()
    .then((result) => {
      return User.findById(req.body.userId);
    })
    .then((user) => {
      creator = user;
      user.tasks.push(task);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Task created successfully!",
        task: task,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Task fetched.", task: task });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTask = (req, res, next) => {
  const taskId = req.params.taskId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const description = req.body.description;
  const state = req.body.state;
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.statusCode = 404;
        throw error;
      }

      task.description = description;
      task.state = state;
      return task.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Task updated!", task: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.statusCode = 404;
        throw error;
      }
      return Task.findByIdAndRemove(taskId);
    })
    .then((result) => {
      return User.findById(req.params.userId);
    })
    .then((user) => {
      user.tasks.pull(taskId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted task." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
