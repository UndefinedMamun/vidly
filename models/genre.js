const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 60
    }
})

const Genre = mongoose.model('genre', genreSchema)


function validateGenre(g) {
    const schema = {
        name: Joi.string().min(3).max(60).required()
    }

    return Joi.validate(g, schema);
}

module.exports = { Genre, validateGenre, genreSchema }