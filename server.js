// Import module
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { reqLogger, errLogger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credential = require('./middleware/credential');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const PORT = process.env.PORT || 3500;

connectDB();

// Logging requests
app.use(reqLogger);
app.use(credential);
app.use(cors(corsOptions));



app.use('/', express.static(path.join(__dirname, '.', 'public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'views', 'index.html'));
});


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
