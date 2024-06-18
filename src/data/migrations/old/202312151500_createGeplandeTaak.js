const { tables } = require('../..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.geplandeTaak, (table) => {
      table.increments('id');

      table.string('naam', 255).notNullable();
      table.date('dag').notNullable();
      table.integer('gezinslid_id').unsigned().notNullable();
      table
      .foreign('gezinslid_id', 'fk_gezinslid_geplandeTaak')
      .references(`${tables.gezinslid}.id`)
      .onDelete('CASCADE');

    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.geplandeTaak);
  },
};