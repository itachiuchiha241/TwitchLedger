
const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const { getAccessToken } = require("../services/tokenService");

const router = express.Router();

router.get("/history", async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({
                error: "Please login with Twitch first",
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({
                error: "Twitch user not found",
            });
        }

        // 1. Fetch followed channels
        const followResponse = await axios.get(
            "https://api.twitch.tv/helix/channels/followed",
            {
                params: {
                    user_id: user.twitchId,
                    first: 100,
                },
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${user.accessToken}`,
                },
            }
        );

        const follows = followResponse.data.data || [];

        // 2. Get Twitch App Access Token
        const appToken = await getAccessToken();

        // 3. Fetch actual Twitch profile images
        let twitchUsers = [];

        if (follows.length > 0) {
            const usersResponse = await axios.get(
                "https://api.twitch.tv/helix/users",
                {
                    params: {
                        id: follows.map((channel) => channel.broadcaster_id),
                    },
                    paramsSerializer: {
                        indexes: null,
                    },
                    headers: {
                        "Client-ID": process.env.TWITCH_CLIENT_ID,
                        Authorization: `Bearer ${appToken}`,
                    },
                }
            );

            twitchUsers = usersResponse.data.data || [];
        }

        // 4. Combine follow data + profile images
        const channels = follows.map((follow) => {
            const twitchUser = twitchUsers.find(
                (u) => u.id === follow.broadcaster_id
            );

            return {
                channelId: follow.broadcaster_id,
                creator: follow.broadcaster_name,
                login: follow.broadcaster_login,
                avatar: twitchUser?.profile_image_url || "",
                followedAt: follow.followed_at,
            };
        });

        res.json({
            success: true,
            channels,
        });
    } catch (error) {
        console.error(
            "Follow History Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json({
            error:
                error.response?.data?.message ||
                "Failed to fetch followed channels",
        });
    }
});

module.exports = router;
