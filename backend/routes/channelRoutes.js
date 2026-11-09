
const express = require("express");

const {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
} = require("../controllers/channelController");

const router = express.Router();

// Require Twitch login for every channel operation.
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Please login with Twitch first",
    });
  }

  next();
}

router.use(requireAuth);

router.get("/channels", getChannels);
router.post("/channels", createChannel);
router.put("/channels/:id", updateChannel);
router.delete("/channels/:id", deleteChannel);

module.exports = router;
