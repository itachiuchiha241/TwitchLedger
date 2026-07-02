const axios = require("axios");

let accessToken = null;
let expiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  if (accessToken && now < expiresAt) {
    return accessToken;
  }

  console.log("Fetching new Twitch Access Token...");

  const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    }
  );

  accessToken = response.data.access_token;
  expiresAt = now + (response.data.expires_in - 60) * 1000;

  console.log("Token Cached");

  return accessToken;
}

module.exports = {
  getAccessToken,
};