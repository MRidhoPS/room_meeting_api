const express = require('express');
const { verifyToken } = require('../middleware/verifyToken')
const { checkRole } = require('../middleware/checkRole');
const { addRoomController, editRoomController, deleteRoomController, addFacilitiesController, uploadRoomPhotoController, listRoombyIdController, detailRoomController } = require('../controller/adminContoller');
const { uploader, upload } = require('../database/cloudinary');

const router = express.Router();

router.get('/rooms/:id', verifyToken, listRoombyIdController); //done

router.get('/rooms/:room_id/:admin_id', verifyToken, detailRoomController); // done

// POST / admin / rooms                // buat room
router.post('/rooms', verifyToken, checkRole('admin'), upload.single('thumbnail'), addRoomController); // done

// PUT / admin / rooms /: id            // edit room
router.put('/rooms/:id', verifyToken, checkRole('admin'), editRoomController);     // hapus room // done
router.delete('/rooms/:id', verifyToken, checkRole('admin'), deleteRoomController); // done

// POST / admin / rooms /: id / photos     // upload foto room
router.post(
    '/rooms/:roomId/photos',
    verifyToken, checkRole('admin'),
    upload.array('photos', 5),
    uploadRoomPhotoController
); // done

// POST / admin / rooms /: id / facilities // upload fasilitas
router.post('/rooms/:roomId/facilities', verifyToken, checkRole('admin'), addFacilitiesController) // done

module.exports = router;
