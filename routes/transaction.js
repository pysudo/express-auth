const express = require('express');
const mongoose = require('mongoose');

const Purchase = require('../models/purchaseDetails');
const Transaction = require('../models/transaction');
const { checkAuthentication, accessGrant, validateTransaction } = require('../utils/middlewares');


router = express.Router();



// Renders a form to enter the transaction to a particular vendor
router.get('/add/:id', checkAuthentication, async (request, response) => {

    const { id } = request.params;
    const purchase = await Purchase.findById(id);

    response.render('transaction/addTransaction', { title: "Add Transaction", purchase });
})


// Appends the transaction to a particular vendor to the database
router.post('/add/:id', checkAuthentication, accessGrant, validateTransaction, async (request, response) => {

    const { id } = request.params;
    const purchase = await Purchase.findById(id);
    const transaction = new Transaction(request.body.transaction);
    purchase.transactions.push(transaction);

    await transaction.save();
    await purchase.save();

    response.redirect(`/purchase/purchase-transactions/${id}`);
})


// Renders a form to state reason for transaction deletion
router.get('/confirm-deletion/:id', accessGrant, async (request, response) => {

    const { id } = request.params;
    const purchase = await Purchase.findOne({transactions: mongoose.Types.ObjectId(id)});
    const purchaseTransactionID = purchase._id; 

    response.render('confirmDeletion', { title: "Confirm Deletion", purchaseTransactionID, purchaseID: false, profileID: false, transactionID: id });
})


// If confirmed, deletes an exisiting transaction entry
router.delete('/confirm-deletion/:id', accessGrant, async (request, response) => {

    const { id } = request.params;
    const { reason, choice } = request.body;
    const purchase = await Purchase.findOne({transactions: mongoose.Types.ObjectId(id)});
    if (choice == "confirm") {

        await Transaction.findByIdAndUpdate(id, { deleteReason: reason, delRec: true });
        request.flash('success', "Transaction successfully deleted.")
    }

    response.redirect(`/purchase/purchase-transactions/${purchase._id}`);
})


// Displays the list of transactions to a particular vendor
router.get('/:id', checkAuthentication, async (request, response) => {


    const { id } = request.params;
    const purchase = await Purchase.findById(id).populate('transactions');

    response.render('transaction/transactions', { title: "Transaction", purchase });
})


// Renders a form to edit an existing transaction
router.get('/:purchaseId/edit/:transactionId', checkAuthentication, async (request, response) => {

    const { purchaseId, transactionId } = request.params;
    const transaction = await Transaction.findById(transactionId);
    
    let day, month;
    const date = transaction.date;
    if(date.getDate() < 10) {
        day = `0${date.getDate()}`
    }
    if(date.getMonth() < 10) {
        month = `0${date.getMonth() + 1}`
    }
    const fortmattedDate = `${date.getFullYear()}-${month}-${day}` 

    response.render('transaction/editTransaction', { title: "Edit Transaction", transaction, fortmattedDate, purchaseId });
})


// // Edit an existing transaction
router.patch('/:purchaseId/edit/:transactionId', checkAuthentication, accessGrant, validateTransaction, async (request, response) => {

    const { purchaseId, transactionId } = request.params;
    await Transaction.findByIdAndUpdate(transactionId, request.body.transaction);

    response.redirect(`/purchase/purchase-transactions/${purchaseId}`);
})


module.exports = router;