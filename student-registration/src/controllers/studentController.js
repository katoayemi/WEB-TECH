'use strict';

const { validationResult } = require('express-validator');
const {
  createStudent,
  findByRollNumber,
  getAllStudents,
  logAction,
} = require('../models/studentModel');

// POST /api/students
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const { name, rollNumber } = req.body;

  try {
    // duplicate check
    const existing = await findByRollNumber(rollNumber);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Roll number "${rollNumber}" already exists.`,
      });
    }

    // insert
    const student = await createStudent({ name, rollNumber });

    // optional log (non-blocking)
    logAction({
      action: 'CREATE',
      ipAddress: req.ip,
    }).catch(console.error);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}

// GET /api/students
async function list(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

    const data = await getAllStudents({ page, limit });

    return res.json({
      success: true,
      ...data,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}

module.exports = { register, list };