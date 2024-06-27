const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const looger = require('morgan');
const cors = require('cors');
const app = express();

require('./models/dbConnection')

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

// Middleware
app.use(bodyParser.json()); // analysing the request body
app.use(looger('dev'));     // register the http request 
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;