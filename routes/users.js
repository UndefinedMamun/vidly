const _ = require('lodash');
const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();

const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');






router.get('/', auth, async (req, res) => {
    // const user = await User.findById(req.user._id).select('-password');
    const user = await User.find().select('-password');
    res.send(user);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/isemailtaken/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) return res.send(true)

    return res.send(false)
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found..');

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.set('Access-Control-Expose-Headers', 'x-auth-token');
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true });

    if (!user) return res.status(404).send('User not found..');

    res.send(user);
});

module.exports = router;