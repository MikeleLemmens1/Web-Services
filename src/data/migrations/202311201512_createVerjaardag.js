const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.verjaardag, (table) => {
      table.increments('id');
      table.integer('dagnummer').notNullable();
      table.integer('maandnummer').notNullable();
      table.string('voornaam').notNullable();
      table.string('achternaam').notNullable();
      table.string('gezinslid_id');
      table.integer('gezin_id').unsigned();
      table
      .foreign('gezin_id', 'fk_gezin_verjaardag')
      .references(`${tables.gezin}.id`)

      //Unique index nodig? 
      //table.unique('name', 'idx_place_name_unique'); // 👈 3
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.verjaardag);
  },
};
