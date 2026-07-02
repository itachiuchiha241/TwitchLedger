const {
  getTwitchUser,
} = require("../services/twitchService");

async function fetchUser(req, res) {
  try {
    console.log("Username from route:", req.params.username);

    const data = await getTwitchUser(req.params.username);

    res.json(data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch Twitch user",
    });
  }
}

module.exports = {
  fetchUser,
};