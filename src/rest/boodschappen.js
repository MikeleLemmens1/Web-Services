const Router = require('@koa/router');
const boodschappenService = require('../service/boodschappen');
const Joi = require('joi');
const validate = require('../core/validation');

const getAllBoodschappen = async (ctx) => {
  if (ctx.request.query.winkel){
    let id = Number(ctx.query.gezin_id);
    let winkel = ctx.query.winkel;
    ctx.body = await boodschappenService.getAllByWinkel(id,winkel);
  }
  else if (ctx.query.gezin_id){
    ctx.body = await boodschappenService.getAllByGezinsId(Number(ctx.request.query.gezin_id));
  }
  else
    ctx.body = await boodschappenService.getAll();
};
getAllBoodschappen.validationScheme = {
  query: {
    winkel: Joi.string().max(255).optional(),
    gezin_id: Joi.number().integer().positive().optional(),
  },
};

const getBoodschapById = async (ctx) => {
  ctx.body = await boodschappenService.getById(Number(ctx.params.id));
};

getBoodschapById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createBoodschap = async (ctx) => {
  const nieuweBoodschap = await boodschappenService.create({
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id)
  });  
  ctx.status = 201;
  ctx.body = nieuweBoodschap; 
};

createBoodschap.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    winkel: Joi.string().max(255).optional(),
    hoeveelheid: Joi.string().max(255).optional(),
    gezin_id: Joi.number().integer().positive(),
  },
};

const updateBoodschap = async (ctx) => {
  ctx.body = await boodschappenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id),
  });
};

updateBoodschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().max(255),
    winkel: Joi.string().max(255).optional(),
    hoeveelheid: Joi.string().max(255).optional(),
    gezin_id: Joi.number().integer().positive(),
  },
};

const deleteBoodschap = async (ctx) => {
  await boodschappenService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteBoodschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
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

  router.get(
    '/',
    validate(getAllBoodschappen.validationScheme),
    getAllBoodschappen
  );

  router.post(
    '/',  
  validate(createBoodschap.validationScheme),
  createBoodschap
  );

  router.get(
    '/:id',
  validate(getBoodschapById.validationScheme),
  getBoodschapById
  );

  router.put(
    '/:id',
  validate(updateBoodschap.validationScheme),
  updateBoodschap
  );

  router.delete(
    '/:id',
  validate(deleteBoodschap.validationScheme),
  deleteBoodschap
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};