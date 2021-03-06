const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');

const { Rental, validate } = require('../models/rental');
const Customer = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).send('rental not found..');

    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send('rental not found..');

    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    // res.send(req.body)

    let rentalFee = 0;

    async function fetchMovies() {
        let movies = await Promise.all(req.body.movieIds.map(async (id) => {
            let movie = await Movie.findById(id);
            if (!movie) return res.status(400).send('Invalid movie.');
            if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');

            rentalFee += movie.dailyRentalRate;

            return {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        }))

        return movies;
    }

    const movies = await fetchMovies();



    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movies: movies,
        rentalFee
    });

    // let r = await rental.save();
    // res.send(r);

    // try {
    //     new Fawn.Task()
    //         .save('rentals', rental)
    //         .update('movies', { _id: movie._id }, {
    //             $inc: { numberInStock: -1 }
    //         })
    //         .run();

    //     res.send(rental);
    // } catch (ex) {
    //     res.status(500).send('Something went wrong..');
    // }

    let tasks = new Fawn.Task();

    tasks.save('rentals', rental);
    movies.forEach(movie => {
        tasks.update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
    });

    tasks.run({ useMongoose: true })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Something went wrong')
        })
});

// router.put('/:id', async (req, res) => {
//     const { error } = validateRental(req.body);
//     if (error) return res.status(400).send(error.details[0].message)

//     const genre = await Genre.findById(req.body.genreId);
//     if (!genre) return res.status(400).send('Invalid genre.');

//     let rental = {
//         title: req.body.title,
//         genre: {
//             _id: genre._id,
//             name: genre.name
//         },
//         numberInStock: req.body.numberInStock,
//         dailyRentalRate: req.body.dailyRentalRate
//     };

//     rental = await rental.findByIdAndUpdate(req.params.id, {
//         $set: rental
//     }, { new: true });

//     if (!rental) return res.status(404).send('Genre not found..');

//     res.send(rental);
// });

module.exports = router;