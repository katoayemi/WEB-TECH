'use strict';

const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name may only contain letters, spaces, hyphens, and apostrophes.'),

  body('roll')
    .trim()
    .notEmpty().withMessage('Roll number is required.')
    .isLength({ min: 1, max: 20 })
    .withMessage('Roll number must be at most 20 characters.')
    .isAlphanumeric()
    .withMessage('Roll number may only contain letters and digits.'),
];

module.exports = { registerValidation };
