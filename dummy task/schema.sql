-- ============================================================
-- Restaurant Table Booking System (RTBS)
-- Database Schema
-- Target: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS rtbs_db;
USE rtbs_db;

-- ------------------------------------------------------------
-- Table: Table_Booking
-- ------------------------------------------------------------
DROP TABLE IF EXISTS Table_Booking;

CREATE TABLE Table_Booking (
    booking_id        INT AUTO_INCREMENT PRIMARY KEY,
    customer_name      VARCHAR(255)    NOT NULL,
    contact_number     VARCHAR(20)     NOT NULL,
    email              VARCHAR(255)    NULL,
    table_number       INT             NOT NULL,
    number_of_guests   INT             NOT NULL,
    booking_date       DATE            NOT NULL,
    booking_time       TIME            NOT NULL,
    special_request    VARCHAR(500)    NULL,
    status             ENUM('Booked', 'Seated', 'Completed', 'Cancelled') DEFAULT 'Booked',
    advance_payment    DECIMAL(10, 2)  DEFAULT 0.00,
    created_at         DATETIME        DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_table_number      CHECK (table_number > 0),
    CONSTRAINT chk_number_of_guests  CHECK (number_of_guests > 0),
    CONSTRAINT chk_advance_payment   CHECK (advance_payment >= 0)
);

-- ------------------------------------------------------------
-- Indexes for common query patterns
-- ------------------------------------------------------------
CREATE INDEX idx_booking_date_time ON Table_Booking (booking_date, booking_time);
CREATE INDEX idx_table_number      ON Table_Booking (table_number);
CREATE INDEX idx_status            ON Table_Booking (status);

-- ------------------------------------------------------------
-- Sample seed data
-- ------------------------------------------------------------
INSERT INTO Table_Booking
    (customer_name, contact_number, email, table_number, number_of_guests, booking_date, booking_time, special_request, status, advance_payment)
VALUES
    ('Aarav Sharma', '9876543210', 'aarav@example.com', 5, 4, CURDATE(), '19:30:00', 'Window seat preferred', 'Booked', 500.00),
    ('Priya Verma', '9123456780', NULL, 2, 2, CURDATE(), '20:00:00', NULL, 'Booked', 0.00),
    ('Rohan Mehta', '9988776655', 'rohan@example.com', 8, 6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', 'Birthday celebration - need a cake stand', 'Booked', 1000.00);
