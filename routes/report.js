const express = require('express');

const Transaction = require('../models/transaction');
const Payment = require('../models/payment');
const Billing = require('../models/billing');
const { checkAuthentication } = require('../utils/middlewares');


router = express.Router();


router.get('/daybook', checkAuthentication, async (request, response) => {


    const transactions = await Transaction.find({}).sort('date');
    const payments = await Payment.find({}).sort('modified.at').populate('billing');

    response.render("report/daybook", { title: 'Daybook', transactions, payments });
});


router.get('/clientDetails', checkAuthentication, async (request, response) => {

    const { fromRange, toRange } = request.query;
    const billingsIsExists = (await Billing.countDocuments({}) > 0) ? true : false;

    let billings;
    if (fromRange === "default" && toRange === "default") {
        billings = await Billing.find({}).sort({ 'billingDate': 1 }).populate('client');
    }
    else {
        billings = await Billing.find({ "billingDate": { $gte: fromRange, $lte: toRange } }).sort({ 'billingDate': 1 }).populate('client');
    }

    if (Object.keys(billings).length === 0 && billingsIsExists) {
        request.flash('error', "No records found. Enter a valid range!");
        response.status(404);
        response.redirect('/report/clientDetails/?fromRange=default&toRange=default');
    }
    else {
        response.render("report/clientDetails", { title: 'Client Details', billings, fromRange, toRange });
    }
});


router.get('/purchaseDetails', checkAuthentication, async (request, response) => {

    const { fromRange, toRange } = request.query;
    const paymentsIsExists = (await Payment.countDocuments({}) > 0) ? true : false;

    let payments;
    if (fromRange === "default" && toRange === "default") {
        payments = await Payment.find({}).sort({ 'modified.at': 1 }).populate('billing').populate('client');
    }
    else {
        payments = await Payment.find({ "modified.at": { $gte: fromRange, $lte: toRange } }).sort({ 'modified.at': 1 }).populate('billing').populate('client');
    }

    if (Object.keys(payments).length === 0 && paymentsIsExists) {
        request.flash('error', "No records found. Enter a valid range!");
        response.status(404);
        response.redirect('/report/purchaseDetails/?fromRange=default&toRange=default');
    }
    else {
        response.render("report/purchaseDetails", { title: 'Purchase Details', payments, fromRange, toRange });
    }
});


module.exports = router;