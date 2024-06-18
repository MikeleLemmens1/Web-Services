const { tables } = require('../..');

module.exports = {
  // 👇 1
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.gezinslid).delete();

    // then add the fresh gezinsleden
    await knex(tables.gezinslid).insert([
      {
        id: 1,
        voornaam: "Mikele",
        email: "mikele.lemmens@hotmail.com",
        wachtwoord: "######",
        gezin_id: 1,
        verjaardag_id: 1
      },
      {
        id: 2,
        voornaam: "Charlotte",
        email: "desmetcharlotte2@gmail.com",
        wachtwoord: "######",
        gezin_id: 1,
        verjaardag_id: 2
      },
      {
        id: 3,
        voornaam: "Ellis",
        email: null,
        wachtwoord: null,
        gezin_id: 1,
        verjaardag_id: 3,
      },
      {
        id: 4,
        voornaam: "Mattia",
        email: "Mattia.Lemmens@hotmail.com",
        wachtwoord: "######",
        gezin_id: 2,
        verjaardag_id: 4
      },
      {
        id: 5,
        voornaam: "Myrthe",
        email: "Myrthe.Roebroek@gmail.com",
        wachtwoord: "######",
        gezin_id: 2,
        verjaardag_id:6
      },
    ]);
  },
};