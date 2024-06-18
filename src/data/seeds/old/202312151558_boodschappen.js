const { tables } = require('../..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.boodschap).delete();

    // then add the fresh boodschappen
    await knex(tables.boodschap).insert([
      {
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
      },
      {
        id: 2,
        naam: "Hondenbrokken",
        winkel: null,
        hoeveelheid: null,
        gezin_id: 1
      },
      {
        id: 3,
        naam: "Kaas",
        winkel: "Colruyt",
        hoeveelheid: null,
        gezin_id:1
      },
      {
        id: 4,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 2
      },
      {
        id: 5,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 1
      }
    ])
  },
};