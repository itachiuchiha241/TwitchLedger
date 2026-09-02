const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/twitchledger"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );
  }
}

module.exports = {
  connectDatabase,
};