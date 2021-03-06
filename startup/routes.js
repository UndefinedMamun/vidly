const express = require('express');
const cors = require('cors');

const { err } = require('../middleware/error');

const home = require('../routes/home');
const genre = require('../routes/genre');
const customer = require('../routes/customer');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');



module.exports = function (app) {
    app.use(express.json());
    app.use(cors())

    app.use('/', home);
    app.use('/api/genres', genre);
    app.use('/api/customers', customer);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(err);
}