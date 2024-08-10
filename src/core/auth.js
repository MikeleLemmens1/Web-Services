/**
 * Authentication middleware.
 * @module core/auth
 */

const gezinsledenService = require('../service/gezinsleden');

/**
 * Require authentication for the given context.
 *
 * @param {object} ctx - The context to check.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authentication is successful.
 */
const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers; 

  const { authToken, ...session } = await gezinsledenService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session; 
  ctx.state.authToken = authToken; 

  return next(); 
};

/**
 * Create a middleware function that requires a specific role.
 *
 * @param {string} role - The role to check for.
 * @returns {function} - A middleware function that checks if the user has the required role.
 */
const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session; 

  gezinsledenService.checkRole(role, roles); 
  return next(); 
};

module.exports = {
  requireAuthentication, 
  makeRequireRole, 
};
