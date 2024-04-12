const express = require("express");
const router = express.Router();

const UserController = require("../controller/user");

router.post("/register-user", UserController.register_user);

router.post("/login-user", UserController.login_user);

router.post("/refresh-token", UserController.refresh_token)

module.exports = router;