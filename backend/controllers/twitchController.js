
const User = require("../models/User");

const {
  getTwitchUser,
  refreshUserAccessToken,
  getFollowedChannels,
} = require("../services/twitchService");

// Fetch Twitch user profile
async function fetchUser(req, res) {
  try {
    const data = await getTwitchUser(req.params.username);

    res.json(data);
  } catch (error) {
    console.error(
      "Twitch lookup error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to fetch Twitch user",
      details: error.response?.data || error.message,
    });
  }
}

// Fetch authenticated user's followed channels
async function fetchFollowedChannels(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    let accessToken = user.accessToken;

    // Refresh token before expiration
    if (
      !user.tokenExpiresAt ||
      user.tokenExpiresAt.getTime() <= Date.now() + 60000
    ) {
      const refreshed = await refreshUserAccessToken(
        user.refreshToken
      );

      user.accessToken = refreshed.access_token;

      if (refreshed.refresh_token) {
        user.refreshToken = refreshed.refresh_token;
      }

      user.tokenExpiresAt = new Date(
        Date.now() + refreshed.expires_in * 1000
      );

      await user.save();

      accessToken = user.accessToken;
    }

    const channels = await getFollowedChannels(
      accessToken,
      user.twitchId
    );

    res.json({
      success: true,
      total: channels.length,
      data: channels,
    });
  } catch (error) {
    console.error(
      "Fetch followed channels:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to fetch followed channels",
      details: error.response?.data || error.message,
    });
  }
}

module.exports = {
  fetchUser,
  fetchFollowedChannels,
};
