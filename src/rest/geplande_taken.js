const Router = require('@koa/router');
const geplandeTakenService = require('../service/geplande_taken');
const Joi = require('joi');
const validate = require('../core/validation');


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
  ctx.body = await geplandeTakenService.getAllGeplandeTaken();
};

getAllGeplandeTaken.validationScheme = {
  // params: Joi.object({
  //   id: Joi.number().integer().positive(),
  // }),
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
/**
 * Installeer geplande_taken routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    // prefix: '/gezinsleden/:id/geplande_taken',
    prefix: '/geplande_taken'
  });

  router.get(
    '/',
    validate(getAllGeplandeTaken.validationScheme),
    getAllGeplandeTaken

  );

  router.get(
    '/:id',
    validate(getGeplandeTaakById.validationScheme),
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