const { userSchema, profileSchema, purchaseSchema } = require('../utils/userSchema');
const User = require('../models/user');


// Server side company user registeration validation
module.exports.validateRegistration = (request, response, next) => {

    const validatedResult = userSchema.validate(request.body);
    if (validatedResult.error) {
        request.flash('error', "Username must be between 6 to 30 characters long");
        request.flash('error', "Password must atleast 8 characters long.");
        return response.redirect('/user/register');
    }
    else {
        next();
    }
}


// Server side company profile  validation
module.exports.validateProfile = (request, response, next) => {

    const validatedProfile = profileSchema.validate(request.body);
    if (validatedProfile.error) {

        const errorNames = validatedProfile.error.details[0].path;
        const originalMessage = validatedProfile.error.details[0].message;
        const noOfDots = errorNames.length - 1;
        
        let errorName;
        switch (errorNames[1]) {
            case "name":
                errorName = "Company Name";
                break;
            case "address":
                errorName = "Company Address";
                break;
            case "pan":
                errorName = "Permanent Account Number";
                break;
            case "gst":
                errorName = "GST Identification Number";
                break;
        }
        switch (errorNames[2]) {
            case "landline":
                errorName = "Landline";
                break;
            case "phone":
                errorName = "Phone";
                break;
        }

        let slicedLength, modifiedErrorMessage;
        switch (noOfDots) {
            case 1:
                slicedLength = `"${errorNames[0]} "`.length + errorNames[1].length + noOfDots;
                modifiedErrorMessage = `${errorName} ${originalMessage.slice(slicedLength)}`;
                break;
            case 2:
                slicedLength = `"${errorNames[0]}${errorNames[1]} "`.length + errorNames[2].length + noOfDots;
                modifiedErrorMessage = `${errorName} ${originalMessage.slice(slicedLength)}`;
                break;
        }

        request.flash('error', modifiedErrorMessage);
        return response.redirect('/profile/add');
    }
    else {
        next();
    }
}


// Server side purchase validation
module.exports.validatePurchase = (request, response, next) => {

    const validatedPurchase = purchaseSchema.validate(request.body);
    if (validatedPurchase.error) {
        console.log(validatedPurchase.error)
        const errorNames = validatedPurchase.error.details[0].path;
        console.log(errorNames)
        const originalMessage = validatedPurchase.error.details[0].message;
        console.log(originalMessage)
        const noOfDots = errorNames.length - 1;

        let errorName;
        switch (errorNames[1]) {
            case "name":
                errorName = "Vendor Name";
                break;
            case "address":
                errorName = "Vendor Address";
                break;
            case "email":
                errorName = "Vendor Email";
                break;
            case "contact":
                errorName = "Vendor Contact";
                break;
        }
        switch (errorNames[2]) {
            case "bankName":
                errorName = "Bank Name";
                break;
            case "accountType":
                errorName = "Account Type";
                break;
            case "accountNumber":
                errorName = "Account Number";
                break;
            case "ifsc":
                errorName = "IFSC";
                break;
        }

        let slicedLength, modifiedErrorMessage;
        switch (noOfDots) {
            case 1:
                slicedLength = `"${errorNames[0]} "`.length + errorNames[1].length + noOfDots;
                modifiedErrorMessage = `${errorName} ${originalMessage.slice(slicedLength)}`;
                break;
            case 2:
                slicedLength = `"${errorNames[0]}${errorNames[1]} "`.length + errorNames[2].length + noOfDots;
                modifiedErrorMessage = `${errorName} ${originalMessage.slice(slicedLength)}`;
                break;
        }

        request.flash('error', modifiedErrorMessage);
        return response.redirect('/purchase/add');
    }
    else {
        next();
    }
}


// Verifies user authentication before authorization
module.exports.checkAuthentication = async (request, response, next) => {

    if (!request.session.userID) {
        request.flash('error', "You must log in to continue.");
        return response.redirect('/user/login');
    }
    next();
}


// Checks if the user is an administrator
module.exports.isAdmin = async (request, response, next) => {

    const user = await User.findById(request.session.userID);
    if (!user.isAdmin) {

        request.flash('error', "You don't have administrator privileges to perform that request.");
        return response.redirect('/');
    }
    next();
}


// Checks the user's access level and account access aproval 
module.exports.accessGrant = async (request, response, next) => {

    const user = await User.findById(request.session.userID);

    if (!user.isApproved) {

        request.session.userID = null;
        request.session.username = null;
        request.flash('error', "Your credentials have not been approved. Please contact the administrator");
        return response.redirect('/user/login');
    }

    if (user.grantLevel === 3 && request.method !== 'GET') {

        request.flash('error', "You don't have privileges to perform that request.");
        return response.redirect('/');
    }
    else if (user.grantLevel === 2 && (request.method !== 'GET' && request.method !== 'POST')) {

        request.flash('error', "You don't have privileges to perform that request.");
        return response.redirect('/');
    }
    else {
        next();
    }
}
