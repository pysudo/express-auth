const mongoose = require('mongoose');


const transactionSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["cash", "online", "others"],
        required: true
    },
    referenceNumber: {
        type: String,
        required: true
    },
    delRec: {
        type: Boolean,
        default: false,
    },
    deleteReason: {
        type: String,
    }
});


module.exports = mongoose.model('Transaction', transactionSchema);