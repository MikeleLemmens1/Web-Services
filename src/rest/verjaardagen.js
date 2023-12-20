const Router = require('@koa/router');
const verjaardagenService = require('../service/verjaardagen');
const validate = require('../core/validation')
const Joi = require('joi');

const getAllVerjaardagen = async (ctx) => {
  ctx.body = await verjaardagenService.getAllVerjaardagen();
};
getAllVerjaardagen.validationScheme = null;

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

createVerjaardag.validationScheme = {
  body: {
    dagnummer: Joi.number().min(1).max(31),
    maandnummer: Joi.number().min(1).max(12),
    gezin_id: Joi.number().integer().positive(),
    voornaam: Joi.string().max(255),
    achternaam: Joi.string().max(255),
  }
};

const getVerjaardagenById = async (ctx) => {
  ctx.body = await verjaardagenService.getById(Number(ctx.params.id));
  // ctx.body = await verjaardagenService.getVerjaardagenByGezinsId(Number(ctx.params.id));
};
getVerjaardagenById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
}

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
  },
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

  router.get(
    '/',
    validate(getAllVerjaardagen.validationScheme),
    getAllVerjaardagen
  );

  router.post(
    '/', 
    validate(createVerjaardag.validationScheme),
    createVerjaardag
  );
  router.get(
    '/:id',
    validate(getVerjaardagenById.validationScheme),
    getVerjaardagenById
  );

  router.put(
    '/:id',
    validate(updateVerjaardag.validationScheme),
    updateVerjaardag
  );
  
  router.delete(
    '/:id',
    validate(deleteVerjaardag.validationScheme),
    deleteVerjaardag
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};