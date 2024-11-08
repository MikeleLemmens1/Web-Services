/**
 * Boodschap REST endpoints.
 * @module rest/boodschappen
 */
const Router = require('@koa/router');
const boodschappenService = require('../service/boodschappen');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

/**
* Get all boodschappen for a gezin and optionally for a given winkel
* GET gezinnen/:id/boodschappen
* GET gezinnen/:id/boodschappen?winkel={winkel}
*/
const getAllBoodschappen = async (ctx) => {
  if (ctx.query.winkel){
    ctx.body = await boodschappenService.getAllBoodschappenByWinkel(ctx.params.id,ctx.query.winkel);
    return;
  };
  ctx.body = await boodschappenService.getAllBoodschappenByGezinsId(ctx.params.id)
  
};

getAllBoodschappen.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  query: Joi.object({
    winkel: Joi.string().max(255).optional(),
  }), 
};

/**
* Get boodschap for a gezin by id
* GET gezinnen/:id/boodschappen/:boodschap_id
*/
const getBoodschapById = async (ctx) => {
  ctx.body = await boodschappenService.getBoodschapById(ctx.params.boodschap_id);
};

getBoodschapById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
    boodschap_id: Joi.number().integer().positive()

  }),
};

/**
* Create boodschap for a gezin
* POST gezinnen/:id/boodschappen
* Requires: {naam}
* Optional: {winkel, hoeveelheid}
*/
const createBoodschap = async (ctx) => {
  const nieuweBoodschap = await boodschappenService.createBoodschap({
    ...ctx.request.body,
    gezin_id: Number(ctx.params.id)
  });  
  ctx.status = 201;
  ctx.body = nieuweBoodschap; 
};

createBoodschap.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    winkel: Joi.string().max(255).optional(),
    hoeveelheid: Joi.string().max(255).optional(),
  },
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

/**
* Modify boodschap for a gezin by id
* PUT gezinnen/:id/boodschappen/:boodschap_id
* Requires: {naam}
* Optional: {winkel, hoeveelheid}
*/
const updateBoodschap = async (ctx) => {

  ctx.body = await boodschappenService.updateBoodschapById((ctx.params.boodschap_id), {
    ...ctx.request.body,
  });
};

updateBoodschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
    boodschap_id: Joi.number().integer().positive()
  },
  body: {
    naam: Joi.string().max(255),
    winkel: Joi.string().max(255).optional(),
    hoeveelheid: Joi.string().max(255).optional(),
  },
};

/**
* Delete boodschap for a gezin by id
* DELETE gezinnen/:id/boodschappen/:boodschap_id
*/
const deleteBoodschap = async (ctx) => {
  await boodschappenService.deleteBoodschapById(Number(ctx.params.boodschap_id));
  ctx.status = 204;
};
deleteBoodschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
    boodschap_id: Joi.number().integer().positive()
  },
};

/**
 * Checks the gezin the gezinslid (user) and boodschap belongs to
 * @param {object} ctx - The context that contains an id, boodschap_id and gezin_id
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authorisation is successful.
 */
const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id, boodschap_id } = ctx.params;
  let targetGezin_id;
  if(boodschap_id){
    const boodschap = await boodschappenService.getBoodschapById(boodschap_id);
    targetGezin_id = boodschap.gezin_id;
  }
  else targetGezin_id = id;

  if (targetGezin_id !== gezin_id && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to operate on this family's information.",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};

/**
 * Installeer boodschappen routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinnen/:id/boodschappen',
  });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllBoodschappen.validationScheme),
    checkGezinId,
    getAllBoodschappen
  );

  router.post(
    '/',  
  validate(createBoodschap.validationScheme),
  checkGezinId,
  createBoodschap
  );

  router.get(
    '/:boodschap_id',
  validate(getBoodschapById.validationScheme),
  checkGezinId,
  getBoodschapById
  );

  router.put(
    '/:boodschap_id',
  validate(updateBoodschap.validationScheme),
  checkGezinId,
  updateBoodschap
  );

  router.delete(
    '/:boodschap_id',
  validate(deleteBoodschap.validationScheme),
  checkGezinId,
  deleteBoodschap
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};