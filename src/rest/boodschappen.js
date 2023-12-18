const Router = require('@koa/router');
const boodschappenService = require('../service/boodschappen');
//TODO Documentatie aanvullen

const getAllBoodschappen = async (ctx) => {
  if (ctx.query.winkel){
    let id = Number(ctx.query.gezin_id);
    let winkel = ctx.query.winkel;
    ctx.body = await boodschappenService.getAllByWinkel(id,winkel);
  }
  else if (ctx.query.gezin_id){
    ctx.body = await boodschappenService.getAllByGezinsId(Number(ctx.request.body.gezin_id));
  }
  else
    ctx.body = await boodschappenService.getAll();
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
    gezin_id: Number(ctx.request.body.gezin_id)
  });  
  ctx.status = 201;
  ctx.body = nieuweBoodschap; 
};

const updateBoodschap = async (ctx) => {
  ctx.body = await boodschappenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id),
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