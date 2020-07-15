// const Log = require('./log');
// const LogglyHelper = require('./external api helpers/logglyHelper');
const { createLogger, format, transports } = require('winston');
// const {Loggly} = require('winston-loggly-bulk');

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    // format.errors({ stack: true }),
    // format.json(),
    format.printf(data => `[${data.timestamp}] (${data.level}): ${data.message}`)
  ),
  defaultMeta: { service: "UNQfy Logging" },
  transports: [
    new transports.File({ filename: `${__dirname}/logs/unqfy-errors.log`, level: "error" }),
    new transports.File({ filename: `${__dirname}/logs/unqfy-combined.log`, level: "debug" }),
  ],
});

module.exports = logger;