
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const { connectDatabase } = require("./config/database");

const channelRoutes = require("./routes/channelRoutes");
const twitchRoutes = require("./routes/twitchRoutes");
const authRoutes = require("./routes/authRoutes");
const supportRoutes = require("./routes/supportRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const eventSubRoutes = require("./routes/eventSubRoutes");
const followRoutes = require("./routes/followRoutes");
const badgeRoutes = require("./routes/badgeRoutes");

const app = express();

// ========================================
// CORS CONFIGURATION
// ========================================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ========================================
// EXPRESS JSON + RAW BODY
// ========================================
app.use(
  express.json({
    verify: (req, res, buffer) => {
      req.rawBody = buffer;
    },
  })
);

// ========================================
// TWITCH EVENTSUB WEBHOOK
// ========================================
app.use("/api/eventsub", eventSubRoutes);

// ========================================
// EXPRESS SESSION CONFIGURATION
// ========================================
app.use(
  session({
    name: "twitchledger.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/twitchledger",
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),

    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// ========================================
// HOME ROUTE
// ========================================
app.get("/", (req, res) => {
  res.send("TwitchLedger API Running");
});

// ========================================
// API ROUTES
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api", twitchRoutes);
app.use("/api", channelRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Follow History
app.use("/api/follows", followRoutes);

// Twitch Channel Badges
app.use("/api/badges", badgeRoutes);

// ========================================
// START SERVER
// ========================================
async function startServer() {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
