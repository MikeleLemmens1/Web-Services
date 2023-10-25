// index.js
const Koa = require('koa');
const { initializeLogger, getLogger } = require('./core/logging');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const installRest = require('./rest'); // 👈 2
const app = new Koa();

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('logging.level'); 
const LOG_DISABLED = config.get("logging.disabled");
const HOST_PORT = config.get("host.port");

initializeLogger({
  level: LOG_LEVEL,
  disabled: LOG_DISABLED,
  defaultMeta: {
    NODE_ENV,
  },
});

app.use(bodyParser());
installRest(app);

app.listen(HOST_PORT, () => {
  getLogger().info(`🚀 Server listening on http://localhost:${HOST_PORT}`)
});