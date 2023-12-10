const Router = require('@koa/router');
const gezinService = require('../service/gezinnen');


const getAllGezinnen = async (ctx) => {
  ctx.body = await gezinService.getAllGezinnen();
}

const getGezinById = async (ctx) => {
  ctx.body = await gezinService.getByGezinsId(Number(ctx.params.id)); // 👈 2
};
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

const updateGezinById = async (ctx) => {
  ctx.body = await gezinService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinsId: Number(ctx.request.body.gezinsId),
    huisnummer: Number(ctx.request.body.huisnummer),
    postcode: Number(ctx.request.body.postcode),
  });
};

const deleteGezinById = async (ctx) => {
  await gezinService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Installeer gezinsleden routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinnen',
  });
  router.get('/', getAllGezinnen);
  router.post('/', createGezin);
  router.get('/:id', getGezinById);
  router.put('/:id', updateGezinById);
  router.delete('/:id', deleteGezinById);

  app.use(router.routes())
     .use(router.allowedMethods());
};