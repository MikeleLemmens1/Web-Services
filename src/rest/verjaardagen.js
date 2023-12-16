const Router = require('@koa/router');
const verjaardagenService = require('../service/verjaardagen');
//TODO Documentatie aanvullen

const getAllVerjaardagen = async (ctx) => {
  ctx.body = await verjaardagenService.getAllVerjaardagen();
};

const getVerjaardagenByGezin_id = async (ctx) => {
  ctx.body = await verjaardagenService.getVerjaardagenByGezinsId(Number(ctx.params.id));
};

const createVerjaardag = async (ctx) => {
  const nieuweverjaardag = await verjaardagenService.createVerjaardag({
    ...ctx.request.body,
    dagnummer: Number(ctx.request.body.dagnummer),
    maandnummer: Number(ctx.request.body.maandnummer),
    gezin_id: Number(ctx.request.body.gezin_id)

  });  
  ctx.status = 201;
  ctx.body = nieuweverjaardag; 
};

const updateVerjaardag = async (ctx) => {
  ctx.body = await verjaardagenService.updateVerjaardagById(Number(ctx.params.id), {
    ...ctx.request.body,
    dagnummer: Number(ctx.request.body.dagnummer),
    maandnummer: Number(ctx.request.body.maandnummer),
    gezin_id: Number(ctx.request.body.gezin_id)
  });
};

const deleteVerjaardag = async (ctx) => {
  await verjaardagenService.deleteVerjaardagById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Installeer verjaardag routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/verjaardagen',
  });

  router.get('/', getAllVerjaardagen);
  router.post('/', createVerjaardag);
  router.get('/:id', getVerjaardagenByGezin_id);
  router.put('/:id', updateVerjaardag);
  router.delete('/:id', deleteVerjaardag);

  app.use(router.routes())
     .use(router.allowedMethods());
};