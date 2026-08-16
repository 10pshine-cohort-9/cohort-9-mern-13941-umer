const pool = require('../config/db');

const addNote = async (userId, title, content) => {
    try {
        const q = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
        const [rows] = await pool.execute(q, [userId, title, content]);
        return rows.insertId;
    } catch (err) {
        throw err;
    }
};

const getUserNotes = async (userId, search = '') => {
    try {
        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            const q = 'SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC';
            const [rows] = await pool.execute(q, [userId, searchTerm, searchTerm]);
            return rows;
        }

        const q = 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await pool.execute(q, [userId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

const editNote = async (noteId, userId, title, content) => {
    try {
        const q = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?';
        const [result] = await pool.execute(q, [title, content, noteId, userId]);
        return result.affectedRows;
    } catch (err) {
        throw err;
    }
};

const removeNote = async (noteId, userId) => {
    try {
        const q = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
        const [result] = await pool.execute(q, [noteId, userId]);
        return result.affectedRows;
    } catch (err) {
        throw err;
    }
};

const bulkAddNotes = async (userId, notesArray) => {
    if (!Array.isArray(notesArray) || notesArray.length === 0) return 0;

    // Pehle validate karein taakay kharab data DB tak jaye hi na
    for (const item of notesArray) {
        if (!item || typeof item !== 'object' || typeof item.title !== 'string' || typeof item.content !== 'string' || item.title.trim() === '' || item.content.trim() === '') {
            throw new Error('Invalid note data format');
        }
    }

    const connection = await pool.getConnection(); // Transaction shuru
    try {
        await connection.beginTransaction();
        let count = 0;
        for (const item of notesArray) {
            const q = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
            await connection.execute(q, [userId, item.title, item.content]);
            count++;
        }
        await connection.commit(); 
        return count;
    } catch (err) {
        await connection.rollback(); 
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    addNote,
    getUserNotes,
    editNote,
    removeNote,
    bulkAddNotes
};