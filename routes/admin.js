const express = require('express');

const { checkAuthentication, isAdmin } = require('../utils/middlewares');
const User = require('../models/user');


router = express.Router();


router.get('/', checkAuthentication, isAdmin, async (request, response) => {

    const users = await User.find({}, ['username', 'firstname', 'lastname', 'isApproved']);
    response.render('admin', { title: "Admin", users });
});


router.post('/approve/:id', isAdmin, async (request, response) => {

    const { id } = request.params;
    const {grantLevel, isApproved} = request.body;
    
    if (isApproved === "false") {

        await User.findByIdAndDelete(id);
        return response.redirect('/admin');
    }

    await User.findByIdAndUpdate(id, {grantLevel, isApproved});
    
    response.redirect('/admin');
});



module.exports = router;