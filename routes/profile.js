const express = require('express');

const User = require('../models/user');
const Profile = require('../models/companyProfile');
const middlewares = require('../utils/middlewares');
const { request, response } = require('express');


router = express.Router();


// Renders page for company profiles
router.get('/', middlewares.checkAuthentication, async (request, response) => {

    profiles = await Profile.find({ delRec: { $ne: true } });
    response.render('profile', { title: "Company Profile", profiles });
});


// Renders a form for appending company profile
router.get('/add', middlewares.checkAuthentication, (request, response) => {

    response.render('addProfile', { title: "Add Profile" });
});


// Appends company profile to database
router.post('/', middlewares.checkAuthentication, async (request, response) => {

    const profile = new Profile(request.body);
    const user = await User.findOne({ _id: request.session.userID });
    profile.modified.by = `${user.firstname} ${user.lastname}`;
    await profile.save();

    response.redirect('/profile');
});


// Renders a form to edit an exisiting profile entry
router.get('/edit/:id', middlewares.checkAuthentication, async (request, response) => {
    const { id } = request.params;
    const profile = await Profile.findById(id);

    response.render('editProfile', { title: "Edit Profile", profile })

});


// Edits an exisiting profile entry
router.patch('/edit/:id', middlewares.checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const user = await User.findById(request.session.userID);
    request.body.modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    };
    await Profile.findByIdAndUpdate(id, request.body);

    response.redirect('/profile')
});


// Deletes an exisiting profile entry
router.patch('/delete/:id', middlewares.checkAuthentication, async (request, response) => {

    const { id } = request.params;
    await Profile.findByIdAndUpdate(id, { delRec: true });

    response.redirect('/profile');
});


module.exports = router;