require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./server/database/db');
connectDB('app');

const mongoose = require('mongoose');
const cors = require('cors');

//Front
const indexRouter = require('./server/routes/front/index');
const adminRouter = require('./server/routes/front/admin');
const homeRouter = require('./server/routes/front/home');

//Api
const elementsRouter = require('./server/routes/api/elements');

const app = express();

app.options('*', cors());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//https://github.com/expressjs/session
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/home', homeRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);

//API
app.use('/api', elementsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
