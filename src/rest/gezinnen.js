const Router = require('@koa/router');
const gezinService = require('../service/gezinnen');
const Joi = require('joi')
const validate = require('../core/validation');

const getAllGezinnen = async (ctx) => {
  ctx.body = await gezinService.getAllGezinnen();
};
getAllGezinnen.validationScheme = null;


const createGezin = async (ctx) => {
  const newGezin = await gezinService.createGezin({
    ...ctx.request.body,
    // No longer necessary to cast numbers?
    // huisnummer: Number(ctx.request.body.huisnummer),
    // postcode: Number(ctx.request.body.postcode),
  });
  ctx.status = 201;
  ctx.body = newGezin; 
};
createGezin.validationScheme = {
  // Check for alternate syntax ico errors (Joi.object({...}))
  body: {
    familienaam: Joi.string().max(255),
    straat: Joi.string().max(255),
    postcode: Joi.number().integer().min(1000).max(9999),
    huisnummer: Joi.number().integer().positive(),
    stad: Joi.string().max(255),
  },
};
const getGezinById = async (ctx) => {
  ctx.body = await gezinService.getGezinById(Number(ctx.params.id));
};
getGezinById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getGezinByFamilienaam = async (ctx) => {
  ctx.body = await gezinService.getGezinByFamilienaam(ctx.params.familienaam);
}
getGezinByFamilienaam.validationScheme = {
  params: {
    familienaam: Joi.string().max(255),
  },
};

// TODO: setVerjaardagId's
const updateGezinById = async (ctx) => {
  ctx.body = await gezinService.updateGezinById(Number(ctx.params.id), {
    ...ctx.request.body,
    // huisnummer: Number(ctx.request.body.huisnummer),
    // postcode: Number(ctx.request.body.postcode),
  });
};
updateGezinById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    familienaam: Joi.string().max(255),
    straat: Joi.string().max(255),
    postcode: Joi.number().integer().min(1000).max(9999),
    huisnummer: Joi.number().integer().positive(),
    stad: Joi.string().max(255),
  },
};

const deleteGezinById = async (ctx) => {
  await gezinService.deleteGezinById(ctx.params.id);
  ctx.status = 204;
};
deleteGezinById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getAllGezinsledenFromGezin = async (ctx) => {
  ctx.body = await gezinService.getAllGezinsleden(ctx.params.id);
}

getAllGezinsledenFromGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};
const getAllBoodschappenFromGezin = async (ctx) => {
  ctx.body = await gezinService.getAllBoodschappen(ctx.params.id);
}

getAllBoodschappenFromGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getAllVerjaardagenFromGezin = async (ctx) => {
  ctx.body = await gezinService.getAllVerjaardagen(ctx.params.id);
}

getAllVerjaardagenFromGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};



/**
 * Installeer gezinsleden routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinnen',
  });

  router.get(
    '/',
    validate(getAllGezinnen.validationScheme),
    getAllGezinnen
  );
  
  router.get(
    '/:id',
    validate(getGezinById.validationScheme),
    getGezinById
  );

  router.get(
    '/familienaam/:familienaam',
    validate(getGezinByFamilienaam.validationScheme),
    getGezinByFamilienaam
  );

  router.get(
    '/:id/gezinsleden',
    validate(getAllGezinsledenFromGezin.validationScheme),
    getAllGezinsledenFromGezin
  );

  router.get(
    '/:id/boodschappen',
    validate(getAllBoodschappenFromGezin.validationScheme),
    getAllBoodschappenFromGezin
  );

  router.get(
    '/:id/verjaardagen',
    validate(getAllVerjaardagenFromGezin.validationScheme),
    getAllVerjaardagenFromGezin
  );

  router.post(
    '/', 
    validate(createGezin.validationScheme),
    createGezin
  );


  router.put(
    '/:id',
    validate(updateGezinById.validationScheme),
    updateGezinById
  );

  router.delete(
    '/:id',
    validate(deleteGezinById.validationScheme),
    deleteGezinById
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};