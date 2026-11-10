
const express = require("express");
const router = express.Router();

const {
  getSupportTransactions,
  createSupportTransaction,
  deleteSupportTransaction,
} = require("../controllers/supportController");

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Please login with Twitch first",
    });
  }

  next();
};

router.use(requireAuth);

router.get("/transactions", getSupportTransactions);
router.post("/transactions", createSupportTransaction);
router.delete("/transactions/:id", deleteSupportTransaction);

module.exports = router;
