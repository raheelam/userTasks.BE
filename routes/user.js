const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");

const router = express.Router();

// GET /api/users
router.get("/users", userController.getUsers);

// POST /api/user
router.post(
  "/user",
  [body("name").trim().not().isEmpty()],
  userController.createUser
);

router.get("/user/:userId", userController.getUser);

router.put(
  "/user/:userId",
  [body("name").trim().not().isEmpty()],
  userController.updateUser
);

router.delete("/user/:userId", userController.deleteUser);

module.exports = router;
