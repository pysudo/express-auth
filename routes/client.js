const express = require('express');

const Client = require('../models/clientDetails');
const User = require('../models/user');
const Billing = require('../models/billing');


router = express.Router();


// Renders a lists all the client details
router.get('/', async (request, response) => {

    clients = await Client.find({ delRec: { $ne: true } });
    response.render('client/clientDetails', { title: "Client Details", clients })
})


// Renders a form to append a client to the database
router.get('/add', (request, response) => {

    response.render('client/addClientDetails', { title: "Client Details" })
})


// Appends a client to the database
router.post('/', async (request, response) => {

    const user = await User.findOne({ _id: request.session.userID });
    const client = new Client(request.body.client);
    client.modified.by = `${user.firstname} ${user.lastname}`;
    await client.save();

    response.redirect('/client');
})


// Renders list of all the billings of a specific client
router.get('/billing/:id', async (request, response) => {

    const { id } = request.params;
    const clientDetail = await Client.findById(id).populate('billings');

    response.render('client/billing', { title: "Billing", clientDetail })
})


// Renders a billing form for a specific client
router.get('/billing/add/:id', async (request, response) => {

    const { id } = request.params;
    const clientDetail = await Client.findById(id);

    response.render('client/addBilling', { title: "Billing", clientDetail })
})


// Stores a billing data for a specific client
router.post('/billing/:id', async (request, response) => {

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

    response.redirect('/client')
})


// Renders a form to edit an exisiting client
router.get('/edit/:id', async (request, response) => {

    const { id } = request.params;
    const clientDetail = await Client.findById(id);

    response.render('client/editClientDetail', { title: "Edit Client Details", clientDetail })
});


// Renders a form to edit an exisiting client
router.post('/edit/:id', async (request, response) => {

    const { id } = request.params;
    const user = await User.findById(request.session.userID);
    request.body.client.modified = {
        by: `${user.firstname} ${user.lastname}`,
        at: Date.now()
    };
    await Client.findByIdAndUpdate(id, request.body.client);

    response.redirect('/client')
});

module.exports = router;