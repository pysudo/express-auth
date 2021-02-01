const userSchema = require('../utils/userSchema');
const User = require('../models/user');


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


module.exports.checkAuthentication = async (request, response, next) => {

    if (!request.session.userID) {
        request.flash('error', "You must log in to continue.");
        return response.redirect('/user/login');
    }
    next();
}


module.exports.isAdmin = async (request, response, next) => {

    const user = await User.findById(request.session.userID);
    if(!user.isAdmin) {

        request.flash('error', "You don't have administrator privileges to perform that request.");
        return response.redirect('/');
    }
    next();
}


module.exports.accessGrant = async (request, response, next) => {

    const user = await User.findById(request.session.userID);

    if(!user.isApproved) {

        request.session.userID = null;
        request.session.username = null;
        request.flash('error', "Your credentials have not been approved. Please contact the administrator");
        return response.redirect('/user/login');
    } 

    if(user.grantLevel === 3 && request.method !== 'GET') {

        request.flash('error', "You don't have privileges to perform that request.");
        return response.redirect('/');
    }
    else if(user.grantLevel === 2 && (request.method !== 'GET' && request.method !== 'POST')) {

        request.flash('error', "You don't have privileges to perform that request.");
        return response.redirect('/');
    }
    else {
        next();
    }  
}
