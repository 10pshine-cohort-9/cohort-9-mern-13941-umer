const pool = require('../config/db');

const addNote = async (userId, title, content) => {
    const q = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
    const [rows] = await pool.execute(q, [userId, title, content]);
    return rows.insertId;
};


const getUserNotes = async (userId) => {
    const q = 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await pool.execute(q, [userId]);
    return rows;
};


const editNote = async (noteId, userId, title, content) => {
    const q = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(q, [title, content, noteId, userId]);
    return result.affectedRows;
};


const removeNote = async (noteId, userId) => {
    const q = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(q, [noteId, userId]);
    return result.affectedRows;
};


module.exports = {
    addNote,
    getUserNotes,
    editNote,
    removeNote
};