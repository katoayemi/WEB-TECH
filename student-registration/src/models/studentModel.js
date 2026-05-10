'use strict';

const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────────
// Create a new student record
// ─────────────────────────────────────────────
async function createStudent({ name, rollNumber }) {
  const [result] = await pool.execute(
    `INSERT INTO students (id, name, roll_number)
     VALUES (?, ?, ?)`,
    [id, name.trim(), rollNumber.trim()]
  );
  return {name: name.trim(), rollNumber: rollNumber.trim(), result };
}

// ─────────────────────────────────────────────
// Find student by roll number (for duplicate check)
// ─────────────────────────────────────────────
async function findByRollNumber(rollNumber) {
  const [rows] = await pool.execute(
    `SELECT name, roll_number, created_at
     FROM students
     WHERE roll_number = ?
     LIMIT 1`,
    [rollNumber.trim()]
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────
// Get all students (paginated)
// ─────────────────────────────────────────────
async function getAllStudents({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows]  = await pool.execute(
    `SELECT name, roll_number, created_at
     FROM students
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await pool.execute(
    'SELECT COUNT(*) AS total FROM students'
  );
  return { students: rows, total, page, limit };
}

// ─────────────────────────────────────────────
// Audit log helper
// ─────────────────────────────────────────────
async function logAction({ studentId, action, ipAddress }) {
  await pool.execute(
    `INSERT INTO registration_logs (student_id, action, ip_address)
     VALUES (?, ?, ?)`,
    [studentId, action, ipAddress || null]
  );
}

module.exports = { createStudent, findByRollNumber, getAllStudents, logAction };
