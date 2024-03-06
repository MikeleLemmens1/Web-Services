const Router = require('@koa/router');
const geplandeTakenService = require('../service/geplande_taken');
const Joi = require('joi');
const validate = require('../core/validation');


const getAllGeplandeTaken = async (ctx) => {
  if (ctx.request.query.dag){
    let dag = new Date(ctx.request.query.dag)
    ctx.body = await geplandeTakenService.getAllByDay(dag);
  }
  else if (ctx.request.query.week){
    ctx.body = await geplandeTakenService.getAllByWeek(Number(ctx.request.query.week));
  }
  else
    ctx.body = await geplandeTakenService.getAll();
  
  

};
getAllGeplandeTaken.validationScheme = null;

// Vervangen door GetById
const getTaskByGezinslidId = async (ctx) => {
  ctx.body = await geplandeTakenService.getAllByGezinslidId(Number(ctx.params.id));
};
getTaskByGezinslidId.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getTaskById = async (ctx) => {
  ctx.body = await geplandeTakenService.getById(Number(ctx.params.id));
};
getTaskById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const createGeplandeTaak = async (ctx) => {
  const newTask = await geplandeTakenService.create({
    ...ctx.request.body,
    dag: new Date(ctx.request.body.dag),
    // gezinslid_id: Number(ctx.request.body.gezinslid_id)
    gezinslid_id: Number(ctx.params.id)

  });  
  ctx.status = 201;
  ctx.body = newTask; 
};
createGeplandeTaak.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    dag: Joi.string()
    // .format("YYYY-MM-DD").min(today()).message('"date" cannot be earlier than today'),
    // ,gezinslid_id: Joi.number().integer().positive(),
  },
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const updateTask = async (ctx) => {
  ctx.body = await geplandeTakenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinslidId: Number(ctx.request.body.gezinslidId),
    dag: new Date(ctx.request.body.dag),
  });
};
updateTask.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().max(255),
    dag: Joi.string()
    // .format("YYYY-MM-DD").min(today()).message('"date" cannot be earlier than today'),
    ,gezinslid_id: Joi.number().integer().positive().optional(),
  },
};

const deleteTask = async (ctx) => {
  await geplandeTakenService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteTask.validationScheme = {
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
    prefix: '/gezinsleden/:id/geplande_taken',
  });

  router.get(
    '/',
    // validate(getAllGeplandeTaken.validationScheme),
    // getAllGeplandeTaken
    validate(getTaskByGezinslidId.validationScheme),
    getTaskByGezinslidId
  );
  router.post(
    '/',
    validate(createGeplandeTaak.validationScheme),
    createGeplandeTaak
  );
  
  router.get(
    '/:id',
    validate(getTaskById.validationScheme),
    getTaskById
  );
  router.put(
    '/:id',
    validate(updateTask.validationScheme),
    updateTask
  );
  router.delete(
    '/:id',
    validate(deleteTask.validationScheme),
    deleteTask
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};