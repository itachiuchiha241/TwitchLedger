
const axios = require("axios");
const User = require("../models/User");
const { getAccessToken } = require("./tokenService");

// Resolve Twitch username to Twitch ID
async function resolveTwitchId(username) {
  const appToken = await getAccessToken();

  const response = await axios.get(
    "https://api.twitch.tv/helix/users",
    {
      params: {
        login: username,
      },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${appToken}`,
      },
    }
  );

  return response.data.data[0]?.id || null;
}

// Check current subscription status
async function checkSubscription(userId, broadcasterId) {
  const user = await User.findById(userId).select(
    "accessToken twitchId"
  );

  if (!user || !user.accessToken || !user.twitchId) {
    throw new Error("Twitch user access token or ID not found");
  }

  const response = await axios.get(
    "https://api.twitch.tv/helix/subscriptions/user",
    {
      params: {
        broadcaster_id: broadcasterId,
        user_id: user.twitchId,
      },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${user.accessToken}`,
      },
    }
  );

  return response.data.data;
}

module.exports = {
  resolveTwitchId,
  checkSubscription,
};
