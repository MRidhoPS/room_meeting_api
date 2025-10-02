const express = require("express");
const { createBooking, listBookingByUserController } = require("../controller/bookingController");
const router = express.Router();

// POST / booking               // buat booking
router.post('/', createBooking)

// GET / booking / history       // lihat history booking user
router.get('/history/:userId', listBookingByUserController)
// GET / booking /: id           // detail booking

module.exports = router;
