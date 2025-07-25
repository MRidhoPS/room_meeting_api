const db = require('../database/db');

async function findUserByEmail(email) {

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function signupQuery({ name, email, password, role = 'customer' }) {
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name, email, password, role]
    );
    return result.insertId;
}

async function signupAdminQuery({ name, email, password, role = 'admin' }) {
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name, email, password, role]
    );
    return result.insertId;
}

async function loginQuery({ email }) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('HASIL QUERY:', rows);

    return rows[0];
}


module.exports = {
    findUserByEmail,
    signupQuery,
    signupAdminQuery,
    loginQuery
};