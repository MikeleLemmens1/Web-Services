const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.verjaardag, (table) => {
      table.increments('id');
      table.integer('dagnummer').notNullable();
      table.integer('maandnummer').notNullable();
      table.string('voornaam', 255).notNullable();
      table.string('achternaam', 255).notNullable();
      table.integer('gezinsId').unsigned();
      table.foreign('gezinsId').references('id').inTable(tables.gezin);

      //Unique index nodig? 
      //table.unique('name', 'idx_place_name_unique'); // 👈 3
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.verjaardag);
  },
};
