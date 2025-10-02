const express = require('express');
const { listRoomController, detailRoomController, getRoomAvailability } = require('../controller/publicConrotller');
const router = express.Router();

// GET / rooms           // list semua room
router.get('/rooms', listRoomController)
// GET / rooms /: id       // detail 1 room
router.get('/rooms/:id', detailRoomController)

router.get("/rooms/:id/availability", getRoomAvailability);

module.exports = router;