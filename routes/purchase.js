const express = require('express');

const User = require('../models/user');
const Purchase = require('../models/purchaseDetails');
const middlewares = require('../utils/middlewares')


router = express.Router();


// Renders page for purchase details
router.get('/', middlewares.checkAuthentication, async (request, response) => {

    purchases = await Purchase.find({ delRec: { $ne: true } });

    response.render('purchaseDetails', { title: "Purchase Details", purchases });
})


// Renders a form for appending a purchase profile
router.get('/add', middlewares.checkAuthentication, (request, response) => {

    response.render('addPurchaseDetails', { title: "Add Details" });
})


// Appends purchase detail to database
router.post('/', middlewares.checkAuthentication, async (request, response) => {

    const purchase = new Purchase(request.body);
    const user = await User.findOne({ _id: request.session.userID });
    purchase.modified.by = `${user.firstname} ${user.lastname}`;
    if (!purchase.activeStatus) {
        purchase.activeStatus = "off";
    }
    await purchase.save();

    response.redirect('/purchase');
})


// Renders a form to edit an exisiting purchase
router.get('/edit/:id', middlewares.checkAuthentication, async (request, response) => {
    const { id } = request.params;
    const purchase = await Purchase.findById(id);

    response.render('editPurchaseDetails', { title: "Edit Profile", purchase })

});


// Edits an exisiting purchase
router.patch('/edit/:id', middlewares.checkAuthentication, async (request, response) => {

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
router.patch('/delete/:id', middlewares.checkAuthentication, async (request, response) => {

    const { id } = request.params;
    await Purchase.findByIdAndUpdate(id, { delRec: true });

    response.redirect('/purchase')

});


// Dynamically updates active status after user toggle
router.patch('/statuschange/:ischecked/:id', middlewares.checkAuthentication, async (request, response) => {

    const { id, ischecked } = request.params;
    const user = await User.findById(request.session.userID);
    const modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    }

    await Purchase.findByIdAndUpdate(id, { activeStatus: ischecked, modified });
});


// Sorts purchase details either ascending or descending
router.get('/sort/:name/:order', middlewares.checkAuthentication, async (request, response) => {

    let { name, order } = request.params;

    if (order == "asc") {
        order = 1;
    }
    else {
        order = -1;
    }

    let purchase;
    let displayHeader = ['name', 'address', 'email', 'contact', 'modified', 'activeStatus', 'delRec'];
    switch (name) {
        case 'name':
            purchase = await Purchase.find({},
                displayHeader,
                { sort: { name: order } }
            );
            break;
        case 'address':
            purchase = await Purchase.find({},
                displayHeader,
                { sort: { address: order } }
            );
            break;
        case 'email':
            purchase = await Purchase.find({},
                displayHeader,
                { sort: { email: order } }
            );
            break;
        case 'contact':
            purchase = await Purchase.find({},
                displayHeader,
                { sort: { contact: order } }
            );
            break;
        case 'modified':
            purchase = await Purchase.find({},
                displayHeader,
                { sort: { modified: order } }
            );
            break;
    }
    response.send(purchase);
})


module.exports = router;