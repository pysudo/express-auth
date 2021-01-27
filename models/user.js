const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/portfolio', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected");
});


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
    }
})


module.exports = mongoose.model('User', userSchema);