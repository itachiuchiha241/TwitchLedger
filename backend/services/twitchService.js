
const axios = require("axios");
const { getAccessToken } = require("./tokenService");

async function getTwitchUser(username) {
  const accessToken = await getAccessToken();

  const userResponse = await axios.get(
    "https://api.twitch.tv/helix/users",
    {
      params: {
        login: username,
      },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return userResponse.data;
}

module.exports = {
  getTwitchUser,
};
