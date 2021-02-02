const express = require('express');

const User = require('../models/user');
const Purchase = require('../models/purchaseDetails');
const Transaction = require('../models/transaction');
const { checkAuthentication, accessGrant, validatePurchase, validateTransaction } = require('../utils/middlewares');


router = express.Router();


// Renders page for purchase details
router.get('/', checkAuthentication, async (request, response) => {

    purchases = await Purchase.find({ delRec: { $ne: true } });

    response.render('purchaseDetails', { title: "Purchase Details", purchases });
})


// Renders a form for appending a purchase profile
router.get('/add', checkAuthentication, accessGrant, (request, response) => {

    response.render('addPurchaseDetails', { title: "Add Details" });
})


// Appends purchase detail to database
router.post('/', checkAuthentication, accessGrant, validatePurchase, async (request, response) => {

    const purchase = new Purchase(request.body.purchase);
    const user = await User.findOne({ _id: request.session.userID });
    purchase.modified.by = `${user.firstname} ${user.lastname}`;
    if (!purchase.activeStatus) {
        purchase.activeStatus = "off";
    }
    await purchase.save();

    response.redirect('/purchase');
})


// Renders a form to edit an exisiting purchase
router.get('/edit/:id', checkAuthentication, accessGrant, async (request, response) => {
    const { id } = request.params;
    const purchase = await Purchase.findById(id);

    response.render('editPurchaseDetails', { title: "Edit Purchase", purchase })

});


// Edits an exisiting purchase
router.patch('/edit/:id', checkAuthentication, accessGrant, validatePurchase, async (request, response) => {

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
router.patch('/delete/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id } = request.params;
    await Purchase.findByIdAndUpdate(id, { delRec: true });

    response.redirect('/purchase')

});


// Renders a form to state reason for purchase detail deletion
router.get('/confirm-deletion/:id', accessGrant, (request, response) => {

    const { id } = request.params;
    response.render('confirmDeletion', { title: "Confirm Deletion", purchaseID: id, profileID: false });
})


// Renders a form to state reason for purchase detail deletion
// If confirmed, deletes an exisiting purchase detail entry
router.delete('/confirm-deletion/:id', accessGrant, async (request, response) => {

    const { id } = request.params;
    const { reason, choice } = request.body;
    if (choice == "confirm") {
        await Purchase.findByIdAndUpdate(id, { deleteReason: reason, delRec: true });
        request.flash('success', "Purchase successfully deleted.")

        return response.redirect('/purchase');
    }

    response.redirect('/purchase');
})


// Dynamically updates active status after user toggle
router.patch('/statuschange/:ischecked/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id, ischecked } = request.params;
    const user = await User.findById(request.session.userID);
    const modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    }

    await Purchase.findByIdAndUpdate(id, { activeStatus: ischecked, modified });
});


// Sorts purchase details either ascending or descending
router.get('/sort/:name/:order', checkAuthentication, async (request, response) => {

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


// Renders a form to enter the transaction to a particular vendor
router.get('/purchase-transactions/add/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const purchase = await Purchase.findById(id);

    response.render('addTransaction', { title: "Add Transaction", purchase });
})


// Appends the transaction to a particular vendor to the database
router.post('/purchase-transactions/add/:id', checkAuthentication, validateTransaction, async (request, response) => {

    const { id } = request.params;
    const purchase = await Purchase.findById(id);
    const transaction = new Transaction(request.body.transaction);
    purchase.transactions.push(transaction);

    await transaction.save();
    await purchase.save();

    response.redirect(`/purchase/purchase-transactions/${id}`);
})


// Displays the list of transactions to a particular vendor
router.get('/purchase-transactions/:id', async (request, response) => {


    const { id } = request.params;

    const purchase = await Purchase.findById(id).populate('transactions');
    console.log(purchase)

    response.render('transactions', { title: "Transaction", purchase});
})

module.exports = router;

