const express = require("express");
const router = express.Router();

const {
  fetchUser,
  fetchFollowedChannels,
} = require("../controllers/twitchController");

router.get("/user/:username", fetchUser);
router.get("/followed-channels", fetchFollowedChannels);

module.exports = router;