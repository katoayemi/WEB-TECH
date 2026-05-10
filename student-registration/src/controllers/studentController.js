'use strict';

const { validationResult } = require('express-validator');
const {
  createStudent,
  findByRollNumber,
  getAllStudents,
  logAction,
} = require('../models/studentModel');

// ─────────────────────────────────────────────
// POST /api/students  — Register a new student
// ─────────────────────────────────────────────
async function register(req, res) {
  // 1. Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { name, roll } = req.body;

  // 2. Duplicate roll-number check
  const existing = await findByRollNumber(roll);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `Roll number "${roll}" is already registered.`,
    });
  }

  // 3. Persist
  const student = await createStudent({ name, rollNumber: roll });

  // 4. Audit log (non-blocking)
  logAction({
    action:     'CREATE',
    ipAddress:  req.ip,
  }).catch(err => console.error('Audit log error:', err));

  return res.status(201).json({
    success: true,
    message: 'Student registered successfully.',
    data: {
      name: student.name,
      rollNumber: student.rollNumber,
    },
  });
}

// ─────────────────────────────────────────────
// GET /api/students  — List all students
// ─────────────────────────────────────────────
async function list(req, res) {
  const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

  const data = await getAllStudents({ page, limit });

  return res.json({
    success: true,
    ...data,
  });
}

module.exports = { register, list };
