
const axios = require("axios");

let accessToken = null;
let expiresAt = 0;

// App Access Token (public Twitch data)
async function getAccessToken() {
  const now = Date.now();

  if (accessToken && now < expiresAt) {
    return accessToken;
  }

  const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    }
  );

  accessToken = response.data.access_token;

  expiresAt =
    Date.now() + (response.data.expires_in - 60) * 1000;

  return accessToken;
}

// Fetch Twitch user profile by username
async function getTwitchUser(username) {
  const token = await getAccessToken();

  const response = await axios.get(
    "https://api.twitch.tv/helix/users",
    {
      params: {
        login: username,
      },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Refresh User Access Token
async function refreshUserAccessToken(refreshToken) {
  const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    }
  );

  return response.data;
}

// Fetch all followed Twitch channels
async function getFollowedChannels(userAccessToken, twitchId) {
  const channels = [];
  let cursor = null;

  do {
    const response = await axios.get(
      "https://api.twitch.tv/helix/channels/followed",
      {
        params: {
          user_id: twitchId,
          first: 100,
          ...(cursor ? { after: cursor } : {}),
        },
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );

    channels.push(...response.data.data);

    cursor = response.data.pagination?.cursor || null;
  } while (cursor);

  return channels;
}

module.exports = {
  getAccessToken,
  getTwitchUser,
  refreshUserAccessToken,
  getFollowedChannels,
};
