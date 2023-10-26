const knex = require('knex'); // 👈 4
const { getLogger } = require('../core/logging'); // 👈 8

// 👇 1 - start config
const config = require('config');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
// 👆 1 einde config

let knexInstance; // 👈 5

// 👇 2
async function initializeData() {
  const logger = getLogger(); // 👈 9
  logger.info('Initializing connection to the database'); // 👈 9

  // 👇 6 - start knex opties
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
  };
  // 👆 6 einde knex opties
  knexInstance = knex(knexOptions); // 👈 7

  // 👇 8
  try {
    await knexInstance.raw('SELECT 1+1 AS result');
  } catch (error) {
    logger.error(error.message, { error }); // 👈 9
    throw new Error('Could not initialize the data layer'); // 👈 10
  }

  logger.info('Successfully initialized connection to the database'); // 👈 9

  return knexInstance; // 👈 7
}

// 👇 11
function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance'
    );
  return knexInstance;
}

// 👇 12
const tables = Object.freeze({
  gezin: 'gezin',
  gezinslid: 'gezinsleden',
  boodschap: 'boodschappen',
  verjaardag: 'verjaardagen',
  geplandeTaak: 'geplandetaken'
});

module.exports = {
  initializeData, // 👈 3
  getKnex, // 👈 11
  tables, // 👈 12
};