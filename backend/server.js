require('dotenv').config(); // Load environment variables
const express = require('express');
const pino = require('pino');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 5000;
const logger = pino();

const initDatabase = require('./config/initDb');
const dbRoutes = require('./routes/dbRoutes');

// Middleware to parse JSON
app.use(express.json());

// use db routes
app.use('/api/db', dbRoutes);

// Basic Routing
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


app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route is not found' });
});

// Global Exception Handling Middleware
app.use(errorHandler);




const startServer = async () => {
    try {
       
        await initDatabase(); 

        // Start Server
        app.listen(port, (err) => {
            if (err) {
                logger.error(`Error starting server: ${err.message}`);
                process.exit(1); // Stop the server if there's an error
            }
            logger.info(`Server is up and running on port ${port}`);
        });
    } catch (err) {
        
        logger.error(`Failed to start server due to database error: ${err.message}`);
        process.exit(1); 
    }
};

startServer();