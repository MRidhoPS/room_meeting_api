const db = require('../database/db');

async function createBookingQuery(userId, roomId, date, start_time, end_time, total_price) {
    const [result] = await db.execute(
        `INSERT INTO bookings (user_id, room_id, date, start_time, end_time, status, total_price, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW(), NOW())`,
        [userId, roomId, date, start_time, end_time, total_price]
    );

    console.log(result.insertId);
    return result.insertId;
}

async function getBookingByIdQuery(bookingId) {
    const [rows] = await db.execute(
        `SELECT * FROM bookings WHERE id = ?`,
        [bookingId]
    );
    return rows[0];
}

async function checkBookingOverlapQuery(roomId, date, start_time, end_time) {
    const [rows] = await db.execute(
        `SELECT * FROM bookings
         WHERE room_id = ?
           AND date = ?
           AND status IN ('pending', 'approved')
           AND (
                (start_time < ? AND end_time > ?) OR
                (start_time < ? AND end_time > ?) OR
                (start_time >= ? AND end_time <= ?)
           )`,
        [roomId, date, end_time, end_time, start_time, start_time, start_time, end_time]
    );
    return rows;
}

async function listBookingByUser(userId) {
    const [row] = await db.execute(
        `select
            b.id,
            b.room_id,
            mr.name,
            DATE(b.date) AS date,
            b.start_time,
            b.end_time,
            b.status,
            b.total_price,
            mr.thumbnail_photo,
            b.created_at
            from bookings b
            join meeting_rooms mr
            on b.room_id = mr.id
            where user_id = ?
            ORDER BY b.id desc
            ;`, [userId]
    );

    return row;
}

module.exports = { createBookingQuery, getBookingByIdQuery, checkBookingOverlapQuery, listBookingByUser };