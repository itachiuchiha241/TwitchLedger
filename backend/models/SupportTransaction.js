
const mongoose = require("mongoose");

const supportTransactionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true,
            index: true,
        },

        // Transaction information
        type: {
            type: String,
            enum: ["gifted_subs", "bits", "subscription"],
            required: true,
        },

        amount: {
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Amount must be a whole number",
            },
            required: function () {
                return this.type !== "subscription";
            },
        },

        date: {
            type: Date,
            default: Date.now,
            required: true,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        // Subscription information
        subscribed: {
            type: Boolean,
            default: false,
        },

        months: {
            type: Number,
            min: 0,
            default: 0,
        },

        subscriptionUpdatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
supportTransactionSchema.index({
    owner: 1,
    date: -1,
});

supportTransactionSchema.index({
    owner: 1,
    channel: 1,
    type: 1,
});

module.exports = mongoose.model(
    "SupportTransaction",
    supportTransactionSchema
);
