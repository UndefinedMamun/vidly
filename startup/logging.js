const { logger } = require('../middleware/error');
require('express-async-errors');

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        logger.log('info', ex.message, ex);
        process.exit(1);
    })

    process.on('unhandledRejection', (ex) => {
        logger.log('info', ex.message, ex)
        process.exit(1);
    })
}