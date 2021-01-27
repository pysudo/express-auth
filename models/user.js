const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: {
        type: String,
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
    }
});


module.exports = mongoose.model('User', userSchema);