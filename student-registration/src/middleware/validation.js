'use strict';

const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }),

  body('rollNumber')
    .trim()
    .notEmpty().withMessage('Roll number is required.')
    .isLength({ min: 1, max: 20 })
    .isAlphanumeric()
];

module.exports = { registerValidation };