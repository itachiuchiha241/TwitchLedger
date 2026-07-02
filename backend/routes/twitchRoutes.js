const express = require("express");

const router = express.Router();

const {
  fetchUser,
} = require("../controllers/twitchController");

router.get(
  "/user/:username",
  fetchUser
);

module.exports = router;