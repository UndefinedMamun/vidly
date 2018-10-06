const Customer = require('../models/customer')

const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('customer not found..');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('customer not found..');

    res.send(customer);
});

router.post('/', (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    })

    customer.save()
        .then(c => res.send(c))
        .catch(ex => {
            let errors = [];
            for (err in ex.errors) {
                // console.log(ex.errors[err].message);
                const { message, kind, path } = ex.errors[err];
                errors.push({ message, kind, path })
            }
            res.status('400').send(errors)
        })
});

router.put('/:id', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.validate()
    } catch (ex) {
        let errors = [];
        for (err in ex.errors) {
            // console.log(ex.errors[err].message);
            const { message, kind, path } = ex.errors[err];
            errors.push({ message, kind, path })
        }
        return res.status('400').send(errors)
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });

    if (!customer) return res.status(404).send('Genre not found..');

    res.send(customer);
});


module.exports = router;