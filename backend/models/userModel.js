const pool = require('../config/db');


// find by email
const findUserByEmail = async (email) => {
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(sql, [email]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};


// insert user
const createUser = async (name, email, password) => {
    try {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await pool.execute(sql, [name, email, password]);
        return result;
    } catch (err) {
        throw err;
    }
};


module.exports = { createUser, findUserByEmail };