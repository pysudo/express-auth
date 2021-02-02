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
    contacts: {
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
        type: String,
        required: true,
    },
    gst: {
        type: String,
        required: true
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
    deleteReason: {
        type: String,
    }
});


module.exports = mongoose.model('Profile', profileSchema);