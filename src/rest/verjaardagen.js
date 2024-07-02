const Router = require('@koa/router');
const verjaardagenService = require('../service/verjaardagen');
const validate = require('../core/validation')
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');

const getAllVerjaardagen = async (ctx) => {
  ctx.body = await verjaardagenService.getAllVerjaardagen()
};
getAllVerjaardagen.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getVerjaardagenById = async (ctx) => {
  ctx.body = await verjaardagenService.getVerjaardagById(Number(ctx.params.id));
};
getVerjaardagenById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive()
  }),
}
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


const updateVerjaardag = async (ctx) => {
  ctx.body = await verjaardagenService.updateVerjaardagById(Number(ctx.params.id), {
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

const deleteVerjaardag = async (ctx) => {
  await verjaardagenService.deleteVerjaardagById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteVerjaardag.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive()

  },
};

const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id, verjaardag_id } = ctx.params;
  let targetGezin_id;
  if(verjaardag_id){
    const verjaardag = await verjaardagenService.getVerjaardagById(verjaardag_id);
    targetGezin_id = verjaardag.gezin_id;
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
    validate(getVerjaardagenById.validationScheme),
    checkGezinId,
    getVerjaardagenById
  );

  router.put(
    '/:verjaardag_id',
    validate(updateVerjaardag.validationScheme),
    checkGezinId,
    updateVerjaardag
  );
  
  router.delete(
    '/:id',
    validate(deleteVerjaardag.validationScheme),
    checkGezinId,
    deleteVerjaardag
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};