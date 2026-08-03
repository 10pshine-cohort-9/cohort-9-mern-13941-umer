const logger = require('pino')();

// ---------global error middleware--------

const errorHandler = (err, req, res, next) => {

    logger.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
};

// export handler
module.exports = errorHandler;