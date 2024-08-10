/**
 * Gezinslid REST endpoints and routes.
 */
const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');


/**
 * Get all gezinsleden. (only for admin)
 * GET /gezinsleden
 */
const getAllGezinsleden = async (ctx) => {
  ctx.body = await gezinsledenService.getAllGezinsleden();
};
getAllGezinsleden.validationScheme = null;

/**
 * Get gezinslid by id.
 * GET /gezinsleden/:id
 */
const getGezinslidById = async (ctx) => {
  ctx.body = await gezinsledenService.getGezinslidById(Number(ctx.params.id));

  };
getGezinslidById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

/**
 * Create gezinslid.
 * POST /gezinsleden
 * Requires: {voornaam, gezin_id, verjaardag_id}
 * optional: {email}
 */
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
    gezin_id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive(),

  },
};

/**
 * Modify gezinslid by id.
 * PUT /gezinsleden/:id
 * Requires: {voornaam, gezin_id, verjaardag_id}
 * optional: {email}
 */
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
    gezin_id: Joi.number().integer().positive(),
    verjaardag_id: Joi.number().integer().positive(),
  },
};

/**
 * Delete gezinslid by id.
 * DELETE /gezinsleden/:id
 */
const deleteGezinslidById = async (ctx) => {
  await gezinsledenService.deleteGezinslidById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteGezinslidById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Register a new gezinslid.
 * POST /gezinsleden
 * Requires: {voornaam, email, wachtwoord, gezin_id, dagnummer, maandnummer}
 */
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

/**
 * Login a new gezinslid.
 * POST /gezinsleden
 * Requires: {email, wachtwoord}
 */
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

/**
 * Checks the gezin the gezinslid (user) belongs to
 * @param {object} ctx - The context that contains an id and gezin_id
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authorisation is successful.
 */
const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id } = ctx. params;
  // Enable creation of gezinslid without being registered, only family members should be allowed to do this
  let targetGezin_id;
  if (!id){
     targetGezin_id = ctx.request.body.gezin_id;
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
  checkGezinId,
  install: (app) => {

  const router = new Router({
    prefix: '/gezinsleden'
  });

  // Anyone can register and login without authentication
  router.post('/login', validate(login.validationScheme),login);
  router.post('/register', validate(register.validationScheme),register);
  
  // Only members of the same family can CRUD gezinsleden
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