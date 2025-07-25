const express = require('express');
const { verifyToken } = require('../middleware/verifyToken')
const { checkRole } = require('../middleware/checkRole');
const { addRoomController, editRoomController, deleteRoomController, addFacilitiesController, uploadRoomPhotoController } = require('../controller/adminContoller');
const { uploader, upload } = require('../database/cloudinary');

const router = express.Router();



// POST / admin / rooms                // buat room
router.post('/rooms', verifyToken, checkRole('admin'), upload.single('thumbnail'), addRoomController);

// PUT / admin / rooms /: id            // edit room
router.put('/rooms/:id', verifyToken, checkRole('admin'), editRoomController);
// DELETE / admin / rooms /: id            // hapus room
router.delete('/rooms/:id', verifyToken, checkRole('admin'), deleteRoomController);

// POST / admin / rooms /: id / photos     // upload foto room
router.post(
    '/rooms/:roomId/photos',
    verifyToken, checkRole('admin'),
    upload.array('photos', 5),
    uploadRoomPhotoController
);
// POST / admin / rooms /: id / facilities // upload fasilitas
router.post('/rooms/:roomId/facilities', verifyToken, checkRole('admin'), addFacilitiesController)

module.exports = router;
