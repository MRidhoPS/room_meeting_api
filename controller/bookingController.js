const { createBookingQuery, getBookingByIdQuery, checkBookingOverlapQuery, listBookingByUser } = require("../model/bookingModels");
const { paymentQuery } = require("../model/paymentModel");
const { detailRoomQuery } = require("../model/publicModel");

function toMinutes(timeStr) {
    if (timeStr instanceof Date) {
        return timeStr.getHours() * 60 + timeStr.getMinutes();
    }
    // Kalau string "HH:MM:SS"
    const [h, m, s] = timeStr.split(":");
    return parseInt(h) * 60 + parseInt(m);
}

async function listBookingByUserController(req, res) {
    const { userId } = req.params;

    try {
        const result = await listBookingByUser(userId);

        if (!result) {
            res.status(404).json({ status: 404, message: "History booking clear" })
        }

        res.status(200).json({ status: 200, message: "Success", data: result })
    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}


// Buat booking baru
async function createBooking(req, res) {
    const { userId, roomId, paymentMethod, date, start_time, end_time, total_price } = req.body;

    if (!userId || !paymentMethod || !roomId || !date || !start_time || !end_time || !total_price) {
        return res.status(400).json({ status: 400, message: "Missing required fields" });
    }

    try {
        // Cek apakah bentrok dengan booking lain
        const overlaps = await checkBookingOverlapQuery(roomId, date, start_time, end_time);
        if (overlaps.length > 0) {
            return res.status(409).json({ status: 409, message: "Time slot already booked" });
        }


        const [room] = await detailRoomQuery(roomId);

        const duration = (toMinutes(end_time) - toMinutes(start_time)) / 60;
        const totalPrice = room[0].hourly_price * duration;

        // Validasi uang
        if (total_price < totalPrice) {
            return res.status(400).json({
                status: 400,
                message: "Insufficient payment",
                required: totalPrice,
                received: total_price
            });
        }



        // Simpan booking
        const bookingId = await createBookingQuery(userId, roomId, date, start_time, end_time, total_price);

        const paymentRes = await paymentQuery(bookingId, paymentMethod);

        const newBooking = await getBookingByIdQuery(bookingId);

        res.status(201).json({
            status: 201,
            message: "Booking created successfully",
            data: newBooking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: error.message });
    }
}

module.exports = { createBooking, listBookingByUserController };
