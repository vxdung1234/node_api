const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logEvents = async (message, fileName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
    const logItem = `${uuid()}\t${dateTime}\t${message}\n`;
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        if(!fs.existsSync(logsDir)) {
            await fsPromise.mkdir(logsDir);
        }
        await fsPromise.appendFile(path.join(logsDir, fileName), logItem);
    } catch(e) {
        console.log(e)
    }
}

const reqLogger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requestLogs.txt');
    next();
};

const errLogger = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errorLogs.txt');
    next();
};

module.exports = { reqLogger, errLogger };