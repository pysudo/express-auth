const userSchema = require('../utils/userSchema');


module.exports.checkAuthentication = async (request, response, next) => {

    if (!request.session.userID) {
        request.flash('error', "You must log in to continue.");
        return response.redirect('/user/login');
    }
    next();
}


module.exports.validateRegistration = (request, response, next) => {
    const validatedResult = userSchema.validate(request.body);
    console.log(validatedResult.error);
    if (validatedResult.error) {
        request.flash('error', "Username must be between 6 to 30 characters long");
        request.flash('error', "Password must atleast 8 characters long.");
        return response.redirect('/user/register');
    }
    else {
        next();
    }
}