const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    subs: {
      type: Number,
      default: 0,
    },

    bits: {
      type: Number,
      default: 0,
    },

    avatar: {
      type: String,
      required: true,
    },

    twitchUrl: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "VTuber",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model(
  "Channel",
  channelSchema
);

module.exports = Channel;