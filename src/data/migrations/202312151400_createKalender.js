const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.kalender, (table) => {
      table.increments('id');
      table.integer('gezin_id').unsigned();
      table
      .foreign('gezin_id', 'fk_gezin_kalender')
      .references(`${tables.gezin}.id`)
      .onDelete('CASCADE');
      table.integer('verjaardag_id').unsigned();
      table
      .foreign('verjaardag_id', 'fk_verjaardag_kalender')
      .references(`${tables.verjaardag}.id`)
      .onDelete('CASCADE');

      //Unique index nodig? 
      //table.unique('name', 'idx_place_name_unique'); // 👈 3
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.kalender);
  },
};
