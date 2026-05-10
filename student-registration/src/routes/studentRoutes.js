'use strict';

const { Router } = require('express');
const { register, list } = require('../controllers/studentController');
const { registerValidation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = Router();

/**
 * POST /api/students
 * Register a new student.
 * Body: { name: string, roll: string }
 */
router.post('/', registerValidation, asyncHandler(register));

/**
 * GET /api/students
 * List all students.
 * Query: ?page=1&limit=20
 */
router.get('/', asyncHandler(list));

module.exports = router;
