const express = require("express");
const cors = require("cors");
require("dotenv").config();

const twitchRoutes = require("./routes/twitchRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TwitchLedger API Running");
});

app.use("/api", twitchRoutes);

app.listen(
  process.env.PORT || 5000,
  () => {
    console.log(
      "Server running on port 5000"
    );
  }
);