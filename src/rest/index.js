const Router = require('@koa/router');
const installGeplandeTakenRouter = require('./geplande_taken');
const { install: installGezinsledenRouter } = require('./gezinsleden');
const installBoodschappenRouter = require('./boodschappen');
const installGezinnenRouter = require('./gezinnen');
const installVerjaardagenRouter = require('./verjaardagen');
const installHealthRouter = require('./health')

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installGeplandeTakenRouter(router);
  installGezinsledenRouter(router);
  installGezinnenRouter(router);
  installBoodschappenRouter(router);
  installVerjaardagenRouter(router);
  installHealthRouter(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};