const mongoose = require('mongoose');


const billingSchema = mongoose.Schema({
    items: {
        type: [String],
        required: true,
    },
    hsn: {
        type: [Number],
        required: true,
    },
    quantity: {
        type: [Number],
        required: true,
    },
    price: {
        type: [Number],
        required: true
    },
    gst: {
        type: [Number],
        required: true
    },
    grandPrice: {
        type: [Number],
        required: true
    },
    amountPayed: {
        type: Number,
        default: 0,
        required: true
    },
    billingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    invoice: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        default: false,
        required: true
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
    delRec: {
        type: Boolean,
        default: false,
    },
    deleteReason: {
        type: String,
    },
    isAcknowledged: {
        type: String,
        default: "off",
    },
    client: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client'
    },
    companyProfile: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Profile'
    },
    purchaseDetail: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Purchase'
    },
});


billingSchema.virtual('paymentDue').get(function () {

    return `${Math.floor((Date.now() - this.billingDate) / (1000 * 60 * 60 * 24))} days`;
});

billingSchema.virtual('itemList').get(function () {
    return this.items.map((a) => (` ${a}`));
});

billingSchema.virtual('grandTotal').get(function () {
    return this.grandPrice.reduce((x, y) => x + y, 0);
});

billingSchema.virtual('total').get(function () {
    let sum = 0;
    for (let i = 0; i < this.price.length; i++) {
        sum += ((this.price[i]) * (this.quantity[i]));
      }
    return sum;
});



module.exports = mongoose.model('Billing', billingSchema);