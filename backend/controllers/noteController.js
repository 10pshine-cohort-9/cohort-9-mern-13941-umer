const noteModel = require('../models/noteModel');
const pino = require('pino');
const logger = pino();

const create = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newId = await noteModel.addNote(userId, title, content);
        
        logger.info({ userId, noteId: newId }, 'New note created');
        res.status(201).json({ message: 'Note added', noteId: newId });

    } 
    catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const myNotes = await noteModel.getUserNotes(userId);
        
        res.status(200).json(myNotes);
    } 
    catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const title = req.body.title;
        const content = req.body.content;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const updated = await noteModel.editNote(noteId, userId, title, content);

        if (updated === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        logger.info({ userId, noteId }, 'Note updated');
        res.status(200).json({ message: 'Note updated' });
    } 
    catch (err) {
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

        logger.info({ userId, noteId }, 'Note deleted');
        res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    create,getAll,update,deleteData
};