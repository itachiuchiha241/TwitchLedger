const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("TwitchLedger API Running");
});

app.get("/api/user/:username", async (req, res) => {
  try {
    // Get App Access Token
    const tokenResponse = await axios.post(
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

    const accessToken =
      tokenResponse.data.access_token;

    // Get Twitch User
    const userResponse = await axios.get(
      "https://api.twitch.tv/helix/users",
      {
        params: {
          login: req.params.username,
        },
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(userResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch Twitch user",
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});