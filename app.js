"use strict";

const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const createError = require('http-errors');
const dotenv = require('dotenv');
const http = require('http');
const jwtDecode = require('jwt-decode');

const apiRouter = require('./routes/api');
const serviceh2hRouter = require('./routes/serviceh2h');
const callbackh2hRouter = require('./routes/callback');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

// MySQL Connection - Uncomment this block if needed
// app.use(myConnection(mysql, {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME
// }, 'single'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', apiRouter);
app.use('/api/gImexjMGhBxkiHXOpCyjxJalx', serviceh2hRouter);
app.use('/callback/VVJcQfrbHnMvYqVZnfrYjFwmk', callbackh2hRouter);

app.use((req, res, next) => {
    next(createError(404));
});

// Server setup
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
