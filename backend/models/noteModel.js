const pool = require('../config/db');

// fetch user notes
const getAllNotes = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM notes WHERE user_id = ?', [userId]);
    return rows;
};

module.exports = { getAllNotes };