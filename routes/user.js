const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

const router = express.Router();

// GET /api/users
router.get("/users", isAuth, userController.getUsers);

// POST /api/user
router.post(
  "/user",
  isAuth,
  [body("name").trim().not().isEmpty()],
  userController.createUser
);

router.get("/user/:userId", isAuth, userController.getUser);

router.put(
  "/user/:userId",
  isAuth,
  [body("name").trim().not().isEmpty()],
  userController.updateUser
);

router.delete("/user/:userId", userController.deleteUser);

module.exports = router;
