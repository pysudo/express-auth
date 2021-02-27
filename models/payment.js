const mongoose = require('mongoose');


const paymentSchema = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client'
    },
    billing: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Billing'
    },
    amountPayed: {
        type: Number,
        required: true,
    },
    mode: {
        type: String,
        enum: ["neft", "rtgs", "cash", "netBanking"],
        required: true
    },
    additionalInfo: {
        type: String,
    },
    modified: {
        by: {
            type: String,
            required: true
        },
        at: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
});


module.exports = mongoose.model('Payment', paymentSchema);