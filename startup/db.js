const mongoose = require('mongoose');


module.exports = function () {
    const uri = 'mongodb://localhost/vidly';
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
        .then(() => console.info('Mongodb Connected succesfully...'))
}