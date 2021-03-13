const mongoose = require('mongoose');


const clientSchema = mongoose.Schema({
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
        type: Number,
        required: true
    },
    delRec: {
        type: Boolean,
        default: false,
    },
    gst: {
        type: String,
    },
    pan: {
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
    billings: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Billing'
        }
    ]
});

clientSchema.virtual('paidDues').get(function () {

    for (let billing of this.billings) {
        if (billing.paymentStatus === false) {
            return false;
        }
    }
    
    return true;
});


module.exports = mongoose.model('Client', clientSchema);