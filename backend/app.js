const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const looger = require('morgan');
const cors = require('cors');
const app = express();

require('./models/dbConnection')

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const taskRouter = require('./routes/task');

// Middleware
app.use(bodyParser.json()); // analysing the request body
app.use(looger('dev'));     // register the http request 
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);

module.exports = app;