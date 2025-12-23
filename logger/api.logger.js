const pino = require('pino');
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logfile.log');
const logFile = fs.createWriteStream(logFilePath);
const logger = pino({ level: 'info' }, logFile);


class APILogger {
    info(message) {
        logger.info(message);
    }

    infoWithObject(message, data) {
        logger.info(`${message}   ${undefined != data ? JSON.stringify(data) : ''}`);
    }

    error(message) {
        logger.error(message);
    }
}

module.exports = new APILogger();
