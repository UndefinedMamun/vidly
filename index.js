const express = require('express');
const mongoose = require('mongoose');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const home = require('./routes/home');
const genre = require('./routes/genre');
const customer = require('./routes/customer');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');


const uri = 'mongodb://localhost/vidly';
mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => console.log('Mongodb Connected succesfully...'))
    .catch(err => console.err('Failed to Connect to mongodb..', err));


const app = express();
app.use(express.json());

app.use('/', home);

app.use('/api/genres', genre);
app.use('/api/customers', customer);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}..`));

