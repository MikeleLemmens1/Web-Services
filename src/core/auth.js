const gezinsledenService = require('../service/gezinsleden');

const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers; 

  const { authToken, ...session } = await gezinsledenService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session; 
  ctx.state.authToken = authToken; 

  return next(); 
};

const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session; 

  gezinsledenService.checkRole(role, roles); 
  return next(); 
};

module.exports = {
  requireAuthentication, 
  makeRequireRole, 
};
