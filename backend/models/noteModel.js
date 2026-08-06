const pool = require('../config/db');

const addNote = async (userId, title, content) => {
    try {
        const q = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
        const [rows] = await pool.execute(q, [userId, title, content]);
        return rows.insertId;
    } 
    catch (err) {
        throw err;
    }
};

const getUserNotes = async (userId) => {
    try {
        const q = 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await pool.execute(q, [userId]);
        return rows;
    } 
    catch (err) {
        throw err;
    }
};

const editNote = async (noteId, userId, title, content) => {
    try {
        const q = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?';
        const [result] = await pool.execute(q, [title, content, noteId, userId]);
        return result.affectedRows;
    } 
    catch (err) {
        throw err;
    }
};

const removeNote = async (noteId, userId) => {
    try {
        const q = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
        const [result] = await pool.execute(q, [noteId, userId]);
        return result.affectedRows;
    } 
    catch (err) {
        throw err;
    }
};

module.exports = {
    addNote,
    getUserNotes,
    editNote,
    removeNote
};