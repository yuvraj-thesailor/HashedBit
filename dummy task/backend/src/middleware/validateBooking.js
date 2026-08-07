const { body, validationResult } = require("express-validator");

const STATUS_VALUES = ["Booked", "Seated", "Completed", "Cancelled"];

// Matches phone numbers like "9876543210" or "+91 9876543210" (7-15 digits, optional leading +)
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

// Matches "HH:mm" or "HH:mm:ss" in 24-hour format
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

// booking_date must parse to a real calendar date that is today or later.
// Compares by date only, ignoring the current time of day.
function isNotInPast(value) {
  const bookingDate = new Date(value);
  if (Number.isNaN(bookingDate.getTime())) {
    throw new Error("booking_date must be a valid date");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new Error("booking_date cannot be in the past");
  }
  return true;
}

// Rules for POST /api/bookings — every required field must be present
const createBookingRules = [
  body("customer_name")
    .trim()
    .notEmpty()
    .withMessage("customer_name is required")
    .isString(),

  body("contact_number")
    .trim()
    .notEmpty()
    .withMessage("contact_number is required")
    .matches(PHONE_REGEX)
    .withMessage("contact_number must be a valid phone number"),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("email must be a valid email address"),

  body("table_number")
    .notEmpty()
    .withMessage("table_number is required")
    .isInt({ min: 1 })
    .withMessage("table_number must be a positive integer"),

  body("number_of_guests")
    .notEmpty()
    .withMessage("number_of_guests is required")
    .isInt({ min: 1 })
    .withMessage("number_of_guests must be a positive integer"),

  body("booking_date")
    .notEmpty()
    .withMessage("booking_date is required")
    .isISO8601()
    .withMessage("booking_date must be a valid date (YYYY-MM-DD)")
    .bail()
    .custom(isNotInPast),

  body("booking_time")
    .notEmpty()
    .withMessage("booking_time is required")
    .matches(TIME_REGEX)
    .withMessage("booking_time must be a valid 24-hour time (HH:mm or HH:mm:ss)"),

  body("special_request")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage("special_request must be 500 characters or fewer"),

  body("advance_payment")
    .notEmpty()
    .withMessage("advance_payment is required")
    .isFloat({ min: 0 })
    .withMessage("advance_payment must be a non-negative number"),

  body("status")
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`status must be one of: ${STATUS_VALUES.join(", ")}`),
];

// Rules for PUT /api/bookings/:id — same constraints, but every field is
// optional since a caller may only want to update a subset (e.g. just status).
const updateBookingRules = [
  body("customer_name").optional().trim().notEmpty().isString(),

  body("contact_number")
    .optional()
    .trim()
    .notEmpty()
    .matches(PHONE_REGEX)
    .withMessage("contact_number must be a valid phone number"),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("email must be a valid email address"),

  body("table_number")
    .optional()
    .isInt({ min: 1 })
    .withMessage("table_number must be a positive integer"),

  body("number_of_guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("number_of_guests must be a positive integer"),

  body("booking_date")
    .optional()
    .isISO8601()
    .withMessage("booking_date must be a valid date (YYYY-MM-DD)")
    .bail()
    .custom(isNotInPast),

  body("booking_time")
    .optional()
    .matches(TIME_REGEX)
    .withMessage("booking_time must be a valid 24-hour time (HH:mm or HH:mm:ss)"),

  body("special_request")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage("special_request must be 500 characters or fewer"),

  body("advance_payment")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("advance_payment must be a non-negative number"),

  body("status")
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`status must be one of: ${STATUS_VALUES.join(", ")}`),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = {
  createBookingRules,
  updateBookingRules,
  handleValidationErrors,
  STATUS_VALUES,
};
