const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const engine = require('ejs-mate');
const path = require('path');
const { request } = require('http');


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




app.get('/', (request, response) => {
    response.send("Home");
});


// Renders a form to log-in a user
app.get('/login', (request, response) => {
    response.render('login', { title: 'Login' });
});


app.post('/login', (request, response) => {
    response.send('Logged in');
})



// Renders a form to log-in a user
app.get('/register', (request, response) => {
    response.render('register', { title: 'Register' });
});


app.post('/register', (request, response) => {
    response.send('Registered');
})


app.listen(3000, () => {

    console.log("Serving on port 3000.");
})