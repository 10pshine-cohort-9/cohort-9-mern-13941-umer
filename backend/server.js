require('dotenv').config(); // Load environment variables
const express = require('express');
const pino = require('pino');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 5000;
const logger = pino();

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/api/status', (req, res) => {
    logger.info('Status check route accessed');
    res.status(200).json({
        success: true,
        message: 'The Notes App Backend API is running.'
    });
});

// Route for testing Global Exception Handling
app.get('/api/test-error', (req, res, next) => {
    const error = new Error('This is a checking error to test Pino logging!');
    error.statusCode = 400;
    next(error); // This will be caught by the global error handler
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'API route is not found' });
});

// Global Exception Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    logger.info(`Server is up and running on port ${port}`);
});