// Import module
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const { reqLogger, errLogger } = require('./middleware/logEvents');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credential = require('./middleware/credential');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = process.env.PORT || 3500;

connectDB();

// Logging requests
app.use(reqLogger);
app.use(credential);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


app.use('/', express.static(path.join(__dirname, '.', 'public')));

app.use('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'views', 'index.html'));
});

app.use('/register', require(path.join(__dirname, '.', 'routes', 'registerRoute')));
app.use('/login', require(path.join(__dirname, '.', 'routes', 'loginRoute')));
app.use('/refresh-token', require(path.join(__dirname, '.', 'routes', 'refreshTokenRoute')));
app.use('/logout', require(path.join(__dirname, '.', 'routes', 'logoutRoute')));

// API
app.use(verifyJWT);
app.use('/api/users', require(path.join(__dirname, '.', 'routes', 'api', 'users')));
app.use('/api/employees', require(path.join(__dirname, '.', 'routes', 'api', 'employees')));

app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'views', '404.html'));
});

// Logging errors
app.use(errLogger);

mongoose.connection.once('open', () => {
    console.log('Connection to mongoDB');
    // Listen on POST
    app.listen(PORT, console.log(`Server listening on ${PORT}`));
})
