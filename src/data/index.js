// const knex = require('knex');
const { getLogger } = require('../core/logging');
// const { join } = require('path');
// Navigate filesystem to associate models
const fs = require('fs')
const path = require('path')
const config = require('config');
const {Sequelize} = require('sequelize');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

// const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
const DATABASE_TIMEZONE = config.get('database.timezone')
// const DATABASE_NAME_SEQ = config.get('database.name_seq')

const DATABASE_DIALECT = config.get('database.dialect');
// const DATABASE_SSL  = config.get('database.ssl');
// const DATABASE_OMITNULL = config.get('database.omitNull');

// Required to associate models stored in ./models
const basename = path.basename(__filename);
const db = {};

let sequelize;

async function initializeData(){
  const logger = getLogger();
  logger.info('Initializing connection to database');
  const options = {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    timezone: DATABASE_TIMEZONE,
    port: DATABASE_PORT,
    logging: (msg) => logger.info(msg),
    // SSL en OmitNull toevoegen?
    };

  try {
    sequelize = new Sequelize(DATABASE_NAME,DATABASE_USERNAME,DATABASE_PASSWORD,options);
    await sequelize.authenticate();
    logger.info('Successfully initialized connection to the database');

  } catch (error){
    if (error.name === 'SequelizeConnectionError') {
      // If the database does not exist, create it
      sequelize = new Sequelize('', DATABASE_USERNAME, DATABASE_PASSWORD, options);
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;`);
    } else {
      logger.error(error.message, { error });
      throw new Error('Could not initialize the data layer'); 
    }
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
  // Simpler catch block for troubleshooting
  // catch (error) {
  //   logger.error('Unable to connect to the database', error);
  //   throw new Error('Could not initialize the data layer');
  // }

  const modelsDirectory = path.join(__dirname, 'models');
  fs
  .readdirSync(modelsDirectory)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(modelsDirectory, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
  // associate all models
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}

function getSequelize() {
  if (!sequelize)
    throw new Error(
      'Please initialize the data layer before getting the Sequelize instance'
    );
  return sequelize;
}

async function shutdownData() {
  const logger = getLogger();

  logger.info('Shutting down database connection');

  await sequelize.close();
  sequelize = null;

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}


  


module.exports = {
  getSequelize,
  initializeData,
  // getKnex, 
  // tables, 
  shutdownData,
};

// let knexInstance;

// async function initializeData() {
//   const logger = getLogger();
//   logger.info('Initializing connection to the database');
  
//   const knexOptions = {
//     client: DATABASE_CLIENT,
//     connection: {
//       host: DATABASE_HOST,
//       port: DATABASE_PORT,
//       // database: DATABASE_NAME,
//       user: DATABASE_USERNAME,
//       password: DATABASE_PASSWORD,
//       timezone: DATABASE_TIMEZONE,
//       insecureAuth: isDevelopment
//     },
//     // debug: isDevelopment,
//     migrations: {
//         tableName: 'knex_meta',
//         directory: join('src', 'data', 'migrations'),
//     },
//     seeds: {
  
//         directory: join('src', 'data', 'seeds'),
//      },
//     };

//     knexInstance = knex(knexOptions); 
    
//     try {
//       await knexInstance.raw('SELECT 1+1 AS result');
//       await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
//       await knexInstance.destroy();
      
//       knexOptions.connection.database = DATABASE_NAME;
//       knexInstance = knex(knexOptions);
//       await knexInstance.raw('SELECT 1+1 AS result');
      
//     } catch (error) {
//       logger.error(error.message, { error });
//       throw new Error('Could not initialize the data layer'); 
//     };
//     try {
//       await knexInstance.migrate.latest();
//     } catch (error) {
//       logger.error('Error while migrating the database', {
//         error,
//       });
      
//       // No point in starting the server when migrations failed
//       throw new Error('Migrations failed, check the logs');
//     };
    
//     logger.info('Successfully initialized connection to the database');
    
//     if (isDevelopment) {
    
//       try {
//         await knexInstance.seed.run();
//       } catch (error) {
//         logger.error('Error while seeding database', {
//           error,
//         });
//       };
//     };
//     return knexInstance;
//   };

// function getKnex() {
//   if (!knexInstance)
//   throw new Error(
//       'Please initialize the data layer before getting the Knex instance'
//       );
//       return knexInstance;
//     }

// const tables = Object.freeze({
//   gezin: 'gezinnen',
//   gezinslid: 'gezinsleden',
//   boodschap: 'boodschappen',
//   verjaardag: 'verjaardagen',
//   geplandeTaak: 'geplandetaken',
//   kalender: 'kalenders'
// });