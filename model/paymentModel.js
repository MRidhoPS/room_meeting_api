const db = require('../database/db');

async function paymentQuery(bookingId, paymentMethod) {
    const [result] = await db.execute(
        `INSERT INTO payments (booking_id, status, payment_method ,paid_at, created_at, updated_at)
        VALUES (?, 'unpaid', ? ,NOW(), NOW(), NOW())
        `, [bookingId, paymentMethod]
    );

    return result.insertId;
}

async function paymentBookingQuery(params) {
    
}

module.exports = { paymentQuery };