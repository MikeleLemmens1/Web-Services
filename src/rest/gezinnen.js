const Router = require('@koa/router');
const gezinService = require('../service/gezinnen');
const geplandeTakenService = require('../service/geplande_taken');
const Joi = require('joi')
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const getAllGezinnen = async (ctx) => {
  ctx.body = await gezinService.getAllGezinnen(ctx.query.familienaam);
};
getAllGezinnen.validationScheme =   {
query: {
  familienaam: Joi.string().max(255).optional(),
},};


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
  ctx.body = await gezinService.getAllGezinsledenFromGezin(ctx.params.id);
}

getAllGezinsledenFromGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

// The following functions are unnecessary: the associated objects are always returned when getting the gezin

// const getAllBoodschappenFromGezin = async (ctx) => {
//   ctx.body = await gezinService.getAllBoodschappenFromGezin(ctx.params.id);
// }

// getAllBoodschappenFromGezin.validationScheme = {
//   params: Joi.object({
//     id: Joi.number().integer().positive(),
//   }),
// };

// const getAllVerjaardagenFromGezin = async (ctx) => {
//   ctx.body = await gezinService.getAllVerjaardagenFromGezin(ctx.params.id);
// }

// getAllVerjaardagenFromGezin.validationScheme = {
//   params: Joi.object({
//     id: Joi.number().integer().positive(),
//   }),
// };

const getAllGeplandeTakenFromGezin = async (ctx) => {
  ctx.body = await geplandeTakenService.getAllGeplandeTakenFromGezin(ctx.params.id);
}

getAllGeplandeTakenFromGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  const { id } = ctx. params;
  // Enable creation of gezinslid without being registered, only family members should be allowed to do this
  const targetGezin_id = id;

  // targetGezin: gezin of the gezinslid being modified
  // gezin_id: gezin of the active user
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
    requireAuthentication,
    validate(getAllGezinnen.validationScheme),
    getAllGezinnen
  );
  
  router.get(
    '/:id',
    requireAuthentication,
    validate(getGezinById.validationScheme),
    checkGezinId,
    getGezinById
  );

  router.get(
    '/:id/gezinsleden',
    requireAuthentication,
    validate(getAllGezinsledenFromGezin.validationScheme),
    checkGezinId,
    getAllGezinsledenFromGezin
  );
  
  router.get(
    '/:id/geplande_taken',
    requireAuthentication,
    validate(getAllGeplandeTakenFromGezin.validationScheme),
    checkGezinId,
    getAllGeplandeTakenFromGezin
  );

  // Any unregistered user can post a new gezin
  router.post(
    '/', 
    validate(createGezin.validationScheme),
    createGezin
  );


  router.put(
    '/:id',
    requireAuthentication,
    validate(updateGezinById.validationScheme),
    checkGezinId,
    updateGezinById
  );

  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteGezinById.validationScheme),
    checkGezinId,
    deleteGezinById
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};