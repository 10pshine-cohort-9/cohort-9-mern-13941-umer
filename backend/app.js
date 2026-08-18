//shifting things from server.js for smoooth srver rrunning and testing

require('dotenv').config();
const express = require('express');
const pino = require('pino');
const errorHandler = require('./middlewares/errorHandler');

const dbRoutes = require('./routes/dbRoutes');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const logger = pino();

app.use(express.json());

app.use('/api/db', dbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

app.get('/api/status', (req, res) => {
    logger.info('Status check route accessed');
    res.status(200).json({
        success: true,
        message: 'Notes App Backend API is running..'
    });
});

app.get('/api/test-error', (req, res, next) => {
    const error = new Error('Checking Error to test Pinoo Logger!');
    error.statusCode = 400;
    next(error);
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route is not found' });
});

app.use(errorHandler);

module.exports = app;