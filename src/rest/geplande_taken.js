const Router = require('@koa/router');
const geplandeTakenService = require('../service/geplande_taken');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication , makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');


const getAllGeplandeTaken = async (ctx) => {
  // if (ctx.request.query.dag){
  //   let dag = new Date(ctx.request.query.dag)
  //   ctx.body = await geplandeTakenService.getAllByDay(dag);
  // }
  // else if (ctx.request.query.week){
  //   ctx.body = await geplandeTakenService.getAllByWeek(Number(ctx.request.query.week));
  // }
  // else
  //   ctx.body = await geplandeTakenService.getAll();
  ctx.body = await geplandeTakenService.getAllGeplandeTaken(ctx.params.id);
};

getAllGeplandeTaken.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getAllGeplandeTakenByGezin = async (ctx) => {
  ctx.body = await geplandeTakenService.getAllGeplandeTakenByGezin(ctx.params.id);
};

getAllGeplandeTakenByGezin.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getGeplandeTaakById = async (ctx) => {
  ctx.body = await geplandeTakenService.getGeplandeTaakById(ctx.params.id);
};

getGeplandeTaakById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createGeplandeTaak = async (ctx) => {
  const newTask = await geplandeTakenService.createGeplandeTaak({
    ...ctx.request.body,
    // dag: new Date(ctx.request.body.dag),
    gezinslid_id: Number(ctx.request.body.gezinslid_id)
    // gezinslid_id: Number(ctx.params.id)

  });  
  ctx.status = 201;
  ctx.body = newTask; 
};
createGeplandeTaak.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    dag: Joi.string()/*.min('now').message('"date" cannot be earlier than today')*/,
    gezinslid_id: Joi.number().integer().positive(),
  },
  // params: Joi.object({
  //   id: Joi.number().integer().positive(),
  // }),
};

const updateGeplandeTaak = async (ctx) => {
  ctx.body = await geplandeTakenService.updateGeplandeTaakById(ctx.params.id, {
    ...ctx.request.body,
    // gezinslidId: Number(ctx.request.body.gezinslidId),
    // dag: new Date(ctx.request.body.dag),
  });
};
updateGeplandeTaak.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().max(255),
    dag: Joi.string()
    // .format("YYYY-MM-DD").min(today()).message('"date" cannot be earlier than today'),
    ,
    gezinslid_id: Joi.number().integer().positive().optional(),
  },
};

const deleteGeplandeTaak = async (ctx) => {
  await geplandeTakenService.deleteGeplandeTaakById(ctx.params.id);
  ctx.status = 204;
};
deleteGeplandeTaak.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const checkGezinId = async (ctx, next) => {
  const { gezin_id, roles } = ctx.state.session;
  let { id } = ctx.params;
  // Enable creation of gezinslid without being registered, only family members should be allowed to do this
  let targetGezinslid;
  let targetGezin_id;
  if (!id){
    //  targetGezin_id = ctx.body.gezin_id;
     targetGezinslid = await getGezinslidById(ctx.request.body.gezinslid_id);
     targetGezin_id = targetGezinslid.Gezin.id;
    }
  else {
    const geplandeTaak = await getGeplandeTaakById(id);
    const gezinslid = geplandeTaak.Gezinslid;
    const targetGezin = gezinslid.Gezin;
    targetGezin_id = targetGezin.id;
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
 * Installeer geplande_taken routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinsleden/:id/geplande_taken',
    // prefix: '/geplande_taken'
  });
  router.use(requireAuthentication);

  // All geplande taken for gezinslid
  router.get(
    '/',
    validate(getAllGeplandeTaken.validationScheme),
    getAllGeplandeTaken

  // All geplande taken for the family of the active gezinslid
  );
  router.get(
    '/all',
    validate(getAllGeplandeTakenByGezin.validationScheme),
    getAllGeplandeTakenByGezin

  );

  // Only allowed if requested task belongs to a fellow gezinslid
  router.get(
    '/:id',
    validate(getGeplandeTaakById.validationScheme),
    // checkGezinId,
    getGeplandeTaakById
  );

  router.post(
    '/',
    validate(createGeplandeTaak.validationScheme),
    createGeplandeTaak
  );
  
  router.put(
    '/:id',
    validate(updateGeplandeTaak.validationScheme),
    updateGeplandeTaak
  );
  router.delete(
    '/:id',
    validate(deleteGeplandeTaak.validationScheme),
    deleteGeplandeTaak
  );
  // return router;
  app.use(router.routes())
     .use(router.allowedMethods());
};