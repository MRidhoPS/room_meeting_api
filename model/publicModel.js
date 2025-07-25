const db = require('../database/db');

async function listRoomQuery() {
    const result = await db.query("select mr.id, mr.name, mr.capacity, mr.hourly_price, mr.thumbnail_photo from meeting_rooms as mr")

    return result[0];
}

async function detailRoomQuery(id) {

    const result = await db.query("select mr.id, mr.name, mr.capacity, mr.hourly_price, mr.description ,rp.photo_url, rf.facility_name from meeting_rooms as mr left join room_photos as rp on mr.id = rp.room_id left join room_facilities as rf on mr.id = rf.room_id where mr.id = ?", [id]
    )

    return result;
    
}

module.exports = { listRoomQuery, detailRoomQuery }