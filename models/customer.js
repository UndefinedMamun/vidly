const mongoose = require('mongoose');

const Customer = mongoose.model('customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 60
    },
    idGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        minlength: 6,
        maxlength: 60,
        required: true
    }
}))

module.exports = Customer;