'use strict';

const db = require('../config/db');

// INSERT student
function createStudent({ name, rollNumber }) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO student (name, roll_number) VALUES (?, ?)",
      [name, rollNumber],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          id: result.insertId,
          name,
          rollNumber,
        });
      }
    );
  });
}

// FIND by roll number
function findByRollNumber(rollNumber) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM student WHERE roll_number = ?",
      [rollNumber],
      (err, rows) => {
        if (err) {
  console.error("MYSQL INSERT ERROR:", err);
  return reject(err);
}
        resolve(rows[0] || null);
      }
    );
  });
}

// GET ALL students (basic pagination)
function getAllStudents({ page, limit }) {
  const offset = (page - 1) * limit;

  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM student ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, rows) => {
        if (err) return reject(err);

        resolve({
          page,
          limit,
          data: rows,
        });
      }
    );
  });
}

// simple log (optional)
function logAction(data) {
  return Promise.resolve(); // placeholder
}

module.exports = {
  createStudent,
  findByRollNumber,
  getAllStudents,
  logAction,
};