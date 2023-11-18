const Router = require('@koa/router');
const geplandeTakenService = require('../service/geplande_taken');

const getAllGeplandeTaken = async (ctx) => {
  console.log(ctx.request.query);
  if (ctx.request.query){
    //! await plaatsen bij gebruik van Knex 
    ctx.body = await geplandeTakenService.getAll();
  };
  if (ctx.request.query.dag){
    ctx.body = geplandeTakenService.getAllByDay(Number(ctx.request.query.dag));
  }
  if (ctx.request.query.week){
    ctx.body = geplandeTakenService.getAllByWeek(Number(ctx.request.query.week));
  }

};

const createGeplandeTaak = async (ctx) => {
  const newTask = geplandeTakenService.create({
    naam: ctx.request.body.naam,
    dag: Date(ctx.request.body.dag),
    gezinslidId: Number(ctx.request.body.gezinslidId)

  });
  ctx.body = newTask; 
};

const getTaskByGezinslidId = async (ctx) => {
  ctx.body = geplandeTakenService.getBygezinslidId(Number(ctx.params.id)); // 👈 2
};


const updateTask = async (ctx) => {
  ctx.body = geplandeTakenService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    gezinslidId: Number(ctx.request.body.gezinslidId),
    dag: new Date(ctx.request.body.dag),
  });
};

const deleteTask = async (ctx) => {
  ctx.body = geplandeTakenService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
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