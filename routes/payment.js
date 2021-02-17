const express = require('express');

const User = require('../models/user');
const Billing = require('../models/billing');
const { validateProfile, checkAuthentication, accessGrant } = require('../utils/middlewares');


router = express.Router();


// Lists all the payments to be made
router.get('/:viewBy', async (request, response) => {

    const { viewBy } = request.query;

    let billings;
    if (viewBy === 'invoice') {
        billings = await Billing.find({ delRec: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        }).sort({ invoice: 1 });
    }
    else if (viewBy === 'client') {
        billings = await Billing.find({ delRec: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        }).sort({ client: 1 });
    }
    else {
        billings = await Billing.find({ delRec: { $ne: true } }).populate({
            path: 'client',
            select: 'name',
        })
    }

    response.render('payment/paymentDetails', { title: 'Payment Details', billings, viewBy })
})


// 
router.get('/sort', async (request, response) => {

    response.redirect(`/payment/${request.query.viewBy}`)
})


module.exports = router;