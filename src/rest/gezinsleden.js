const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');


const getAllGezinsleden = async (ctx) => {
  ctx.body = await gezinsledenService.getAllGezinsleden();
};
getAllGezinsleden.validationScheme = null;

const getGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.getGezinslidById(Number(ctx.params.id));
    // ctx.body = await gezinsledenService.getAllGezinsledenByGezinsId(Number(ctx.params.id));

  };
getGezinslidById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};
const createGezinslid = async (ctx) => {
  const newGezinslid = await gezinsledenService.createGezinslid({
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id),
    verjaardag_id: Number(ctx.request.body.verjaardag_id)
  });
  ctx.status = 201;
  ctx.body = newGezinslid;
};
createGezinslid.validationScheme = {
  body: {
    voornaam: Joi.string().max(255),
    email: Joi.string().optional(),
    // Wachtwoord wordt meegegeven bij het registreren
    // wachtwoord: Joi.string().optional(),
    gezin_id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive(),

  },
};
const updateGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.updateGezinslidById(Number(ctx.params.id),{
    ...ctx.request.body,
    gezin_id: Number(ctx.request.body.gezin_id),
    verjaardag_id: Number(ctx.request.body.verjaardag_id),
  });
};
updateGezinslidById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    voornaam: Joi.string(),
    email: Joi.string().optional(),
    // wachtwoord: Joi.string().optional(),
    gezin_id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive(),
  },
};

const deleteGezinslidById = async (ctx) => {
  await gezinsledenService.deleteGezinslidById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteGezinslidById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const register = async (ctx) => {
  const gezinslid = await gezinsledenService.register({
    ...ctx.request.body,
  });
  ctx.status = 200;
  ctx.body = gezinslid;
};

register.validationScheme = {
  body: Joi.object({
    voornaam: Joi.string().max(255),
    email: Joi.string().email(),
    wachtwoord: Joi.string().min(8).max(30),
    gezin_id: Joi.number().integer().positive(),
    dagnummer: Joi.number().integer().positive(),
    maandnummer: Joi.number().integer().positive()
  })
};

const login = async (ctx) => {
  const {email,wachtwoord} = ctx.request.body;
  const token = await gezinsledenService.login(email,wachtwoord);
  ctx.body = token;
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    wachtwoord: Joi.string(), 
  },
};

const checkUserId = (ctx, next) => {
  const { gezinslid_id, roles } = ctx.state.session;
  const { id } = ctx.params;

  
  if (id !== gezinslid_id && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to operate on this user's information.",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};

const checkGezinId = (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  const { id } = ctx.params;

  
  if (id !== gezin_id && !roles.includes(Role.ADMIN)) {
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
module.exports = {
  // checkUserId,
  // checkGezinId,
  install: (app) => {

  const router = new Router({
    prefix: '/gezinsleden'
  });

  router.post('/login', validate(login.validationScheme),login);
  router.post('/register', validate(register.validationScheme),register);
  router.get('/:id',requireAuthentication,validate(getGezinslidById.validationScheme),getGezinslidById);
  const requireAdmin = makeRequireRole(Role.ADMIN);
  router.get('/', requireAuthentication , requireAdmin , validate(getAllGezinsleden.validationScheme),getAllGezinsleden);

  // router.get(
  //   '/:id/geplande_taken',
  //   validate(getAllGeplandeTaken.validationScheme),
  //   getAllGeplandeTaken
  // );

  router.post(
    '/',
    validate(createGezinslid.validationScheme),
    createGezinslid,
  );
  router.put(
    '/:id',
    validate(updateGezinslidById.validationScheme),
    updateGezinslidById,
  );
  router.delete(
    '/:id',
    validate(deleteGezinslidById.validationScheme),
    deleteGezinslidById,
  );

  // const geplandeTakenRoutes = require('./geplande_taken');
  // router.use('/:id/geplande_taken',geplandeTakenRoutes.routes(),geplandeTakenRoutes.allowedMethods())

  app.use(router.routes())
     .use(router.allowedMethods())
  },
}