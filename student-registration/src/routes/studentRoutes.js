'use strict';

const { Router } = require('express');
const { validationResult } = require('express-validator');

const { register, list } = require('../controllers/studentController');
const { registerValidation } = require('../middleware/validation');

const router = Router();

// async wrapper
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST student
router.post(
  '/',
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
  asyncHandler(register)
);

// GET students
router.get('/', asyncHandler(list));

module.exports = router;