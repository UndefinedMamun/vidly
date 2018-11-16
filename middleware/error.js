const winston = require('winston');
// require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logger.log' })
    ]
});

// logger.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'info' }))

function err(err, req, res, next) {
    logger.log('info', err.message, err);
    res.status(500).send('Something went worng.');
}



module.exports = { logger, err };