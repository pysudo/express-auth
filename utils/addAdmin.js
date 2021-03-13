require('dotenv').config()

const prompt = require('prompt');
const mongoose = require("mongoose");

const User = require('../models/user');



prompt.start();

DB_URL = process.env.DB_URL;
LOCAL_DB = "mongodb://localhost:27017/portfolio";
const dbInstancePath = DB_URL || LOCAL_DB;
mongoose.connect(`${dbInstancePath}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



prompt.get(['username', 'password', 'firstname', 'lastname'], async function (err, user) {
    if (err) { return onErr(err); }


    const admin = new User({
        username: user.username,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: true,
        isApproved: true,
        grantLevel: 1
    });
    await admin.save();
    console.log(`${user.username} granted admin privileges.`)
    mongoose.connection.close();
});

function onErr(err) {
    console.log(err);
    return 1;
}
