
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    twitchId: {
      type: String,
      required: true,
      unique: true,
    },

    twitchUsername: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    tokenExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
