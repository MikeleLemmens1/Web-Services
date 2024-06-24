const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const { getGezinById } = require('../service/gezinnen');


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

const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id } = ctx. params;
  // Enable creation of gezinslid without being registered, only family members should be allowed to do this
  let targetGezin_id;
  if (!id){
     targetGezin_id = ctx.body.gezin_id;
  }
  else {
    const targetGezinslid = await gezinsledenService.getGezinslidById(id)
    targetGezin_id = targetGezinslid.Gezin.id;
  }
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
module.exports = {
  checkUserId,
  checkGezinId,
  install: (app) => {

  const router = new Router({
    prefix: '/gezinsleden'
  });

  router.post('/login', validate(login.validationScheme),login);
  router.post('/register', validate(register.validationScheme),register);
  
  // Only family members can CRUD gezinsleden
  router.get('/:id',requireAuthentication,validate(getGezinslidById.validationScheme),checkGezinId,getGezinslidById);
  router.put('/:id',requireAuthentication,validate(updateGezinslidById.validationScheme),checkGezinId,updateGezinslidById);
  router.delete('/:id',requireAuthentication,validate(deleteGezinslidById.validationScheme),checkGezinId,deleteGezinslidById);
  router.post('/',requireAuthentication,validate(createGezinslid.validationScheme),checkGezinId,createGezinslid);

  // Only admins can get all gezinsleden of all families
  const requireAdmin = makeRequireRole(Role.ADMIN);
  router.get('/', requireAuthentication , requireAdmin , validate(getAllGezinsleden.validationScheme),getAllGezinsleden);

  app.use(router.routes())
     .use(router.allowedMethods())
  },
}