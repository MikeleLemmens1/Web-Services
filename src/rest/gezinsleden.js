const Router = require('@koa/router');
const gezinsledenService = require('../service/gezinsleden')
const Joi = require('joi');
const validate = require('../core/validation');
const { get } = require('config');
const ServiceError = require('../core/serviceError');

const getAllGezinsleden = async (ctx) => {
  ctx.body = await gezinsledenService.getAllGezinsleden();
};
getAllGezinsleden.validationScheme = null;

const getGezinslidById = async (ctx) => {
  // ctx.body = await gezinsledenService.getGezinslidById(Number(ctx.params.id));
    try{
    ctx.body = await gezinsledenService.getAllGezinsledenByGezinsId(Number(ctx.params.id));
    } catch (error){
      ctx.status = 404;
      throw error;
    }
  };
getGezinslidById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};
const createGezinslid = async (ctx) => {
  const newGezinslid = await gezinsledenService.createGezinslid({
    voornaam: ctx.request.body.voornaam,
    email: ctx.request.body.email,
    wachtwoord: ctx.request.body.wachtwoord,
    gezin_id: Number(ctx.request.body.gezin_id),
    verjaardag_id: Number(ctx.request.body.verjaardag_id)
  });
  ctx.status = 201;
  ctx.body = newGezinslid;
};
createGezinslid.validationScheme = {
  body: {
    voornaam: Joi.string(),
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
}

/**
 * Installeer gezinsleden routes in de gegeven router
 * 
 * @param {Router} app - De parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/gezinsleden'
  });
  router.get(
    '/',
    validate(getAllGezinsleden.validationScheme),
    getAllGezinsleden
  );

  router.get(
    '/:id',
    validate(getGezinslidById.validationScheme),
    getGezinslidById
  );

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

  app.use(router.routes())
     .use(router.allowedMethods())
}