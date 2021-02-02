const express = require('express');

const User = require('../models/user');
const { validateRegistration, checkAuthentication } = require('../utils/middlewares');


router = express.Router();


// Renders a form to register a user
router.get('/register', (request, response) => {

    response.render('auth/register', { title: "Register" });
});


// Registers a user
router.post('/register', validateRegistration, async (request, response) => {

    const user = new User(request.body.userDetails);
    
    // Check if the username is taken
    const isTaken = await User.find({username: user.username}); 
    if (isTaken.length) {
        console.log(isTaken)
        request.flash('error', "Username is already taken.");
        return response.redirect('/user/register');
    }

    await user.save();
    request.session.userID = user._id;
    request.session.username = user.username;
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
        return response.redirect('/user/login');
    }
    request.session.userID = user._id;
    request.session.username = username;
    request.flash('success', 'Successfully signed in');

    response.redirect('/');
})

// Signs out the user
router.post('/logout', (request, response) => {

    request.session.userID = null;
    request.session.username = null;
    request.flash('success', "Successfully logged out")

    response.redirect('/user/login');
})


// Renders a change password form
router.get('/password', checkAuthentication, (request, response) => {

    response.render('auth/changePassword', {title: "Change Password"});
})


router.post('/password', checkAuthentication, async (request, response) => {

    const { currentPassword, newPassword } = request.body;
    const user = await User.findById(request.session.userID);
    if(user.password != currentPassword) {

        request.flash('error', "The current password is incorrect.")
        return response.redirect('/user/password');    
    }
    else if(newPassword.length < 8 ) {
        
        request.flash('error', "Password must atleast 8 characters long.")
        return response.redirect('/user/password');    
    }

    await User.findByIdAndUpdate(request.session.userID, { password: newPassword })
    request.session.userID = null;
    request.session.username = null;
    request.flash('success', "Password successfully changed")
    response.redirect('/user/login');
})


module.exports = router;