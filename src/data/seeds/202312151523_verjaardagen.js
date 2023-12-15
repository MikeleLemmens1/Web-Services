const { tables } = require('..');

module.exports = {
  // 👇 1
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.verjaardag).delete(); // 👈 2

    // then add the fresh verhaardagen
    await knex(tables.verjaardag).insert([
      {
        // id: 1,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mikele",
        achternaam: "Lemmens",
        gezin_id: 1,
        gezinslid_id: 1
      },
      {
        // id: 2,
        dagnummer: 24,
        maandnummer: 8,
        voornaam: "Charlotte",
        achternaam: "De Smet",
        gezin_id: 1,
        gezinslid_id: 2
      },
      {
        // id: 3,
        dagnummer: 23,
        maandnummer: 9,
        voornaam: "Ellis",
        achternaam: "Lemmens",
        gezin_id: 1,
        gezinslid_id: 3,
        
      },
      {
        // id: 4,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mattia",
        achternaam: "Lemmens",
        gezin_id: 2,
        gezinslid_id: null
    
      }
    ]);
  },
};