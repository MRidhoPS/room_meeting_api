const { listRoomQuery, detailRoomQuery, bookingAvailabeQuery } = require("../model/publicModel");

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

async function getRoomAvailability(req, res) {
    const roomId = req.params.id;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ status: 400, message: "Date is required" });
    }

    try {
        // Ambil booking dari DB
        const bookings = await bookingAvailabeQuery(roomId, date);

        // Jam operasional
        const openHour = 8;
        const closeHour = 20;

        // Helper ubah ke menit
        function toMinutes(timeStr) {
            if (!timeStr) return 0;
            if (timeStr instanceof Date) {
                return timeStr.getHours() * 60 + timeStr.getMinutes();
            }
            const [h, m] = timeStr.split(":");
            return parseInt(h, 10) * 60 + parseInt(m, 10);
        }

        let availability = [];

        for (let hour = openHour; hour < closeHour; hour++) {
            const slotStart = `${hour.toString().padStart(2, "0")}:00:00`;
            const slotEnd = `${(hour + 1).toString().padStart(2, "0")}:00:00`;

            const slotStartMin = toMinutes(slotStart);
            const slotEndMin = toMinutes(slotEnd);

            let isAvailable = true;

            for (let booking of bookings) {
                const bookingStart = toMinutes(booking.start_time);
                const bookingEnd = toMinutes(booking.end_time);

                // Jika slot overlap dengan booking
                if (!(slotEndMin <= bookingStart || slotStartMin >= bookingEnd)) {
                    isAvailable = false;
                    break;
                }
            }

            availability.push({
                time: `${slotStart} - ${slotEnd}`,
                available: isAvailable,
            });
        }

        return res.json({
            status: 200,
            message: "Success",
            data: { roomId, date, availability },
        });
    } catch (error) {
        console.error("Error getRoomAvailability:", error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}






module.exports = { listRoomController, detailRoomController, getRoomAvailability };