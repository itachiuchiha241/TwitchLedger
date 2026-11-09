
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const { connectDatabase } = require("./config/database");
const channelRoutes = require("./routes/channelRoutes");
const twitchRoutes = require("./routes/twitchRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// JSON middleware
app.use(express.json());

// Express session configuration
app.use(
  session({
    name: "twitchledger.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/twitchledger",
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

// Home route
app.get("/", (req, res) => {
  res.send("TwitchLedger API Running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", twitchRoutes);
app.use("/api", channelRoutes);

// Start server
async function startServer() {
  try {
    await connectDatabase();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
