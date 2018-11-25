const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre')

const Movie = mongoose.model('movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genres: {
        type: [genreSchema],
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}))


function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        // genreIds: Joi.objectId().required(),
        genreIds: Joi.array().items(Joi.objectId()).single(true),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }

    return Joi.validate(movie, schema);
}


module.exports = { Movie, validateMovie }