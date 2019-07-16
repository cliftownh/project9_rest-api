const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const authenticate = require('./authenticateUser');

router.get('/', authenticate, (req, res) => {
    const { firstName, lastName, emailAddress } = req.currentUser;

    res.json({
        name: `${firstName} ${lastName}`,
        email: emailAddress
    });
});

// POST create user
router.post('/', (req, res, next) => {
    if (req.body.password === '') {
        const error = new Error('Password is required.')
        error.status = 400;
        next(error);
    } else {

        const { emailAddress } = req.body;
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValidEmail = (email) => {
            return emailReg.test(email);
        };

        if (!isValidEmail(emailAddress)) {

            const error = new Error('Must be a valid email address.')
            error.status = 400;
            next(error);
        } else {

            User.findAll({ attributes: ['emailAddress'] })
            .then((emails) => {
                for (let i = 0; i < emails.length; i++ ) {
                    if (emails[i].emailAddress === emailAddress) {
                        const error = new Error('This email address belongs to an existing user.')
                        error.status = 400;
                        next(error);
                    }
                }
            })
            .catch((err => next(err)));

            let hashedPw = bcrypt.hashSync(req.body.password);
            req.body.password = hashedPw;

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
        }
    }
});

module.exports = router;