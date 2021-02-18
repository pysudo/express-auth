const express = require('express');

const User = require('../models/user');
const Billing = require('../models/billing');
const { checkAuthentication, accessGrant } = require('../utils/middlewares');


router = express.Router();


// Lists all the payments to be made
router.get('/:viewBy', async (request, response) => {

    const { viewBy } = request.query;

    let billings;
    if (viewBy === 'invoice') {
        billings = await Billing.find({ delRec: { $ne: true }, paymentStatus: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        }).sort({ invoice: 1 });
    }
    else if (viewBy === 'client') {
        billings = await Billing.find({ delRec: { $ne: true }, paymentStatus: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        }).sort({ client: 1 });
    }
    else {
        billings = await Billing.find({ delRec: { $ne: true }, paymentStatus: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        })
    }

    response.render('payment/paymentDetails', { title: 'Payment Details', billings, viewBy })
})


// Sort billings by either invoice wise or client wise 
router.get('/sort', async (request, response) => {

    response.redirect(`/payment/${request.query.viewBy}`)
})


// Render form to make payment for a particular invoice
router.get('/pay/:id', async (request, response) => {

    const { id } = request.params;
    const billing = await Billing.findById({ _id: id }).populate('client');

    response.render(`payment/makePayment`, { title: 'Make Payment', billing });
})


// Make payment for a particular invoice
router.post('/pay/:id', async (request, response) => {

    const { id } = request.params;
    const payment = request.body.payment;
    const billing = await Billing.findById(id);
    const updatedBilling = await Billing.findByIdAndUpdate(id, { amountPayed: (billing.amountPayed + parseFloat(payment.amount))}, {new: true});
    await updatedBilling.save();
    
    if (updatedBilling.grandTotal - updatedBilling.amountPayed === 0) {
        await Billing.findByIdAndUpdate(id, { paymentStatus: true});
    }

    response.redirect(`/payment/default`);
})

module.exports = router;