const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.kalender).delete();

    // then add the fresh kalenders
    await knex(tables.kalender).insert([
      {
        id:1,
        gezin_id: 1,
        verjaardag_id: 1
      },
      { 
        id:2,
        gezin_id: 1,
        verjaardag_id: 2
      },
      { 
        id:3,
        gezin_id: 1,
        verjaardag_id: 3
      },
      { 
        id:4,
        gezin_id: 2,
        verjaardag_id: 4
      },
      { 
        id:5,
        gezin_id: 2,
        verjaardag_id: 5
      },
      { 
        id:6,
        gezin_id: 1,
        verjaardag_id: 5
      },
      { 
        id:7,
        gezin_id: 2,
        verjaardag_id: 6
      },
    ]);
  },
};