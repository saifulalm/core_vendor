"use strict";
var createError = require('http-errors');
var express = require('express');
var path = require('path');

const mysql = require('mysql');
const myConnection = require('express-myconnection');
require('dotenv').config();
var http = require('http');
var jwtDecode = require('jwt-decode');


var apiRouter = require('./routes/api');


var app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


// app.use(myConnection(mysql, {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME
// }, 'single'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


var httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});