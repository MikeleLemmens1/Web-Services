const Router = require('@koa/router');
const gezinService = require('../service/gezin');

const createGezin = async (ctx) => {
  const newGezin = gezinService.createGezin({
    familienaam: ctx.request.body.familienaam,
    straat: ctx.request.body.straat,
    stad: ctx.request.body.stad,
    huisnummer: Number(ctx.request.body.huisnummer),
    postcode: Number(ctx.request.body.postcode),
  });
  ctx.status = 201;
  ctx.body = newGezin; 
};

const getGezinById = async (ctx) => {
  ctx.body = await gezinService.getByGezinsId(Number(ctx.params.id)); // 👈 2
};


const updateGezin = async (ctx) => {
  ctx.body = await gezinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinsId: Number(ctx.request.body.gezinsId),
    huisnummer: new Number(ctx.request.body.huisnummer),
    postcode: new Number(ctx.request.body.postcode),
  });
};

const deleteGezin = async (ctx) => {
  ctx.body = await gezinService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezin',
  });

  router.post('/', createGezin);
  router.get('/:id', getGezinById);
  router.put('/:id', updateGezin);
  router.delete('/:id', deleteGezin);

  app.use(router.routes())
     .use(router.allowedMethods());
};