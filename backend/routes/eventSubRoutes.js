
const express = require("express");
const crypto = require("crypto");
const SupportTransaction = require("../models/SupportTransaction");
const Channel = require("../models/Channel");

const router = express.Router();

const EVENTSUB_SECRET = process.env.TWITCH_EVENTSUB_SECRET;

// Verify Twitch webhook signature
function verifySignature(req) {
    const messageId = req.headers["twitch-eventsub-message-id"];
    const timestamp = req.headers["twitch-eventsub-message-timestamp"];
    const signature = req.headers["twitch-eventsub-message-signature"];

    if (!messageId || !timestamp || !signature || !req.rawBody) {
        return false;
    }

    const message = messageId + timestamp + req.rawBody;

    const expectedSignature =
        "sha256=" +
        crypto
            .createHmac("sha256", EVENTSUB_SECRET)
            .update(message)
            .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);

    if (expected.length !== received.length) {
        return false;
    }

    return crypto.timingSafeEqual(expected, received);
}

// Twitch EventSub webhook
router.post("/", async (req, res) => {
    try {
        if (!verifySignature(req)) {
            return res.status(403).send("Invalid signature");
        }

        const messageType =
            req.headers["twitch-eventsub-message-type"];

        const body = req.body;

        // Webhook verification
        if (messageType === "webhook_callback_verification") {
            return res.status(200).send(body.challenge);
        }

        // Notifications
        if (messageType === "notification") {
            const event = body.event;

            const broadcasterId = event.broadcaster_user_id;

            const channel = await Channel.findOne({
                twitchId: broadcasterId,
            });

            if (!channel) {
                return res.sendStatus(204);
            }

            // Subscribe or resubscribe event
            if (
                body.subscription.type === "channel.subscribe" ||
                body.subscription.type === "channel.subscription.message"
            ) {
                const cumulativeMonths =
                    event.cumulative_months || event.duration_months || 1;

                await SupportTransaction.findOneAndUpdate(
                    {
                        owner: channel.owner,
                        channel: channel._id,
                        type: "subscription",
                    },
                    {
                        $set: {
                            subscribed: true,
                            months: cumulativeMonths,
                            subscriptionUpdatedAt: new Date(),
                        },
                        $setOnInsert: {
                            owner: channel.owner,
                            channel: channel._id,
                            type: "subscription",
                        },
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                );
            }
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error("EventSub error:", error.message);
        return res.sendStatus(500);
    }
});

module.exports = router;
