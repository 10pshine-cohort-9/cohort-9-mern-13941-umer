// require logger
const logger = require('../utils/logger');

// global error middleware
const errorHandler = (err, req, res, next) => {
    // log error
    logger.error(err.message);
    // send response
    res.status(500).json({ error: err.message || 'server error' });
};

// export handler
module.exports = errorHandler;