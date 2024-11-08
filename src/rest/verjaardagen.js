/**
 * Verjaardag REST endpoints.
 * @module rest/verjaardagen
 */
const Router = require('@koa/router');
const verjaardagenService = require('../service/verjaardagen');
const validate = require('../core/validation')
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');
const Role = require('../core/roles');

/**
 * Get all verjaardagen for a gezin.
 * GET /gezinnen/:id/verjaardagen
 */
const getAllVerjaardagen = async (ctx) => {
  ctx.body = await verjaardagenService.getAllVerjaardagen()
};
getAllVerjaardagen.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};
/**
 * Get verjaardag by verjaardag_id.
 * GET /gezinnen/:id/verjaardagen/:verjaardag_id
 */
const getVerjaardagById = async (ctx) => {
  ctx.body = await verjaardagenService.getVerjaardagById(Number(ctx.params.verjaardag_id));
};
getVerjaardagById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive()
  }),
}

/**
 * Create new verjaardagen for a gezin.
 * POST /gezinnen/:id/verjaardagen
 * Required: {dagnummer, maandnummer, voornaam, achternaam}
 */
const createVerjaardag = async (ctx) => {
  const nieuweverjaardag = await verjaardagenService.createVerjaardag({
    ...ctx.request.body,
    dagnummer: Number(ctx.request.body.dagnummer),
    maandnummer: Number(ctx.request.body.maandnummer),
    gezin_id: Number(ctx.params.id)
  });  
  ctx.status = 201;
  ctx.body = nieuweverjaardag; 
};

createVerjaardag.validationScheme = {
  body: {
    dagnummer: Joi.number().min(1).max(31),
    maandnummer: Joi.number().min(1).max(12),
    voornaam: Joi.string().max(255),
    achternaam: Joi.string().max(255),
  },
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

/**
 * Modify an existing verjaardag for a gezin.
 * PUT /gezinnen/:id/verjaardagen/:verjaardag_id
 * Required: {dagnummer, maandnummer, voornaam, achternaam}
 */
const updateVerjaardag = async (ctx) => {
  ctx.body = await verjaardagenService.updateVerjaardagById(Number(ctx.params.verjaardag_id), {
    ...ctx.request.body,
    dagnummer: Number(ctx.request.body.dagnummer),
    maandnummer: Number(ctx.request.body.maandnummer),
  });
};

updateVerjaardag.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive()

  },
  body: {
    dagnummer: Joi.number().min(1).max(31),
    maandnummer: Joi.number().min(1).max(12),
    voornaam: Joi.string().max(255),
    achternaam: Joi.string().max(255),
  }
}

/**
 * Delete an existing verjaardag.
 * DELETE /gezinnen/:id/verjaardagen/:verjaardag_id
 */
const deleteVerjaardag = async (ctx) => {
  await verjaardagenService.deleteVerjaardagById(Number(ctx.params.verjaardag_id));
  ctx.status = 204;
};
deleteVerjaardag.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive()

  },
};

/**
 * Checks the gezin the gezinslid (user) and verjaardag belongs to
 * @param {object} ctx - The context that contains an id and gezin_id
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authorisation is successful.
 */
const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id, verjaardag_id } = ctx.params;
  let targetGezin_id;
  if(verjaardag_id){
    const verjaardag = await verjaardagenService.getVerjaardagById(verjaardag_id);
    const gezinnen = await verjaardag.getGezins();
    const targetGezin_ids = gezinnen.map((gezin)=> gezin.id)
    if (targetGezin_ids.includes(gezin_id)){
      targetGezin_id = gezin_id;
    }
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
 * Installeer verjaardag routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinnen/:id/verjaardagen',
  });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllVerjaardagen.validationScheme),
    checkGezinId,
    getAllVerjaardagen
  );

  router.post(
    '/', 
    validate(createVerjaardag.validationScheme),
    checkGezinId,
    createVerjaardag
  );
  router.get(
    '/:verjaardag_id',
    validate(getVerjaardagById.validationScheme),
    checkGezinId,
    getVerjaardagById
  );

  router.put(
    '/:verjaardag_id',
    validate(updateVerjaardag.validationScheme),
    checkGezinId,
    updateVerjaardag
  );
  
  router.delete(
    '/:verjaardag_id',
    validate(deleteVerjaardag.validationScheme),
    checkGezinId,
    deleteVerjaardag
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};