const express = require('express');
const router = express.Router();
const { Course } = require('../models');

// GET list of courses
router.get('/', (req, res, next) => {
    Course.findAll()
    .then(courses => {
        if (courses) {
            res.json(courses);
        } else {
            const error = new Error('Could not find courses.');
            error.status = 400;
            next(error);
        }
        }).catch(err => res.json(err));
});

// GET course by id
router.get('/:id', (req, res, next) => {
    Course.findByPk(req.params.id)
    .then((course) => {
        if (course) {
            res.json(course);
        } else {
            const error = new Error('No course was found.');
            error.status = 404;
            next(error);
        }
        }).catch(err => res.json(err));
});

// POST create course
router.post('/', (req, res, next) => {
    Course.create(req.body)
    .then((course) => {
        if (!course) {
            const error = new Error('No course was created.');
            error.status = 400;
            next(error);
        } else {
            res.location(`/api/courses/${course.id}`);
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

// PUT update course
router.put('/:id', (req, res, next) => {
    Course.findByPk(req.params.id)
    .then((course) => {
        if (!course) {
            const error = new Error('No course was found.');
            error.status = 404;
            next(error);
        } else {
            course.update(req.body)
            .then(() => res.status(204).end())
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    const error = new Error(err.message);
                    error.status = 400;
                    next(error);
                }
            });
        }
    }).catch((err) => res.sendStatus(500));
});

// DELETE a course
router.delete('/:id', (req, res, next) => {
    Course.findByPk(req.params.id).then((course) => {
      if (course) {
        course.destroy();
        res.status(204).end();
      } else {
        const error = new Error('No course was found.');
        error.status = 404;
        next(error);
      }
    }).catch((error) => next(error));
});

module.exports = router;