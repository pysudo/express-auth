const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        min: 6,
        max: 30
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 128
    },
    firstname: {
        type: String,
        required: true,
        max: 100
    },
    lastname: {
        type: String,
        required: true,
        max: 100
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    grantLevel: {
        type: Number,
        default: 3,
        enum: [1, 2, 3]
    },
});


module.exports = mongoose.model('User', userSchema);