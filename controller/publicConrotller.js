const { listRoomQuery, detailRoomQuery } = require("../model/publicModel");

async function listRoomController(req, res) {
    try {
        const result = await listRoomQuery();

        res.status(200).json({ status: 200, message: "Success", data: result })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

async function detailRoomController(req, res) {
    const { id } = req.params;

    try {
        const [rows] = await detailRoomQuery(id); 

        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Meeting room tidak ditemukan"
            });
        }

        const room = {
            id: rows[0].id,
            name: rows[0].name,
            capacity: parseInt(rows[0].capacity),
            hourly_price: parseFloat(rows[0].hourly_price),
            description: rows[0].description,
            photos: [],
            facilities: []
        };

        const photoSet = new Set();
        const facilitySet = new Set();

        for (const row of rows) {
            if (row.photo_url && !photoSet.has(row.photo_url)) {
                room.photos.push(row.photo_url);
                photoSet.add(row.photo_url);
            }

            if (row.facility_name && !facilitySet.has(row.facility_name)) {
                room.facilities.push(row.facility_name);
                facilitySet.add(row.facility_name);
            }
        }

        res.status(200).json({
            status: 200,
            message: "Success",
            data: room
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });

        console.log(error.message);
    }
}


module.exports = { listRoomController, detailRoomController };