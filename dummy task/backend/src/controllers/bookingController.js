const pool = require("../config/db");

const ALLOWED_FIELDS = [
  "customer_name",
  "contact_number",
  "email",
  "table_number",
  "number_of_guests",
  "booking_date",
  "booking_time",
  "special_request",
  "advance_payment",
  "status",
];

// Checks whether the given table is already reserved for that date/time
// by a different (non-cancelled) booking. The DB schema alone can't stop
// this, so it's enforced here before create/update.
async function isTableAlreadyBooked({ table_number, booking_date, booking_time, excludeId }) {
  let sql = `
    SELECT booking_id FROM Table_Booking
    WHERE table_number = ?
      AND booking_date = ?
      AND booking_time = ?
      AND status != 'Cancelled'
  `;
  const params = [table_number, booking_date, booking_time];

  if (excludeId) {
    sql += " AND booking_id != ?";
    params.push(excludeId);
  }

  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
}

// POST /api/bookings
async function createBooking(req, res, next) {
  try {
    const {
      customer_name,
      contact_number,
      email = null,
      table_number,
      number_of_guests,
      booking_date,
      booking_time,
      special_request = null,
      advance_payment,
      status = "Booked",
    } = req.body;

    const conflict = await isTableAlreadyBooked({ table_number, booking_date, booking_time });
    if (conflict) {
      return res.status(409).json({
        message: `Table ${table_number} is already booked for ${booking_date} at ${booking_time}`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO Table_Booking
        (customer_name, contact_number, email, table_number, number_of_guests,
         booking_date, booking_time, special_request, status, advance_payment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name,
        contact_number,
        email,
        table_number,
        number_of_guests,
        booking_date,
        booking_time,
        special_request,
        status,
        advance_payment,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM Table_Booking WHERE booking_id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings
// Supports optional query filters: ?status=Booked&booking_date=2026-08-06
async function getAllBookings(req, res, next) {
  try {
    const { status, booking_date } = req.query;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }
    if (booking_date) {
      conditions.push("booking_date = ?");
      params.push(booking_date);
    }

    let sql = "SELECT * FROM Table_Booking";
    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY booking_date ASC, booking_time ASC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/:id
async function getBookingById(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM Table_Booking WHERE booking_id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/bookings/:id
// Partial update - only fields present in the body are changed.
async function updateBooking(req, res, next) {
  try {
    const { id } = req.params;

    const [existingRows] = await pool.query(
      "SELECT * FROM Table_Booking WHERE booking_id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const existing = existingRows[0];

    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    // Re-check for a table conflict if the table/date/time is changing
    const nextTableNumber = updates.table_number ?? existing.table_number;
    const nextDate = updates.booking_date ?? existing.booking_date;
    const nextTime = updates.booking_time ?? existing.booking_time;

    const conflict = await isTableAlreadyBooked({
      table_number: nextTableNumber,
      booking_date: nextDate,
      booking_time: nextTime,
      excludeId: id,
    });
    if (conflict) {
      return res.status(409).json({
        message: `Table ${nextTableNumber} is already booked for ${nextDate} at ${nextTime}`,
      });
    }

    const setClause = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);

    await pool.query(`UPDATE Table_Booking SET ${setClause} WHERE booking_id = ?`, [
      ...values,
      id,
    ]);

    const [rows] = await pool.query("SELECT * FROM Table_Booking WHERE booking_id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/bookings/:id
async function deleteBooking(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM Table_Booking WHERE booking_id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
