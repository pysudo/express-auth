const mongoose = require('mongoose');


const billingSchema = mongoose.Schema({
    items: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    gst: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    grandPrice: {
        type: Number,
        required: true
    },
    invoice: {
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
    deleteReason: {
        type: String,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client'
    }
});


module.exports = mongoose.model('Billing', billingSchema);