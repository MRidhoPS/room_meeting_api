const express = require('express');
const { listRoomController, detailRoomController } = require('../controller/publicConrotller');
const router = express.Router();

// GET / rooms           // list semua room
router.get('/rooms', listRoomController)
// GET / rooms /: id       // detail 1 room
router.get('/rooms/:id', detailRoomController)

module.exports = router;