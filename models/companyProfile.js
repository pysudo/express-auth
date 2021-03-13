const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    contacts: {
        email: {
            type: String,
            required: true,
        },
        landline: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        }
    },
    pan: {
        type: String
    },
    gst: {
        type: String
    },
    delRec: {
        type: Boolean,
        default: false,
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
    deleteReason: {
        type: String,
    }
});


module.exports = mongoose.model('Profile', profileSchema);