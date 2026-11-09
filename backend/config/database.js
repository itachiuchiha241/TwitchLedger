
const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/twitchledger"
    );

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
};
