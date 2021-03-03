require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo').default;


const user = require('./routes/authentication');
const profile = require('./routes/profile');
const purchase = require('./routes/purchase');
const admin = require('./routes/admin');
const client = require('./routes/client');
const report = require('./routes/report');
const payment = require('./routes/payment');
const User = require('./models/user');
const { checkAuthentication, accessGrant } = require('./utils/middlewares');


DB_URL = process.env.DB_URL;
LOCAL_DB = "mongodb://localhost:27017/portfolio";
const dbInstancePath = DB_URL || LOCAL_DB;
mongoose.connect(`${dbInstancePath}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
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

const secret = process.env.SESSION_SECRET; 
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    },
    store: MongoStore.create({
        secret,
        mongoUrl: dbInstancePath,
        touchAfter: 24 * 60 * 60
    })
}))
app.use(flash());
app.use(async (request, response, next) => {

    response.locals.currentUser = request.session.username;
    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');

    next();
})
app.use(methodOverride('_method'));

// Routes
app.use('/user', user);
app.use('/profile', profile);
app.use('/purchase', purchase);
app.use('/admin', admin);
app.use('/client', client);
app.use('/payment', payment);
app.use('/report', report);


// Renders home page
app.get('/', checkAuthentication, accessGrant, async (request, response) => {

    const user = await User.findById(request.session.userID);
    const fullname = `${user.firstname} ${user.lastname}`;
    response.render('index', { title: "Home", fullname });
});


// Displays a 404, if requested page is invalid 
app.all('*', (request, response) => {

    request.flash('error', "Page not found!");
    response.status(404);

    response.redirect('/');
});


app.listen(3000, () => {

    console.log("Serving on port 3000.");
})