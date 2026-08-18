const noteModel = require('../models/noteModel');
const { getIo } = require('../socket');
const pino = require('pino');
const logger = pino();

const create = async (req, res, next) => {
    try {
        const body = req.body ?? {};
        const title = body.title;
        const content = body.content;
        const userId = req.user.id;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'A valid title is required' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'A valid content is required' });
        }

        const newId = await noteModel.addNote(userId, title, content);
        
        const io = getIo();
        if (io) {
            io.to(`user_${userId}`).emit('notesChanged');
        }

        logger.info({ userId, noteId: newId }, 'New note created');
        res.status(201).json({ message: 'Note added', noteId: newId });

    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const rawSearch = req.query.search;
        if (rawSearch !== undefined && typeof rawSearch !== 'string') {
            return res.status(400).json({ message: 'Search query must be a string' });
        }
        const search = rawSearch || '';
        const myNotes = await noteModel.getUserNotes(userId, search);
        
        res.status(200).json(myNotes);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const body = req.body ?? {};
        const title = body.title;
        const content = body.content;
        const userId = req.user.id;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'A valid title is required' });
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'A valid content is required' });
        }

        const updated = await noteModel.editNote(noteId, userId, title, content);

        if (updated === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const io = getIo();
        if (io) {
            io.to(`user_${userId}`).emit('notesChanged');
        }

        logger.info({ userId, noteId }, 'Note updated');
        res.status(200).json({ message: 'Note updated' });
    } catch (err) {
        next(err);
    }
};

const deleteData = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        const deleted = await noteModel.removeNote(noteId, userId);

        if (deleted === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const io = getIo();
        if (io) {
            io.to(`user_${userId}`).emit('notesChanged');
        }

        logger.info({ userId, noteId }, 'Note deleted');
        res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
        next(err);
    }
};

const exportNotes = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notes = await noteModel.getUserNotes(userId, '');
        res.status(200).json(notes);
    } catch (err) {
        next(err);
    }
};

const importNotes = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notes = req.body.notes;

        if (!Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({ message: 'Invalid notes array' });
        }

        const importedCount = await noteModel.bulkAddNotes(userId, notes);

        const io = getIo();
        if (io) {
            io.to(`user_${userId}`).emit('notesChanged');
        }

        logger.info({ userId, count: importedCount }, 'Notes imported');
        res.status(200).json({ message: 'Notes imported successfully', count: importedCount });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    create, getAll, update, deleteData, exportNotes, importNotes
};