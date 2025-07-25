const { addRoomQuery, editRoomQuery, deleteRoomQuery, addFacilitiesQuery, photoRoomQuery } = require("../model/adminModel");

async function addRoomController(req, res) {
    const { name, capacity, hourly_price, description } = req.body;
    const id = req.user.userId;

    if (!name || !capacity || !hourly_price || !description) {
        return res.status(400).json({ message: "All field are required" })
    }

    const thumbnailUrl = req.file;

    console.log(thumbnailUrl.path);

    try {
        const result = await addRoomQuery({ name: name, admin_id: id, capacity, hourly_price, description, thumbnail_photo: thumbnailUrl.path });

        res.status(201).json({
            status: 201,
            message: "Berhasil menambahkan ruangan"
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Gagal Menambahkan Ruangan",
            error: error,
        })
    }
}

async function editRoomController(req, res) {

    const { id } = req.params;
    const { name, capacity, hourly_price, description } = req.body;

    if (!name || !capacity || !hourly_price || !description) {
        return res.status(400).json({ message: "All field are required" })
    }

    try {
        const result = await editRoomQuery(id, { name, capacity, hourly_price, description });

        res.status(200).json({
            status: 200,
            message: 'Meeting room berhasil diupdate',
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteRoomController(req, res) {
    const { id } = req.params;
    try {
        const result = await deleteRoomQuery(id);

        res.status(200).json({
            status: 200,
            message: 'Meeting room berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function addFacilitiesController(req, res) {
    const { roomId } = req.params;
    const { facilities } = req.body;

    if (!Array.isArray(facilities) || facilities.length === 0) {
        return res.status(400).json({
            status: 400,
            message: 'Daftar fasilitas tidak boleh kosong dan harus berupa array'
        });
    }

    try {
        await addFacilitiesQuery(roomId, facilities);

        res.status(201).json({
            status: 201,
            message: "Fasilitas berhasil ditambahkan"
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

async function uploadRoomPhotoController(req, res) {
    const { roomId } = req.params;

    try {
        const photoUrls = req.files.map(file => file.path);
        await photoRoomQuery(roomId, photoUrls);

        res.status(201).json({
            status: 201,
            message: 'Foto berhasil ditambahkan'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}


module.exports = { addRoomController, editRoomController, deleteRoomController, addFacilitiesController, uploadRoomPhotoController }