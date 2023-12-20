const { tables } = require('..');

module.exports = {
  // 👇 1
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.verjaardag).delete(); // 👈 2

    // then add the fresh verjaardagen
    await knex(tables.verjaardag).insert([
      {
        id: 1,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mikele",
        achternaam: "Lemmens",

      },
      {
        id: 2,
        dagnummer: 24,
        maandnummer: 8,
        voornaam: "Charlotte",
        achternaam: "De Smet",

      },
      {
        id: 3,
        dagnummer: 23,
        maandnummer: 9,
        voornaam: "Ellis",
        achternaam: "Lemmens",
        
      },
      {
        id: 4,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mattia",
        achternaam: "Lemmens",
    
      },
      {
        id: 5,
        dagnummer: 15,
        maandnummer: 12,
        voornaam: "Katrijn",
        achternaam: "Goens",
    
      },
      {
        id: 6,
        dagnummer: 10,
        maandnummer: 11,
        voornaam: "Myrthe",
        achternaam: "Roebroek",
    
      }
    ]);
  },
};