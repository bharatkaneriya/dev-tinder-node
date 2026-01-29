const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: {
            values: ["Pending", "Accepted", "Rejected"],
            message: "{VALUE} is not a valid connection status"
        }
    }
},{
    timestamps: true
});

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
);

/* Index for inbox (requests received) */
connectionRequestSchema.index({ toUserId: 1, status: 1 });

/* Index for outbox (requests sent) */
connectionRequestSchema.index({ fromUserId: 1, status: 1 });

module.exports = mongoose.model('connectionRequest',connectionRequestSchema); 