
const express = require("express");
const axios = require("axios");
const Channel = require("../models/Channel");
const SupportTransaction = require("../models/SupportTransaction");

const { checkSubscription } = require("../services/subscriptionService");
const { getAccessToken } = require("../services/tokenService");

const router = express.Router();

function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            error: "Please login with Twitch first",
        });
    }

    next();
}

router.use(requireAuth);

function getTwitchUsername(twitchUrl) {
    try {
        const url = new URL(twitchUrl);

        if (
            url.hostname !== "twitch.tv" &&
            url.hostname !== "www.twitch.tv"
        ) {
            return null;
        }

        return url.pathname.split("/").filter(Boolean)[0] || null;
    } catch {
        return null;
    }
}

async function getTwitchProfile(username) {
    const appToken = await getAccessToken();

    const response = await axios.get(
        "https://api.twitch.tv/helix/users",
        {
            params: { login: username },
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${appToken}`,
            },
        }
    );

    return response.data.data[0] || null;
}

// GET SUBSCRIPTION HISTORY
router.get("/history", async (req, res) => {
    try {
        const channels = await Channel.find({
            owner: req.session.userId,
        }).select("name twitchId avatar twitchUrl");

        const results = await Promise.all(
            channels.map(async (channel) => {
                try {
                    let twitchId = channel.twitchId;
                    let avatar = channel.avatar;

                    const username = getTwitchUsername(channel.twitchUrl);

                    if (username) {
                        const profile = await getTwitchProfile(username);

                        if (profile) {
                            twitchId = profile.id;
                            avatar = profile.profile_image_url;

                            await Channel.findByIdAndUpdate(channel._id, {
                                twitchId,
                                avatar,
                            });
                        }
                    }

                    const subscriptions = twitchId
                        ? await checkSubscription(
                              req.session.userId,
                              twitchId
                          )
                        : [];

                    const savedSubscription =
                        await SupportTransaction.findOne({
                            owner: req.session.userId,
                            channel: channel._id,
                            type: "subscription",
                        });

                    return {
                        channelId: channel._id,
                        creator: channel.name,
                        twitchId,
                        avatar,
                        twitchUrl: channel.twitchUrl,
                        subscribed: subscriptions.length > 0,
                        months: savedSubscription?.months ?? null,
                    };
                } catch (error) {
                    return {
                        channelId: channel._id,
                        creator: channel.name,
                        avatar: channel.avatar,
                        subscribed: null,
                        months: null,
                        error: error.message,
                    };
                }
            })
        );

        res.json({
            success: true,
            total: results.length,
            subscriptions: results,
        });
    } catch (error) {
        console.error("Subscription history error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subscriptions",
        });
    }
});

// SAVE SUBSCRIPTION MONTHS
router.put("/:channelId/months", async (req, res) => {
    try {
        const { months } = req.body;

        if (
            !Number.isInteger(months) ||
            months < 0 ||
            months > 1200
        ) {
            return res.status(400).json({
                error: "Months must be a whole number between 0 and 1200",
            });
        }

        const channel = await Channel.findOne({
            _id: req.params.channelId,
            owner: req.session.userId,
        });

        if (!channel) {
            return res.status(404).json({
                error: "Creator not found",
            });
        }

        const subscription = await SupportTransaction.findOneAndUpdate(
            {
                owner: req.session.userId,
                channel: channel._id,
                type: "subscription",
            },
            {
                $set: {
                    months,
                    subscribed: true,
                    subscriptionUpdatedAt: new Date(),
                },
                $setOnInsert: {
                    owner: req.session.userId,
                    channel: channel._id,
                    type: "subscription",
                },
        },
            {
                upsert: true,
                new: true,
            }
        );

        res.json({
            success: true,
            message: "Subscription months saved",
            months: subscription.months,
        });
    } catch (error) {
        console.error("Save subscription months error:", error.message);

        res.status(500).json({
            error: "Failed to save subscription months",
        });
    }
});

module.exports = router;
