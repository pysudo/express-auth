const express = require('express');

const User = require('../models/user');
const Payment = require('../models/payment');
const Billing = require('../models/billing');
const { checkAuthentication, accessGrant, validatePayement } = require('../utils/middlewares');


router = express.Router();


// Lists all the payments to be made
router.get('/:viewBy', checkAuthentication, async (request, response) => {

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
router.get('/sort', checkAuthentication, async (request, response) => {

    response.redirect(`/payment/${request.query.viewBy}`)
})


// Render form to make payment for a particular invoice
router.get('/pay/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const billing = await Billing.findById({ _id: id }).populate('client');

    response.render(`payment/makePayment`, { title: 'Make Payment', billing });
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
    const updatedBilling = await Billing.findByIdAndUpdate(id, { amountPayed: (billing.amountPayed + parseFloat(request.body.paymentDetails.payment.amountPayed))}, {new: true});
    await updatedBilling.save();
    
    if (updatedBilling.grandTotal - updatedBilling.amountPayed === 0) {
        await Billing.findByIdAndUpdate(id, { paymentStatus: true});
    }

    response.redirect(`/payment/default`);

})


module.exports = router;