
const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Twitch broadcaster ID
    twitchId: {
      type: String,
      default: null,
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    subs: {
      type: Number,
      default: 0,
      min: 0,
    },

    bits: {
      type: Number,
      default: 0,
      min: 0,
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

// Same creator can exist for different users,
// but each user can only add that creator once.
channelSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Channel", channelSchema);
