const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const authenticate = require('./authenticateUser');

// GET list of courses
router.get('/', (req, res, next) => {
    Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
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
    Course.findByPk(req.params.id, 
        { attributes: { exclude: ['createdAt', 'updatedAt'] } })
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
router.post('/', authenticate, (req, res, next) => {
    const { id } = req.currentUser;
    req.body.userId = id;

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
router.put('/:id', authenticate, (req, res, next) => {
    const { id } = req.currentUser;

    Course.findByPk(req.params.id)
    .then((course) => {
        if (!course) {
            const error = new Error('No course was found.');
            error.status = 404;
            next(error);
        } else {
            if (course.userId === id) {
                course.update(req.body)
                .then(() => res.status(204).end())
                .catch((err) => {
                    if (err.name === "SequelizeValidationError") {
                        const error = new Error(err.message);
                        error.status = 400;
                        next(error);
                    }
                });
            } else {
                const error = new Error('Sorry, you are not authorized to edit this course.');
                error.status = 403;
                next(error);
            }
        }
    }).catch((err) => res.sendStatus(500));
});

// DELETE a course
router.delete('/:id', authenticate, (req, res, next) => {
    const { id } = req.currentUser;

    Course.findByPk(req.params.id).then((course) => {
      if (course) {
          if (course.userId === id) {
            course.destroy();
            res.status(204).end();
          } else {
            const error = new Error('Sorry, you are not authorized to delete this course.');
            error.status = 403;
            next(error);
          } 
      } else {
        const error = new Error('No course was found.');
        error.status = 404;
        next(error);
      }
    }).catch((error) => next(error));
});

module.exports = router;