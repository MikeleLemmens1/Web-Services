// index.js
const Koa = require('koa');
const app = new Koa();
const winston = require('winston');
const config = require('config');

const NODE_ENV = config.get("env")
const LOG_LEVEL = config.get("logging.level");
const LOG_DISABLED = config.get("logging.disabled");
const HOST_PORT = config.get("host.port");

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  defaultMeta: { service: 'gezinsplanner API' },
  transports: [
    new winston.transports.Console({silent:LOG_DISABLED}),
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info(`environment ${NODE_ENV}, ${LOG_LEVEL} level, disabled ${LOG_DISABLED}`);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

app.listen(HOST_PORT,() => logger.info('server is running on http://localhost:9000'))
