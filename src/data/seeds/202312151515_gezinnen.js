const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.gezin).delete();

    // then add the fresh gezinnen
    await knex(tables.gezin).insert([
      {
        id:1,
        familienaam: "Lemmens - De Smet",
        straat: "Binnenslag",
        huisnummer: 63,
        postcode: 9920,
        stad: "Lovendegem"
      },
      {
        id: 2,
        familienaam: "Lemmens - Roebroek",
        straat: "Joost Van De Vondelplein",
        huisnummer: 27,
        postcode: 9940,
        stad: "Ertvelde"
      }
    ]);
  },
};