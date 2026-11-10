
const SupportTransaction = require("../models/SupportTransaction");
const Channel = require("../models/Channel");

// GET all support transactions for logged-in user
exports.getSupportTransactions = async (req, res) => {
  try {
    const transactions = await SupportTransaction.find({
      owner: req.session.userId,
    })
      .populate("channel", "name avatar twitchUrl")
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Get support transactions error:", error);
    res.status(500).json({
      error: "Failed to fetch support transactions",
    });
  }
};

// CREATE support transaction
exports.createSupportTransaction = async (req, res) => {
  try {
    const { channelId, type, amount, date, notes } = req.body;

    if (!channelId || !type || amount === undefined) {
      return res.status(400).json({
        error: "Channel, support type, and amount are required",
      });
    }

    if (!["gifted_subs", "bits"].includes(type)) {
      return res.status(400).json({
        error: "Invalid support type",
      });
    }

    const numericAmount = Number(amount);

    if (
      !Number.isInteger(numericAmount) ||
      numericAmount < 1
    ) {
      return res.status(400).json({
        error: "Amount must be a positive whole number",
      });
    }

    const channel = await Channel.findOne({
      _id: channelId,
      owner: req.session.userId,
    });

    if (!channel) {
      return res.status(404).json({
        error: "Channel not found or not owned by you",
      });
    }

    const transaction = await SupportTransaction.create({
      owner: req.session.userId,
      channel: channel._id,
      type,
      amount: numericAmount,
      date: date || new Date(),
      notes: notes || "",
    });

    const populatedTransaction =
      await SupportTransaction.findById(transaction._id)
        .populate("channel", "name avatar twitchUrl");

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error("Create support transaction error:", error);

    res.status(500).json({
      error: "Failed to create support transaction",
    });
  }
};

// DELETE support transaction
exports.deleteSupportTransaction = async (req, res) => {
  try {
    const transaction = await SupportTransaction.findOneAndDelete({
      _id: req.params.id,
      owner: req.session.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        error: "Support transaction not found",
      });
    }

    res.json({
      message: "Support transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete support transaction error:", error);

    res.status(500).json({
      error: "Failed to delete support transaction",
    });
  }
};
