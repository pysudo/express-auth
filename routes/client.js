const express = require('express');
const mongoose = require('mongoose');

const Profile = require('../models/companyProfile');
const Client = require('../models/clientDetails');
const User = require('../models/user');
const Billing = require('../models/billing');
const { validateClient, checkAuthentication, accessGrant } = require('../utils/middlewares');


router = express.Router();


// Renders a lists all the client details
router.get('/', checkAuthentication, async (request, response) => {

    clients = await Client.find({ delRec: { $ne: true } });
    response.render('client/clientDetails', { title: "Client Details", clients })
})


// Renders a form to append a client to the database
router.get('/add', checkAuthentication, (request, response) => {

    response.render('client/addClientDetails', { title: "Client Details" })
})


// Appends a client to the database
router.post('/', checkAuthentication, accessGrant, validateClient, async (request, response) => {

    const user = await User.findOne({ _id: request.session.userID });
    const client = new Client(request.body.client);
    client.modified.by = `${user.firstname} ${user.lastname}`;
    await client.save();

    response.redirect('/client');
})


// Renders a billing form for a specific client
router.get('/billing/:clientID/send/:billingID', async (request, response) => {

    const { billingID } = request.params;
    const billings = await Billing.findById(billingID).populate('client').populate('companyProfile');

    response.render('client/invoice', { title: "Invoice", billings })
})

// Renders prefilled exisiting billing form for edit
router.get('/billing/:clientID/edit/:billingID', async (request, response) => {

    const { clientID, billingID } = request.params;

    const billings = await Billing.findById(billingID).populate('client').populate('companyProfile');
    const companyProfiles = await Profile.find({});

    response.render('client/editBilling', { title: "Edit Billing", billings, clientDetail: billings.client, companyProfiles})
})


// Renders list of all the billings of a specific client
router.get('/billing/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    let clientDetail = await Client.findById(id).populate(
        {
            path: 'billings',
            match: {
                delRec: false
            }
        }
    );

    let amountPayable = 0;
    let payedAmount = 0;
    for (let billing of clientDetail.billings) {
        amountPayable += billing.grandTotal;
        payedAmount += billing.amountPayed;
    };

    clientDetail = await Client.findById(id).populate('billings');

    response.render('client/billing', { title: "Billing", clientDetail, amountPayable, payedAmount })
})


// Renders a billing form for a specific client
router.get('/billing/add/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const clientDetail = await Client.findById(id);
    const companyProfiles = await Profile.find({});

    response.render('client/addBilling', { title: "Billing", clientDetail, companyProfiles })
})


// Stores a billing data for a specific client
router.post('/billing/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id } = request.params;
    const client = await Client.findById(id);

    const billing = new Billing(request.body.billing);
    billing.invoice = Math.floor(Math.random() * 1000000000000000);

    const user = await User.findOne({ _id: request.session.userID });
    billing.modified.by = `${user.firstname} ${user.lastname}`;

    client.billings.push(billing);
    billing.client = client;
    await client.save();
    await billing.save()

    response.redirect(`/client/billing/${id}`)
}
)
// Edits and stoes the edited billing data for a specific client
router.patch('/billing/:clientID/edit/:billingID', checkAuthentication, accessGrant, async (request, response) => {

    const { clientID, billingID } = request.params;

    const billing = await Billing.findByIdAndUpdate(billingID, request.body.billing);
    const user = await User.findOne({ _id: request.session.userID });
    billing.modified.by = `${user.firstname} ${user.lastname}`;
    await billing.save()

    response.redirect(`/client/billing/${clientID}`)
})


// Renders a form to edit an exisiting client
router.get('/edit/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const clientDetail = await Client.findById(id);

    response.render('client/editClientDetail', { title: "Edit Client Details", clientDetail })
});


// Renders a form to edit an exisiting client
router.post('/edit/:id', checkAuthentication, accessGrant, validateClient, async (request, response) => {

    const { id } = request.params;
    const user = await User.findById(request.session.userID);
    request.body.client.modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    };
    await Client.findByIdAndUpdate(id, request.body.client);

    response.redirect('/client')
});


// Renders a form to state reason for billing deletion
router.get('/billing/confirm-deletion/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const client = await Client.findOne({ billings: mongoose.Types.ObjectId(id) });
    const clientID = client._id;

    response.render('confirmDeletion', { title: "Confirm Deletion", purchaseID: false, profileID: false, transactionID: false, clientID: false, billingClientID: clientID, billingID: id });
})


// If confirmed, deletes an exisiting billing entry
router.delete('/billing/confirm-deletion/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id } = request.params;
    const { reason, choice } = request.body;
    const client = await Client.findOne({ billings: mongoose.Types.ObjectId(id) });
    if (choice == "confirm") {

        await Billing.findByIdAndUpdate(id, { deleteReason: reason, delRec: true });
        request.flash('success', "Billing successfully deleted.")
    }

    response.redirect(`/client/billing/${client._id}`);
})


// Renders a form to state reason for client detail deletion
router.get('/confirm-deletion/:id', checkAuthentication, (request, response) => {

    const { id } = request.params;

    response.render('confirmDeletion', { title: "Confirm Deletion", purchaseID: false, profileID: false, transactionID: false, clientID: id });
})


// If confirmed, deletes an exisiting client detail entry
router.delete('/confirm-deletion/:id', checkAuthentication, accessGrant, async (request, response) => {

    const { id } = request.params;
    const { reason, choice } = request.body;
    if (choice == "confirm") {

        await Client.findByIdAndUpdate(id, { deleteReason: reason, delRec: true });
        request.flash('success', "Client successfully deleted.")
    }

    response.redirect('/client');
})


module.exports = router;