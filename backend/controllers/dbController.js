const pool = require('../config/db');

// checking db status
const checkDbStatus = async (req, res) => {
    try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'db is connected' });
    } catch (err) {

        res.status(500).json({ status: 'db connection failed', error: 'Internal Server Error' });
    }
};

module.exports = { checkDbStatus };