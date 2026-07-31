const logger = require('pino')();

// global error middleware
const errorHandler = (err, req, res, next) => {
    // log error
    logger.error(err.message);
    // send response
    res.status(500).json({ error: 'Internal Server Error' });
};

// export handler
module.exports = errorHandler;