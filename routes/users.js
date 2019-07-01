const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', (req, res) => {
    User.findAll()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.json(err));
});

module.exports = router;