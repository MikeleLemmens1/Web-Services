const { tables } = require('../..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.gezinslid, (table) => {
      table.increments('id');
      table.string('voornaam', 255).notNullable();
      table.string('email', 255);
      table.string('wachtwoord', 255);
      table.integer('gezin_id').unsigned().notNullable();
      table.integer('verjaardag_id').unsigned().notNullable();
      table
      .foreign('gezin_id', 'fk_gezin_gezinslid')
      .references(`${tables.gezin}.id`)
      .onDelete('CASCADE');
      table
      .foreign('verjaardag_id', 'fk_verjaardag_gezinslid')
      .references(`${tables.verjaardag}.id`)
      .onDelete('CASCADE');

    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.gezinslid);
  },
};