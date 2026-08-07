const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const {
  createBookingRules,
  updateBookingRules,
  handleValidationErrors,
} = require("../middleware/validateBooking");

router.post("/", createBookingRules, handleValidationErrors, createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBookingRules, handleValidationErrors, updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
