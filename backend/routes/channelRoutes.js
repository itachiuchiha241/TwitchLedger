const express = require("express");

const {
  getChannels,
} = require("../controllers/channelController");

const router = express.Router();

router.get("/channels", getChannels);

module.exports = router;