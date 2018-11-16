const Joi = require('joi');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

const { User } = require('../models/user')

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Inavlid email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Inavlid email or password!');

    const token = jwt.sign({ _id: user._id, name: user.name }, config.get('jwtPrivateKey'));
    res.send(token);
});


function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().required()
    }

    return Joi.validate(req, schema);
}


module.exports = router;