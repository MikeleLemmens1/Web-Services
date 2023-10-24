// index.js
const Koa = require('koa');
const winston = require('winston');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const router = new Router();
const app = new Koa();

const geplandeTakenService = require('./service/geplandeTaak');

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

app.listen(9000, () => {
  logger.info('🚀 Server listening on http://localhost:9000');
});

router.get('/api/geplande_taken', async (ctx) => {
  ctx.body = geplandeTakenService.getAll();
  logger.info(ctx.body)
});

router.post('/api/geplande_taken', async (ctx) => { 
  
  // 👈 1
  const newTask = geplandeTakenService.create({
    naam: ctx.request.body.naam,
    dag: Date(ctx.request.body.dag),
    gezinslidId: Number(ctx.request.body.gezinslidId)

  });
  ctx.body = newTask; // 👈 3
});

app.use(router.routes())
   .use(router.allowedMethods());