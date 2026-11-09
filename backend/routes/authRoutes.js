
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// Twitch Login
router.get("/twitch", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    redirect_uri: process.env.TWITCH_REDIRECT_URI,
    response_type: "code",
    scope: "user:read:email bits:read channel:read:subscriptions",
    state,
  });

  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
  );
});

// Twitch OAuth Callback
router.get("/twitch/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).send("Twitch authorization was denied.");
    }

    if (!code || !state || state !== req.session.oauthState) {
      return res.status(400).send("Invalid OAuth state.");
    }

    delete req.session.oauthState;

    const tokenResponse = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.TWITCH_REDIRECT_URI,
        },
      }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
    } = tokenResponse.data;

    const userResponse = await axios.get(
      "https://api.twitch.tv/helix/users",
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const twitchUser = userResponse.data.data[0];

    if (!twitchUser) {
      return res.status(400).send("Unable to retrieve Twitch user.");
    }

    const user = await User.findOneAndUpdate(
      { twitchId: twitchUser.id },
      {
        twitchId: twitchUser.id,
        twitchUsername: twitchUser.login,
        displayName: twitchUser.display_name,
        profileImage: twitchUser.profile_image_url,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    );

    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error);
        return res.status(500).send("Session creation failed.");
      }

      req.session.userId = user._id.toString();
      req.session.twitchId = user.twitchId;

      req.session.save((error) => {
        if (error) {
          console.error("Session save error:", error);
          return res.status(500).send("Session save failed.");
        }

        res.redirect(process.env.FRONTEND_URL);
      });
    });
  } catch (error) {
    console.error(
      "Twitch OAuth error:",
      error.response?.data || error.message
    );

    res.status(500).send("Twitch login failed.");
  }
});

// Current User
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        authenticated: false,
        message: "Not logged in",
      });
    }

    const user = await User.findById(req.session.userId).select(
      "twitchId twitchUsername displayName profileImage"
    );

    if (!user) {
      return res.status(404).json({
        authenticated: false,
        message: "User not found",
      });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id,
        twitchId: user.twitchId,
        twitchUsername: user.twitchUsername,
        displayName: user.displayName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      authenticated: false,
      message: "Failed to get current user",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout session destroy error:", error);

      return res.status(500).json({
        success: false,
        message: "Session destruction failed",
      });
    }

    res.clearCookie("twitchledger.sid", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

module.exports = router;
