// index.js
const Koa = require('koa');
const app = new Koa();
const winston = require('winston');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const router = new Router();

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

app.use(bodyParser());

app.use(async (ctx, next) => {
  //logger.info(JSON.stringify(ctx.request));
  //logger.info(JSON.stringify(ctx.request.body)); // 👈 3
  if (ctx.request.method === 'GET' && 
  ctx.request.url === '/api/transactions') {
    ctx.body = 'To implement';
  } else {
    ctx.body = 'Goodbye world';
  }
  return next();
});

app.listen(9000, () => {
  logger.info('🚀 Server listening on http://localhost:9000');
});

router.get('/api/transactions', async (ctx) => {
  ctx.body = transactionService.getAll();
});

router.post('/api/transactions', async (ctx) => { // 👈 1
  const newTransaction = transactionService.create({
    ...ctx.request.body, // 👈 2
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction; // 👈 3
});

app.use(router.routes())
   .use(router.allowedMethods());