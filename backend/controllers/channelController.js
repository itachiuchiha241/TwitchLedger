
const axios = require("axios");
const Channel = require("../models/Channel");
const { getAccessToken } = require("../services/tokenService");

// Extract Twitch username from URL
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

// Fetch Twitch profile information
async function getTwitchProfile(twitchUrl) {
  const username = getTwitchUsername(twitchUrl);

  if (!username) {
    return null;
  }

  const accessToken = await getAccessToken();

  const response = await axios.get(
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

  const profile = response.data.data[0];

  if (!profile) {
    return null;
  }

  return {
    twitchId: profile.id,
    avatar: profile.profile_image_url,
  };
}

// Resolve Twitch ID
async function resolveTwitchId(twitchUrl) {
  const profile = await getTwitchProfile(twitchUrl);
  return profile?.twitchId || null;
}

// GET: Fetch logged-in user's channels and refresh avatars
async function getChannels(req, res) {
  try {
    const channels = await Channel.find({
      owner: req.session.userId,
    }).sort({ createdAt: 1 });

    const updatedChannels = await Promise.all(
      channels.map(async (channel) => {
        try {
          const profile = await getTwitchProfile(channel.twitchUrl);

          if (profile) {
            channel.twitchId = profile.twitchId;
            channel.avatar = profile.avatar;

            await channel.save();
          }
        } catch (error) {
          console.error(
            `Avatar refresh failed for ${channel.name}:`,
            error.message
          );
        }

        return channel;
      })
    );

    return res.json(updatedChannels);
  } catch (error) {
    console.error("GET CHANNELS ERROR:", error);

    return res.status(500).json({
      error: "Failed to fetch channels",
    });
  }
}

// POST: Create channel
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

    if (!name?.trim() || !twitchUrl?.trim()) {
      return res.status(400).json({
        error: "Channel name and Twitch URL are required",
      });
    }

    let twitchId = null;
    let twitchAvatar = null;

    try {
      const profile = await getTwitchProfile(twitchUrl.trim());

      if (profile) {
        twitchId = profile.twitchId;
        twitchAvatar = profile.avatar;
      }
    } catch (error) {
      console.error("TWITCH PROFILE ERROR:", error.message);
    }

    const channel = await Channel.create({
      owner: req.session.userId,
      name: name.trim(),
      twitchUrl: twitchUrl.trim(),
      twitchId,
      avatar: twitchAvatar || avatar || "",
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

// PUT: Update channel
async function updateChannel(req, res) {
  try {
    const { id } = req.params;

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

    if (typeof updateData.twitchUrl === "string") {
      updateData.twitchUrl = updateData.twitchUrl.trim();

      try {
        const profile = await getTwitchProfile(
          updateData.twitchUrl
        );

        if (profile) {
          updateData.twitchId = profile.twitchId;
          updateData.avatar = profile.avatar;
        }
      } catch (error) {
        console.error("TWITCH PROFILE ERROR:", error.message);
      }
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

// DELETE: Delete channel
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
