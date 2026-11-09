
const axios = require("axios");

let accessToken = null;
let expiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  // Reuse token if it is still valid
  if (accessToken && now < expiresAt) {
    return accessToken;
  }

  console.log("Fetching new Twitch Access Token...");

  try {
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

    // Expire token 60 seconds early for safety
    expiresAt =
      Date.now() + (response.data.expires_in - 60) * 1000;

    console.log("Twitch Access Token received successfully");

    return accessToken;
  } catch (error) {
    console.error(
      "TWITCH TOKEN ERROR:",
      error.response?.data || error.message
    );

    throw new Error("Failed to authenticate with Twitch");
  }
}

module.exports = {
  getAccessToken,
};
