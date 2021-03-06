const express = require('express');

const User = require('../models/user');
const Payment = require('../models/payment');
const Billing = require('../models/billing');
const Client = require('../models/clientDetails');
const { checkAuthentication, accessGrant, validatePayement } = require('../utils/middlewares');


router = express.Router();


// List all the purchase orders to be paid depending on client acknowledgement
router.get('/purchaseOrders', checkAuthentication, async (request, response) => {


    const billings = await Billing.find({}).populate('purchaseDetail');

    response.render(`payment/purchaseOrders`, { title: "Purchase Orders Payments", billings})
})


// Sort billings by either invoice wise or client wise 
router.get('/sort', checkAuthentication, async (request, response) => {

    response.redirect(`/payment/${request.query.viewBy}`)
})


// Lists all the payments to be made
router.get('/:viewBy', checkAuthentication, async (request, response) => {

    const { viewBy } = request.params;

    let billings, clients;
    if (viewBy === 'invoice') {
        billings = await Billing.find({ delRec: { $ne: true }, paymentStatus: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        }).sort({ invoice: 1 });
    }
    else {
        clients = await Client.find({}).populate('billings');
        billings = await Billing.find({ delRec: { $ne: true }, paymentStatus: { $ne: true } }).populate('client');
    }

    response.render('payment/paymentDetails', { title: 'Payment Details', billings, clients, viewBy });
})

// Render form to make payment for a particular invoice
router.get('/pay/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const billing = await Billing.findById({ _id: id }).populate('client');
    const payments = await Payment.find({ billing: id });
    let totalAmountPayed = 0;

    for (let i = 0; i < payments.length; i++) {
        totalAmountPayed += payments[i].amountPayed;
    }

    response.render(`payment/makePayment`, { title: 'Make Payment', billing, payments, totalAmountPayed });
})


// Make payment for a particular invoice
router.post('/pay/:id', checkAuthentication, accessGrant, validatePayement, async (request, response) => {

    const { id } = request.params;
    const billing = await Billing.findById(id).populate('client');


    request.body.paymentDetails.payment.client = billing.client;
    request.body.paymentDetails.payment.billing = billing;
    request.body.paymentDetails.payment.amountPayed = parseFloat(request.body.paymentDetails.payment.amountPayed);
    const payment = new Payment(request.body.paymentDetails.payment);
    const user = await User.findOne({ _id: request.session.userID });
    payment.modified.by = `${user.firstname} ${user.lastname}`;
    await payment.save();

    // Updates client's overall balance 
    const updatedBilling = await Billing.findByIdAndUpdate(id, { amountPayed: (billing.amountPayed + parseFloat(request.body.paymentDetails.payment.amountPayed)) }, { new: true });
    await updatedBilling.save();

    if (updatedBilling.grandTotal - updatedBilling.amountPayed === 0) {
        await Billing.findByIdAndUpdate(id, { paymentStatus: true });
    }

    response.redirect(`/payment/default`);

})


module.exports = router;