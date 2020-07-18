const { createLogger, format, transports } = require('winston');
const {Loggly} = require('winston-loggly-bulk');

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.printf(data => `[${data.timestamp}] (${data.level}): ${data.message}`)
  ),
  defaultMeta: { service: "UNQfy Logging" },
  transports: [
    new transports.File({ filename: `${__dirname}/logs/unqfy-errors.log`, level: "error" }),
    new transports.File({ filename: `${__dirname}/logs/unqfy-combined.log`, level: "debug" }),
    new Loggly({
      token: "2da4987c-7157-44d1-b950-af69ca36c68f",
      subdomain: "fedecame",
      tags: ["Unqfy-Winston-NodeJS"],
      json: true
    })
  ],
});

module.exports = logger;