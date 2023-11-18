const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')

const getAllGezinsleden = async (ctx) => {
  ctx.body = gezinsledenService.getAllGezinsleden();
}
const getGezinslidByID = async (ctx) => {
  ctx.body = gezinsledenService.getGezinslidByID(Number(ctx.params.id));
};

const updateGezinslidByID = async (ctx) => {
  //TODO
};

const deleteGezinslidByID = async (ctx) => {
  ctx.body = gezinsledenService.deleteGezinslidByID(Number(ctx.params.id));
};

const createGezinslid = async (ctx) => {
  const newGezinslid = gezinsledenService.createGezinslid({
    voornaam: ctx.request.body.naam,
    email: ctx.request.body.email,
    wachtwoord: ctx.request.body.wachtwoord,
    gezinsId: Number(ctx.request.body.gezinsId),
    verjaardagsId: Number(ctx.request.body.verjaardagsId)
  });
  ctx.body = newGezinslid;
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinsleden'
  });
  router.get('/',getAllGezinsleden);
  router.get('/:id',getGezinslidByID);
  router.post('/',createGezinslid);
  router.put('/:id', updateGezinslidByID);
  router.delete('/:id', deleteGezinslidByID);

  app.use(router.routes())
     .use(router.allowedMethods())
}