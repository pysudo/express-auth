const express = require('express');

const User = require('../models/user');
const Profile = require('../models/companyProfile');


router = express.Router();


// Renders page for company profiles
router.get('/', async (request, response) => {

    profiles = await Profile.find({});
    response.render('profile', { title: "Company Profile", profiles });
});


// Renders a form for appending company profile
router.get('/add', (request, response) => {

    response.render('addProfile', { title: "Add Profile" });
});


// Appends company profile to database
router.post('/', async (request, response) => {

    const profile = new Profile(request.body);
    const user = await User.findOne({ _id: request.session.userID });
    profile.modified.by = `${user.firstname} ${user.lastname}`;
    await profile.save();

    response.redirect('/profile');
});


// Renders a form to edit an exisiting profile entry
router.get('/edit/:id', async (request, response) => {
    const { id } = request.params;
    const profile = await Profile.findById(id);

    response.render('editProfile', { title: "Edit Profile", profile })

});


// Edits an exisiting profile entry
router.patch('/edit/:id', async (request, response) => {

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
router.delete('/delete/:id', async (request, response) => {
    const { id } = request.params;
    await Profile.findByIdAndRemove(id);

    response.redirect('/profile')

});

module.exports = router;