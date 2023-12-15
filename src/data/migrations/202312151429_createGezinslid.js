const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.gezinslid, (table) => {
      table.increments('id');
      table.string('voornaam', 255).notNullable();
      table.string('email', 255);
      table.string('wachtwoord', 255);
      table.integer('gezin_id').unsigned();
      table.integer('verjaardag_id').unsigned();
      table
      .foreign('gezin_id', 'fk_gezin_gezinslid')
      .references(`${tables.gezin}.id`)
      .onDelete('CASCADE');
      table
      .foreign('verjaardag_id', 'fk_verjaardag_gezinslid')
      .references(`${tables.verjaardag}.id`)

      //Unique index nodig? 
      //table.unique('name', 'idx_place_name_unique'); // 👈 3
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.gezinslid);
  },
};