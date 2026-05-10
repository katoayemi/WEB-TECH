-- ============================================================
--  Student Registration System — Database Setup
--  Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS student_registration
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_registration;

-- ─────────────────────────────────────────────
-- Table: students
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id          CHAR(36)        NOT NULL PRIMARY KEY,
  name        VARCHAR(100)    NOT NULL,
  roll_number VARCHAR(20)     NOT NULL UNIQUE,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_roll_number (roll_number),
  INDEX idx_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Table: registration_logs  (audit trail)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registration_logs (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id  CHAR(36)        NOT NULL,
  action      ENUM('CREATE','UPDATE','DELETE') NOT NULL,
  ip_address  VARCHAR(45),
  logged_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_logged_at  (logged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
