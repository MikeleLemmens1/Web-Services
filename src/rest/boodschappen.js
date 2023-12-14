const Router = require('@koa/router');
const boodschappenService = require('../service/boodschappen');
//TODO Documentatie aanvullen

const getAllBoodschappen = async (ctx) => {
  if (ctx.request.query.winkel){
    ctx.body = await boodschappenService.getAllByWinkel(Number(ctx.request.query.gezinsId,ctx.request.query.winkel));
  }
  else if (ctx.request.query.gezinsId){
    ctx.body = await boodschappenService.getAllByGezinsId(Number(ctx.request.query.gezinsId));
  }
  else
    ctx.body = await geplandeTakenService.getAll();
};

const getBoodschapById = async (ctx) => {
  ctx.body = await boodschappenService.getById(Number(ctx.params.id));
};

// getTransactionById.validationScheme = {
//   params: Joi.object({
//     id: Joi.number().integer().positive(),
//   }),


const createBoodschap = async (ctx) => {
  const nieuweBoodschap = await boodschappenService.create({
    ...ctx.request.body,
    gezinsId: Number(ctx.request.body.gezinsId)

  });  
  ctx.status = 201;
  ctx.body = nieuweBoodschap; 
};

const updateBoodschap = async (ctx) => {
  ctx.body = await boodschappenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinsId: Number(ctx.request.body.gezinsId),
  });
};

const deleteBoodschap = async (ctx) => {
  await boodschappenService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Installeer boodschappen routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/boodschappen',
  });

  router.get('/', getAllBoodschappen);
  router.post('/', createBoodschap);
  router.get('/:id', getBoodschapById);
  router.put('/:id', updateBoodschap);
  router.delete('/:id', deleteBoodschap);

  app.use(router.routes())
     .use(router.allowedMethods());
};