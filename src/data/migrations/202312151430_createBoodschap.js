const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.boodschap, (table) => {
      table.increments('id');

      table.string('naam', 255).notNullable();
      table.string('winkel', 255);
      table.string('hoeveelheid', 255);
      table.integer('gezin_id').unsigned().notNullable();
      table
      .foreign('gezin_id', 'fk_gezin_boodschap')
      .references(`${tables.gezin}.id`)
      .onDelete('CASCADE');


    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.boodschap);
  },
};