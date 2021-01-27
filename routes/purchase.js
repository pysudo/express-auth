const express = require('express');

const User = require('../models/user');
const Purchase = require('../models/purchaseDetails');



router = express.Router();


// Renders page for purchase details
router.get('/', async (request, response) => {

    purchases = await Purchase.find({});

    response.render('purchaseDetails', {title: "Purchase Details", purchases});
})


// Renders a form for appending a purchase profile
router.get('/add', (request, response) => {

    response.render('addPurchaseDetails', {title: "Add Details"});
})


// Appends purchase detail to database
router.post('/', async (request, response) => {

    const purchase = new Purchase(request.body);
    const user = await User.findOne({_id: request.session.userID});
    purchase.modified.by = `${user.firstname} ${user.lastname}`; 
    await purchase.save();

    response.redirect('/purchase');
})


// Renders a form to edit an exisiting purchase
router.get('/edit/:id', async (request, response) => {
    const { id } = request.params;
    const purchase = await Purchase.findById(id);

    response.render('editPurchaseDetails', { title: "Edit Profile", purchase })

});


// Edits an exisiting purchase
router.patch('/edit/:id', async (request, response) => {

    const { id } = request.params;
    const user = await User.findById(request.session.userID);
    request.body.modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    };
    await Purchase.findByIdAndUpdate(id, request.body);

    response.redirect('/purchase')
});


// Deletes an exisiting purchase entry
router.delete('/delete/:id', async (request, response) => {
    const { id } = request.params;
    await Purchase.findByIdAndRemove(id);

    response.redirect('/purchase')

});


module.exports = router;