const Router = require('@koa/router');
const geplandeTakenService = require('../service/geplande_taken');
//TODO Documentatie aanvullen

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
//getAllByName? Om te zien wie er voor x dagen de hond uitlaat

const getTaskByGezinslidId = async (ctx) => {
  ctx.body = await geplandeTakenService.getAllByGezinslidId(Number(ctx.params.id));
};

const createGeplandeTaak = async (ctx) => {
  const newTask = await geplandeTakenService.create({
    ...ctx.request.body,
    dag: new Date(ctx.request.body.dag),
    gezinslid_id: Number(ctx.request.body.gezinslid_id)

  });  
  ctx.status = 201;
  ctx.body = newTask; 
};

const updateTask = async (ctx) => {
  ctx.body = await geplandeTakenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinslidId: Number(ctx.request.body.gezinslidId),
    dag: new Date(ctx.request.body.dag),
  });
};

const deleteTask = async (ctx) => {
  await geplandeTakenService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Installeer geplande_taken routes in de gegeven router
 *
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/geplande_taken',
  });

  router.get('/', getAllGeplandeTaken);
  router.post('/', createGeplandeTaak);
  router.get('/:id', getTaskByGezinslidId);
  router.put('/:id', updateTask);
  router.delete('/:id', deleteTask);

  app.use(router.routes())
     .use(router.allowedMethods());
};