/**
 * Custom error class for service errors
 * @module core/serviceError
 */

const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN'

/**
 * Custom error class for service errors
 * @extends Error
 */
class ServiceError extends Error {
   /**
   * Create a service error
   * @param {string} code - The error code
   * @param {string} message - The error message
   * @param {number} status - The HTTP status code
   * @param {object} details - The error details
   */
  constructor(code, message,status, details = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.name = 'ServiceError';
  }

   /**
   * Create a not found error
   * @param {string} message - The error message
   * @param {object} details - The error details
   * @returns {ServiceError} - The error
   */
  static notFound(message, details) {
    return new ServiceError(NOT_FOUND, message,404, details);
  }
   /**
   * Create a validation failed error
   * @param {string} message - The error message
   * @param {object} details - The error details
   * @returns {ServiceError} - The error
   */
  static validationFailed(message, details) {
    return new ServiceError(VALIDATION_FAILED, message,400, details);
  }
    /**
   * Create an unauthorized error
   * @param {string} message - The error message
   * @param {object} details - The error details
   * @returns {ServiceError} - The error
   */
  static unauthorized(message,details){
    return new ServiceError(UNAUTHORIZED,message,401,details);
  }
  /**
   * Create a forbidden error
   * @param {string} message - The error message
   * @param {object} details - The error details
   * @returns {ServiceError} - The error
   */
  static forbidden(message,details){
    return new ServiceError(FORBIDDEN,message,403,details);
  }
  /**
   * Check if the error is a not found error
   * @returns {boolean} - True if the error is a not found error
   */
  get isNotFound() {
    return this.code === NOT_FOUND;
  }

  /**
   * Check if the error is a validation failed error
   * @returns {boolean} - True if the error is a not found error
   */
  get isValidationFailed() {
    return this.code === VALIDATION_FAILED;
  }
  /**
   * Check if the error is an unauthorized error
   * @returns {boolean} - True if the error is a not found error
   */
  get isUnauthorized(){
    return this.code === UNAUTHORIZED;
  }
    /**
   * Check if the error is a forbidden error
   * @returns {boolean} - True if the error is a not found error
   */
  get isForbidden(){
    return this.code === FORBIDDEN;
  }
}

module.exports = ServiceError;