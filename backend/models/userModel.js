const pool = require('../config/db');


// find by email
const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
};


// insert user
const createUser = async (name, email, hashedPassword) => {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [name, email, hashedPassword]);
    return result;
};


module.exports = { createUser, findUserByEmail };