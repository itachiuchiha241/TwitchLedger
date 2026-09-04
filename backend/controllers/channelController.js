const Channel = require("../models/Channel");

async function getChannels(req, res) {
  try {
    const channels = await Channel.find().sort({
      createdAt: 1,
    });

    res.json(channels);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch channels",
    });
  }
}

module.exports = {
  getChannels,
};