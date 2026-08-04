const app = require('./app');
const pino = require('pino');
const initDatabase = require('./config/initDb');

const port = process.env.PORT || 5000;
const logger = pino();

const startServer = async () => {
    try {
        await initDatabase(); 

        app.listen(port, (err) => {
            if (err) {
                logger.error(`Error starting server: ${err.message}`);
                process.exit(1);
            }
            logger.info(`Server is onn and running on port ${port}`);
        });

    } 
    
    catch (err) {
        logger.error(`Failed to start the server due to database error: ${err.message}`);
        process.exit(1); 
    }
};

startServer();