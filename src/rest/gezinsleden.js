const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')

const getAllGezinsleden = async (ctx) => {
  ctx.body = await gezinsledenService.getAllGezinsleden();
}
const getGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.getGezinslidById(Number(ctx.params.id));
};

const createGezinslid = async (ctx) => {
  const newGezinslid = await gezinsledenService.createGezinslid({
    voornaam: ctx.request.body.naam,
    email: ctx.request.body.email,
    wachtwoord: ctx.request.body.wachtwoord,
    gezinsId: Number(ctx.request.body.gezinsId),
    verjaardagsId: Number(ctx.request.body.verjaardagsId)
  });
  ctx.body = newGezinslid;
  ctx.status = 201;
};

const updateGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.updateGezinslidById(Number(ctx.params.id),{
    ...ctx.request.body,
    gezinsId: Number(ctx.request.body.gezinsId),
    verjaardagsId: Number(ctx.request.body.verjaardagsId),
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