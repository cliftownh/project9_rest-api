const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    User.findAll()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.json(err));
});

// POST create user
router.post('/', (req, res, next) => {
    let { emailAddress } = req.body;
    let hashedPw = bcrypt.hashSync(req.body.password);
    req.body.password = hashedPw;
    
    User.findAll({ attributes: ['emailAddress'] })
    .then((emails) => {
        for (let i = 0; i < emails.length; i++ ) {
            if (emails[i].emailAddress === emailAddress) {
                const error = new Error('This email address belongs to an existing user.')
                error.status = 400;
                next(error);
            }
        }
    });

    User.create(req.body)
    .then((user) => {
        if (!user) {
            const error = new Error('No user was created.');
            error.status = 400;
            next(error);
        } else {
            res.location('/');
            res.status(201).end();
        }
    }).catch((err) => {
        if (err.name === "SequelizeValidationError") {
            const error = new Error(err.message);
            error.status = 400;
            next(error);
        }
    });
});

module.exports = router;