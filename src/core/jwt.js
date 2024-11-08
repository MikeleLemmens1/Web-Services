/**
 * JWT generation and verification functions
 * @module core/jwt
 */

const config = require('config'); 
const jwt = require('jsonwebtoken'); 
const JWT_AUDIENCE = config.get('auth.jwt.audience'); 
const JWT_SECRET = config.get('auth.jwt.secret'); 
const JWT_ISSUER = config.get('auth.jwt.issuer'); 
const JWT_EXPIRATION_INTERVAL = config.get('auth.jwt.expirationInterval'); 

/** 
 * Generates a JWT for the given user 
 * @param {User} user 
 * @returns {Promise<string>} 
 * @throws {Error} - If the token could not be generated.
 */
const generateJWT = (gezinslid) => {
 
  const tokenData = {
    gezinslid_id: gezinslid.id,
    roles: gezinslid.roles,
  };

  
  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };

  
  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        console.log('Error while signing new token:', err.message);
        return reject(err);
      }
      return resolve(token);
    });
  });
};

/**
 * Verifies the given JWT and returns the decoded token.
 * @param {string} authToken
 * @returns {Promise<object>} - The decoded token.
 * @throws {Error} - If the token is invalid. 
 */
const verifyJWT = (authToken) => {

  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };

  
  return new Promise((resolve, reject) => {
    jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
      if (err || !decodedToken) {
        console.log('Error while verifying token:', err.message);
        return reject(err || new Error('Token could not be parsed'));
      }
      return resolve(decodedToken);
    });
  });
};

module.exports = { 
  generateJWT,
  verifyJWT
};
