const express = require('express');

const User = require('../models/user');
const userSchema = require('../utils/userSchema');


router = express.Router();


const validateRegistration = (request, response, next) => {
    const validatedResult = userSchema.validate(request.body);
    if (validatedResult.error && validatedResult.error.details[0].context.key == 'username') {
        request.flash('error', "Username must be between 6 to 30 characters long.");
        return response.redirect('/register');
    }
    else if (validatedResult.error && validatedResult.error.details[0].context.key == 'password') {
        request.flash('error', "Password must be between 8 to 128 characters long.");
        return response.redirect('/register');
    }
    else {
        next();
    }
}

// Renders a form to register a user
router.get('/register', (request, response) => {

    response.render('auth/register', { title: "Register" });
});


// Registers a user
router.post('/register', validateRegistration, async (request, response) => {

    const user = new User(request.body.userDetails);
    await user.save();
    request.session.userID = user._id;
    request.flash('success', "Successfully registered");

    response.redirect('/');
})


// Renders a form to log-in a user
router.get('/login', (request, response) => {

    response.render('auth/login', { title: "Login" });
});


// Signs in the user in
router.post('/login', async (request, response) => {

    const { username, password } = request.body;
    const user = await User.findOne({ username: username });
    if (!user || password != user.password) {
        request.flash('error', "Invalid username or password");
        return response.redirect('/login');
    }
    request.session.userID = user._id;
    request.flash('success', 'Successfully signed in');

    response.redirect('/');
})

// Signs out the user
router.post('/logout', (request, response) => {

    request.session.userID = null;
    request.flash('success', "Successfully logged out")

    response.redirect('/login');
})


module.exports = router;