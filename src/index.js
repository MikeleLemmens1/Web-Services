// index.js
const Koa = require('koa');
const app = new Koa();
const winston = require('winston');
const config = require('config');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level'); 
const LOG_DISABLED = config.get("logging.disabled");
const HOST_PORT = config.get("host.port");

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`); 

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  defaultMeta: { service: 'gezinsplanner API' },
  transports: [
    new winston.transports.Console({silent:LOG_DISABLED}),
  
  ],
});

logger.info(`environment ${NODE_ENV}, ${LOG_LEVEL} level, disabled ${LOG_DISABLED}`);


app.listen(HOST_PORT,() => logger.info('server is running on http://localhost:9000'))

app.use(async (ctx, next) => {
  logger.info(JSON.stringify(ctx.request));
  return next();
});

app.listen(9000, () => {
  logger.info('🚀 Server listening on http://localhost:9000');
});