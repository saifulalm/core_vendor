// logger.js
const fs = require('fs');
const path = require('path');

// Function to get the current date formatted as YYYY-MM-DD
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to log text to a file with a date-based name
function logToLogFile(text, customLogPath) {
    const logFileName = `log_${getFormattedDate()}.log`;
    const logDirectory = customLogPath || path.join(__dirname, 'logs');
    const logFilePath = path.join(logDirectory, logFileName);

    // Check if the log directory exists, create it if not
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }

    const formattedDate = new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false
    });

    const logEntry = `[${formattedDate}] ${text}\n`;


    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}

module.exports = {
    logToLogFile,
};
