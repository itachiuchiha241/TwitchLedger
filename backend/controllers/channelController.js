
const Channel = require("../models/Channel");

// GET: Fetch only the logged-in user's channels
async function getChannels(req, res) {
  try {
    const channels = await Channel.find({
      owner: req.session.userId,
    }).sort({ createdAt: 1 });

    return res.json(channels);
  } catch (error) {
    console.error("GET CHANNELS ERROR:", error);

    return res.status(500).json({
      error: "Failed to fetch channels",
    });
  }
}

// POST: Create a channel for the logged-in user
async function createChannel(req, res) {
  try {
    const {
      name,
      twitchUrl,
      avatar,
      subs,
      bits,
      verified,
      role,
      description,
    } = req.body;

    if (!name?.trim() || !twitchUrl?.trim() || !avatar?.trim()) {
      return res.status(400).json({
        error: "Channel name, Twitch URL, and avatar are required",
      });
    }

    const channel = await Channel.create({
      owner: req.session.userId,
      name: name.trim(),
      twitchUrl: twitchUrl.trim(),
      avatar: avatar.trim(),
      subs: Number(subs) || 0,
      bits: Number(bits) || 0,
      verified: Boolean(verified),
      role: role || "VTuber",
      description: description || "",
    });

    console.log("CHANNEL CREATED:", channel.name);

    return res.status(201).json(channel);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "You have already added this channel",
      });
    }

    console.error("CREATE CHANNEL ERROR:", error);

    return res.status(500).json({
      error: "Failed to create channel",
    });
  }
}

// PUT: Update only the logged-in user's channel
async function updateChannel(req, res) {
  try {
    const { id } = req.params;

    // Only allow these fields to be updated.
    const allowedFields = [
      "name",
      "twitchUrl",
      "avatar",
      "subs",
      "bits",
      "verified",
      "role",
      "description",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (typeof updateData.name === "string") {
      updateData.name = updateData.name.trim();
    }

    const updatedChannel = await Channel.findOneAndUpdate(
      {
        _id: id,
        owner: req.session.userId,
      },
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedChannel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }

    return res.json(updatedChannel);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "You already have a channel with this name",
      });
    }

    console.error("UPDATE CHANNEL ERROR:", error);

    return res.status(400).json({
      error: "Failed to update channel",
    });
  }
}

// DELETE: Delete only the logged-in user's channel
async function deleteChannel(req, res) {
  try {
    const { id } = req.params;

    const deletedChannel = await Channel.findOneAndDelete({
      _id: id,
      owner: req.session.userId,
    });

    if (!deletedChannel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }

    return res.json({
      message: "Channel deleted successfully",
      channel: deletedChannel,
    });
  } catch (error) {
    console.error("DELETE CHANNEL ERROR:", error);

    return res.status(400).json({
      error: "Failed to delete channel",
    });
  }
}

module.exports = {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
};
