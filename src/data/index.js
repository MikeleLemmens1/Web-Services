const knex = require('knex');
const { getLogger } = require('../core/logging');
const { join } = require('path');
const config = require('config');
const { Sequelize, Sequelize } = require('sequelize');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
const DATABASE_TIMEZONE = config.get('database.timezone')
const DATABASE_NAME_SEQ = config.get('database.name_seq')

let knexInstance;

async function initializeData() {
  const logger = getLogger();
  logger.info('Initializing connection to the database');
  
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      // database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      timezone: DATABASE_TIMEZONE,
      insecureAuth: isDevelopment
    },
    // debug: isDevelopment,
    migrations: {
        tableName: 'knex_meta',
        directory: join('src', 'data', 'migrations'),
    },
    seeds: {
  
        directory: join('src', 'data', 'seeds'),
     },
    };

    knexInstance = knex(knexOptions); 
    
    try {
      await knexInstance.raw('SELECT 1+1 AS result');
      await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
      await knexInstance.destroy();
      
      knexOptions.connection.database = DATABASE_NAME;
      knexInstance = knex(knexOptions);
      await knexInstance.raw('SELECT 1+1 AS result');
      
    } catch (error) {
      logger.error(error.message, { error });
      throw new Error('Could not initialize the data layer'); 
    };
    try {
      await knexInstance.migrate.latest();
    } catch (error) {
      logger.error('Error while migrating the database', {
        error,
      });
      
      // No point in starting the server when migrations failed
      throw new Error('Migrations failed, check the logs');
    };
    
    logger.info('Successfully initialized connection to the database');
    
    if (isDevelopment) {
    
      try {
        await knexInstance.seed.run();
      } catch (error) {
        logger.error('Error while seeding database', {
          error,
        });
      };
    };
    return knexInstance;
  };

function getKnex() {
  if (!knexInstance)
  throw new Error(
      'Please initialize the data layer before getting the Knex instance'
      );
      return knexInstance;
    }
const tables = Object.freeze({
  gezin: 'gezinnen',
  gezinslid: 'gezinsleden',
  boodschap: 'boodschappen',
  verjaardag: 'verjaardagen',
  geplandeTaak: 'geplandetaken',
  kalender: 'kalenders'
});
async function shutdownData() {
  const logger = getLogger();

  logger.info('Shutting down database connection');

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}

async function initSequelize(){
  const options = {
    host: DATABASE_HOST,
    dialect: DATABASE_CLIENT,
    timezone: DATABASE_TIMEZONE,
    port: DATABASE_PORT,
    logging: (msg) => logger.info(msg),
    };

  let sequelize;
  try {
    sequelize = new Sequelize(DATABASE_NAME_SEQ,DATABASE_USERNAME,DATABASE_PASSWORD,options)
    await sequelize.authenticate();
    logger.info('Successfully initialized connection to the database');

  } catch (error){
    if (error.name === 'SequelizeConnectionError') {
      // If the database does not exist, create it
      sequelize = new Sequelize('', DATABASE_USERNAME, DATABASE_PASSWORD, seqOptions);
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME_SEQ}\`;`);
    } else {
      logger.error(error.message, { error });
      throw new Error('Could not initialize the data layer'); 
    }
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}
  


module.exports = {
  initializeData,
  getKnex, 
  tables, 
  shutdownData,
};
