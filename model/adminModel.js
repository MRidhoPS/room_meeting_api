const db = require('../database/db');

async function checkingRoomQuery(id) {
    const [existing] = await db.query('SELECT * FROM meeting_rooms WHERE id = ?', [id]);

    if (existing.length === 0) {
        throw new Error('Meeting room tidak ditemukan');
    }

    return existing[0];
}

async function addRoomQuery({ name, admin_id, capacity, hourly_price, description, thumbnail_photo }) {
    const result = await db.query('INSERT INTO meeting_rooms (name, admin_id, capacity, hourly_price, description, thumbnail_photo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())', [name, admin_id ,capacity, hourly_price, description, thumbnail_photo]);

    console.log(result);

    return result;
}

async function editRoomQuery(id, data) {

    await checkingRoomQuery(id);

    const { name, capacity, hourly_price, description } = data;

    const [result] = await db.query(
        `UPDATE meeting_rooms 
     SET name = ?, capacity = ?, hourly_price = ?, description = ?, updated_at = NOW()
     WHERE id = ?`,
        [name, capacity, hourly_price, description, id]
    );

    return result;
}

async function deleteRoomQuery(id) {
    await checkingRoomQuery(id);

    const result = await db.query('DELETE FROM meeting_rooms WHERE id = ?', [id])

    return result;
}

async function addFacilitiesQuery(roomId, facilities) {
    const values = facilities.map(facility => [roomId, facility]);

    const [result] = await db.query(
        `INSERT INTO room_facilities (room_id, facility_name) VALUES ?`,
        [values]
    );

    return result;
}

async function photoRoomQuery(roomId, photoUrl) {
    const values = photoUrl.map(photo => [roomId, photo]);

    const [result] = await db.query(`INSERT INTO room_photos (room_id, photo_url) VALUES ?`, [values]);

    return result;
}


module.exports = { addRoomQuery, editRoomQuery, deleteRoomQuery, addFacilitiesQuery, photoRoomQuery }