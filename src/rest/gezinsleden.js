const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')

const getAllGezinsleden = async (ctx) => {
  ctx.body = await gezinsledenService.getAllGezinsleden();
}
const getGezinslidById = async (ctx) => {
  // ctx.body = await gezinsledenService.getGezinslidById(Number(ctx.params.id));
  ctx.body = await gezinsledenService.getAllGezinsledenByGezinsId(Number(ctx.params.id));
};

const createGezinslid = async (ctx) => {
  const newGezinslid = await gezinsledenService.createGezinslid({
    voornaam: ctx.request.body.voornaam,
    email: ctx.request.body.email,
    wachtwoord: ctx.request.body.wachtwoord,
    gezin_id: Number(ctx.request.body.gezin_id),
    verjaardag_id: Number(ctx.request.body.verjaardag_id)
  });
  ctx.body = newGezinslid;
  ctx.status = 201;
};

const updateGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.updateGezinslidById(Number(ctx.params.id),{
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id),
    verjaardag_id: Number(ctx.request.body.verjaardag_id),
  });
};

const deleteGezinslidById = async (ctx) => {
  await gezinsledenService.deleteGezinslidById(Number(ctx.params.id));
  ctx.status = 204;
};


/**
 * Installeer gezinsleden routes in de gegeven router
 * 
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinsleden'
  });
  router.get('/',getAllGezinsleden);
  router.get('/:id',getGezinslidById);
  router.post('/',createGezinslid);
  router.put('/:id', updateGezinslidById);
  router.delete('/:id', deleteGezinslidById);

  app.use(router.routes())
     .use(router.allowedMethods())
}