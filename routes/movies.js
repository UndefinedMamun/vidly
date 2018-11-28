// const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');




router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('movie not found..');

    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send('movie not found..');

    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    async function fetchGenres() {
        let genres = await Promise.all(req.body.genreIds.map(async (id) => {
            let genre = await Genre.findById(id);
            if (!genre) return res.status(400).send('Invalid genres.');

            // console.log(_.omit(genre, '__v'))
            return {
                _id: genre._id,
                name: genre.name
            }
        }));
        return genres;
    }

    const genres = await fetchGenres();


    const movie = new Movie({
        title: req.body.title,
        genres: genres,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        await movie.save();
        res.send(movie);
    } catch (ex) {
        let errors = [];
        for (err in ex.errors) {
            // console.log(ex.errors[err].message);
            const { message, kind, path } = ex.errors[err];
            errors.push({ message, kind, path })
        }
        return res.status('400').send(errors)
    }
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    async function fetchGenres() {
        let genres = await Promise.all(req.body.genreIds.map(async (id) => {
            let genre = await Genre.findById(id);
            if (!genre) return res.status(400).send('Invalid genres.');

            // console.log(_.omit(genre, '__v'))
            return {
                _id: genre._id,
                name: genre.name
            }
        }));
        return genres;
    }

    const genres = await fetchGenres();

    let movie = {
        title: req.body.title,
        genres,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    };

    movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: movie
    }, { new: true });

    if (!movie) return res.status(404).send('Genre not found..');

    res.send(movie);
});

module.exports = router;