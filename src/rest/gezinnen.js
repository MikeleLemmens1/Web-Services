const Router = require('@koa/router');
const gezinService = require('../service/gezinnen');
const Joi = require('joi')
const validate = require('../core/validation');

const getAllGezinnen = async (ctx) => {
  ctx.body = await gezinService.getAllGezinnen();
};
getAllGezinnen.validationScheme = null;


const createGezin = async (ctx) => {
  const newGezin = await gezinService.create({
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

// TODO: get by familienaam?
// TODO: get all gezinsleden
// TODO: get all verjaardagen

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