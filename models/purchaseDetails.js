const mongoose = require('mongoose');


const purchaseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    pan: {
        type: String,
        required: true,
    },
    gst: {
        type: String,
        required: true
    },
    bankDetails: {
        bankName: {
            type: String,
            required: true
        },
        bankAddress: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            enum: ["savings", "current", "others"],

        },
        accountNumber: {
            type: Number,
            required: true
        },
        ifsc: {
            type: String,
            required: true
        }
    },
    delRec: {
        type: Boolean,
        default: false,
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
    activeStatus: {
        type: String,
        required: true
    },
    deleteReason: {
        type: String,
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'
    }]
});


module.exports = mongoose.model('Purchase', purchaseSchema);