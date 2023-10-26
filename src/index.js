
const Koa = require('koa');
const { initializeLogger, getLogger } = require('./core/logging');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const installRest = require('./rest');
const app = new Koa();
const koaCors = require('@koa/cors');
const { initializeData } = require('./data');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level'); 
const LOG_DISABLED = config.get("logging.disabled");
const HOST_PORT = config.get("host.port");
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

async function main(){  
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });

  await initializeData();

  app.use(
    koaCors({
      origin: (ctx) => { // 👈 4
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0];
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'], // 👈 5
      maxAge: CORS_MAX_AGE, // 👈 6
    })
  );

  app.use(bodyParser());
  installRest(app);

  app.listen(HOST_PORT, () => {
    getLogger().info(`🚀 Server listening on http://localhost:${HOST_PORT}`)
  });
}
main();