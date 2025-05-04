const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,   
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["ignored","interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
        required: true, 
    },
},{
    timestamps: true,
});
connectionRequestSchema.index({ fromUserId: 1, toUserId:1});
connectionRequestSchema.pre('save', function(next) {
    const ConnectionRequest = this;
    if (ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)) {
        throw new Error("You cannot send a request to yourself");
    }
    next();
});
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;