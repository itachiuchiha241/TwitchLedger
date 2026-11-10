
const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("../services/tokenService");

const router = express.Router();

// GET /api/badges/:broadcasterId
router.get("/:broadcasterId", async (req, res) => {
  try {
    const { broadcasterId } = req.params;

    if (!broadcasterId) {
      return res.status(400).json({
        error: "Broadcaster ID is required.",
      });
    }

    const token = await getAccessToken();

    const response = await axios.get(
      "https://api.twitch.tv/helix/chat/badges",
      {
        params: {
          broadcaster_id: broadcasterId,
        },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const badgeSets = response.data.data;

    // Only the two badge types requested
    const subGift = badgeSets.find(
      (badge) => badge.set_id === "sub-gifter"
    );

    const bits = badgeSets.find(
      (badge) => badge.set_id === "bits"
    );

    res.json({
      subGift: subGift?.versions || [],
      bits: bits?.versions || [],
    });
  } catch (error) {
    console.error(
      "Badge API error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch Twitch badges.",
    });
  }
});

module.exports = router;
