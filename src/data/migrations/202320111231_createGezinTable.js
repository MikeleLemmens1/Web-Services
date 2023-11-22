const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.gezin, (table) => {
      table.increments('id');
      table.string('familienaam', 255).notNullable();
      table.string('straat', 255).notNullable();
      table.integer('huisnummer').notNullable();
      table.string('stad', 255).notNullable();

      //Unique index nodig? 
      //table.unique('name', 'idx_place_name_unique'); // 👈 3
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.gezin);
  },
};
