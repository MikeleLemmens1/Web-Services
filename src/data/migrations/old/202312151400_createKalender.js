const { tables } = require('../..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.kalender, (table) => {
      table.increments('id');
      table.integer('gezin_id').unsigned().notNullable();
      table
      .foreign('gezin_id', 'fk_gezin_kalender')
      .references(`${tables.gezin}.id`)
      .onDelete('CASCADE');
      table.integer('verjaardag_id').unsigned().notNullable();
      table
      .foreign('verjaardag_id', 'fk_verjaardag_kalender')
      .references(`${tables.verjaardag}.id`)
      .onDelete('CASCADE');

    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.kalender);
  },
};
