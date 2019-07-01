const express = require('express');
const router = express.Router();
const { Course } = require('../models');

router.get('/', (req, res) => {
    Course.findAll()
        .then(courses => {
            res.json(courses);
        })
        .catch(err => res.json(err));
});

module.exports = router;