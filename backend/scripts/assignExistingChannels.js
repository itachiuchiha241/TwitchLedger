
require("dotenv").config();

const mongoose = require("mongoose");
const Channel = require("../models/Channel");
const User = require("../models/User");

async function migrateChannels() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/twitchledger"
    );

    // Find Prem's Twitch account.
    const user = await User.findOne({
      twitchId: "1016384681",
    });

    if (!user) {
      throw new Error("Prem's Twitch account was not found");
    }

    // Assign only channels that currently have no owner.
    const result = await Channel.updateMany(
      {
        owner: { $exists: false },
      },
      {
        $set: { owner: user._id },
      }
    );

    console.log("Migration completed!");
    console.log("Assigned channels:", result.modifiedCount);
    console.log("Owner:", user.twitchUsername);
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

migrateChannels();
