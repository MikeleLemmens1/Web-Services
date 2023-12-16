const Router = require('@koa/router');
const installGeplandeTakenRouter = require('./geplande_taken');
const installGezinsledenRouter = require('./gezinsleden');
const installBoodschappenRouter = require('./boodschappen');
const installGezinnenRouter = require('./gezinnen');
const installVerjaardagenRouter = require('./verjaardagen');

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

  app.use(router.routes())
     .use(router.allowedMethods());
};