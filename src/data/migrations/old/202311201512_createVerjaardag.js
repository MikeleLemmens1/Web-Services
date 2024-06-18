const { tables } = require('../..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.verjaardag, (table) => {
      table.increments('id');
      table.integer('dagnummer').notNullable();
      table.integer('maandnummer').notNullable();
      table.string('voornaam').notNullable();
      table.string('achternaam').notNullable();
      });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.verjaardag);
  },
};
