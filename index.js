const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session')


const User = require('./models/user');
const userSchema = require('./utils/userSchema');
const { response } = require('express');


mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


app = express();
app.engine('ejs', engine);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'sample',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true 
    }
}))
app.use(flash());
app.use((request, response, next) => {

    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');

    next();
})


const checkAuthentication = async (request, response, next) => {
    
    if (!request.session.userID) {
        request.flash('error', "You must log in to continue.");
        return response.redirect('/login');
    }
    next();
}

const validateRegistration = (request, response, next) => {
    const validatedResult = userSchema.validate(request.body);
    if (validatedResult.error.details[0].context.key == 'username') {
        request.flash('error', "Username must be between 6 to 30 characters long.");
        return response.redirect('/register');
    }
    else if (validatedResult.error.details[0].context.key == 'password') {
        request.flash('error', "Password must be between 8 to 128 characters long.");
        return response.redirect('/register');
    }
    else {
        next();
    }
    // if (validatedResult.error) {
    //     request.flash('error', "Something went wrong!");
    //     // request.flash('uname', "Something went wrong!");
    //     // request.flash('passw', "Something went wrong!");
        
    //     response.redirect('/register');
    // }
    // else {
    //     next();
    // }
}   


app.get('/', checkAuthentication, (request, response) => {

    response.render('index', { title: "Home" });
});


// Renders a form to register a user
app.get('/register', (request, response) => {

    response.render('register', { title: "Register" });
});


// Registers a user
app.post('/register', validateRegistration, async (request, response) => {

    const { username, password } = request.body;
    const user = new User({ username, password });
    await user.save();
    request.session.userID = user._id;
    request.flash('success', "Successfully registered");
    
    response.redirect('/');
})


// Renders a form to log-in a user
app.get('/login', (request, response) => {

    response.render('login', { title: "Login" });
});


// Logs the user in
app.post('/login', async (request, response) => {

    const { username, password } = request.body;
    const user = await User.findOne({ username: username });
    if (!user || password != user.password) {
        request.flash('error', "Invalid username or password");
        return response.redirect('/login');
    }
    request.session.userID = user._id;
    request.flash('success', 'Successfully signed in');

    response.redirect('/');
})


app.post('/logout', (request, response) => {
    
    request.session.userID = null;
    request.flash('success', "Successfully logged out")

    response.redirect('/login');
})

// Displays a 404, if requested page is invalid 
app.all('*', (request, response) => {

    request.flash('error', "Page not found!");
    response.status(404);

    response.redirect('/');
});


app.listen(3000, () => {

    console.log("Serving on port 3000.");
})