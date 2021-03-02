const express = require('express');

const Transaction = require('../models/transaction');
const Payment = require('../models/payment');
const { checkAuthentication, accessGrant } = require('../utils/middlewares');


router = express.Router();


router.get('/daybook', checkAuthentication, async (request, response) => {

    
    const transactions = await Transaction.find({}).sort('date');
    const payments = await Payment.find({}).sort('modified.at').populate('billing');

    console.log("TRANSACATION")
    console.log(transactions)
    console.log("PAYMENTS")
    console.log(payments)
    response.render("report/daybook", {title: 'Daybook', transactions, payments});
});


router.get('/clientDetails', (request, response) => {

    response.send("Client Details")
});


router.get('/purchaseDetails', (request, response) => {

    response.send("Purchase Details")
});


module.exports = router;