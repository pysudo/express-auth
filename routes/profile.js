const express = require('express');

const User = require('../models/user');
const Profile = require('../models/companyProfile');
const { validateProfile, checkAuthentication, accessGrant } = require('../utils/middlewares');


router = express.Router();


// Renders page for company profiles
router.get('/', checkAuthentication, accessGrant, async (request, response) => {

    profiles = await Profile.find({ delRec: { $ne: true } });
    response.render('profile/profile', { title: "Company Profile", profiles });
});


// Renders a form for appending company profile
router.get('/add', checkAuthentication, accessGrant, (request, response) => {

    response.render('profile/addProfile', { title: "Add Profile" });
});


// Appends company profile to database
router.post('/', checkAuthentication, accessGrant, validateProfile, async (request, response) => {

    const profile = new Profile(request.body.profile);
    console.log(request.body);
    const user = await User.findOne({ _id: request.session.userID });
    profile.modified.by = `${user.firstname} ${user.lastname}`;
    await profile.save();

    response.redirect('/profile');
});


// Renders a form to edit an exisiting profile entry
router.get('/edit/:id', checkAuthentication, accessGrant, async (request, response) => {
    const { id } = request.params;
    const profile = await Profile.findById(id);

    response.render('profile/editProfile', { title: "Edit Profile", profile })

});


// Edits an exisiting profile entry
router.patch('/edit/:id', checkAuthentication, accessGrant, validateProfile, async (request, response) => {

    const { id } = request.params;
    const user = await User.findById(request.session.userID);
    request.body.profile.modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    };
    await Profile.findByIdAndUpdate(id, request.body.profile);

    response.redirect('/profile')
});


// Renders a form to state reason for company profile deletion
router.get('/confirm-deletion/:id', checkAuthentication, accessGrant, (request, response) => {

    const { id } = request.params;
    response.render('confirmDeletion', { title: "Confirm Deletion", profileID: id, purchaseID: false, transactionID: false });
})


// If confirmed, deletes an exisiting profile entry
router.delete('/confirm-deletion/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id } = request.params;
    const { reason, choice } = request.body;
    if (choice == "confirm") {
        await Profile.findByIdAndUpdate(id, { deleteReason: reason, delRec: true });
        request.flash('success', "Profile successfully deleted.")

        return response.redirect('/profile');
    }

    response.redirect('/profile');
})


module.exports = router;