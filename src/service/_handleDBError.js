const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {
  const {name = '',table} = error;

  if (name === 'SequelizeUniqueConstraintError') {
    const {path} = error.errors[0];
    return ServiceError.validationFailed(`This ${path} already exists`);
  }
  

  if (name === 'SequelizeForeignKeyConstraintError') {

    return ServiceError.notFound(`This ${table.toLowerCase().slice(0,-1)} does not exist`);
    
  }
  return error;
};

module.exports = handleDBError;