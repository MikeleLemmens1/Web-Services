const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN'


class ServiceError extends Error {
 
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ServiceError';
  }

 
  static notFound(message, details) {
    return new ServiceError(NOT_FOUND, message, details);
  }
 
  static validationFailed(message, details) {
    return new ServiceError(VALIDATION_FAILED, message, details);
  }
  
  static unauthorized(message,details){
    return new ServiceError(UNAUTHORIZED,message,401,details);
  }

  static forbidden(message,details){
    return new ServiceError(FORBIDDEN,message,403,details);
  }

  get isNotFound() {
    return this.code === NOT_FOUND;
  }


  get isValidationFailed() {
    return this.code === VALIDATION_FAILED;
  }
}

module.exports = ServiceError;