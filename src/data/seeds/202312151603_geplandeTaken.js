const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.geplandeTaak).delete();

    // then add the fresh geplande taken
    await knex(tables.geplandeTaak).insert(
      [
        {
          id: 1,
          naam: "Ellis halen",
          dag: "2023-10-16",
          gezinslid_id: 1,
        },
        {
          id: 2,
          naam: "Ellis halen",
          dag: "2023-10-17",
          gezinslid_id: 1,
        },
        {
          id: 3,
          naam: "Ellis halen",
          dag: "2023-10-18",
          gezinslid_id: 2,
        },
        {
          id: 4,
          naam: "Ellis halen",
          dag: "2023-10-19",
          gezinslid_id: 2,
        },
        {
          id: 5,
          naam: "Ellis halen",
          dag: "2023-10-20",
          gezinslid_id: 1,
        },
        {
          id: 6,
          naam: "Ellis brengen",
          dag: "2023-10-16",
          gezinslid_id: 2,
        },
        {
          id: 7,
          naam: "Ellis brengen",
          dag: "2023-10-17",
          gezinslid_id: 2,
        },
        {
          id: 8,
          naam: "Ellis brengen",
          dag: "2023-10-18",
          gezinslid_id: 1,
        },
        {
          id: 9,
          naam: "Ellis brengen",
          dag: "2023-10-19",
          gezinslid_id: 1,
        },
        {
          id: 10,
          naam: "Ellis brengen",
          dag: "2023-10-20",
          gezinslid_id: 2,
        },
        {
          id: 11,
          naam: "Koken",
          dag: "2023-10-16",
          gezinslid_id: 2,
        },
        {
          id: 12,
          naam: "Koken",
          dag: "2023-10-17",
          gezinslid_id: 1,
        },
        {
          id: 13,
          naam: "Koken",
          dag: "2023-10-18",
          gezinslid_id: 2,
        },
        {
          id: 14,
          naam: "Koken",
          dag: "2023-10-19",
          gezinslid_id: 1,
        },
        {
          id: 15,
          naam: "Koken",
          dag: "2023-10-20",
          gezinslid_id: 2,
        },
        {
          id: 16,
          naam: "Hond uitlaten",
          dag: "2023-10-16",
          gezinslid_id: 2,
        },
        {
          id: 17,
          naam: "Hond uitlaten",
          dag: "2023-10-17",
          gezinslid_id: 2,
        },
        {
          id: 18,
          naam: "Hond uitlaten",
          dag: "2023-10-18",
          gezinslid_id: 1,
        },
        {
          id: 19,
          naam: "Hond uitlaten",
          dag: "2023-10-19",
          gezinslid_id: 1,
        },
        {
          id: 20,
          naam: "Hond uitlaten",
          dag: "2023-10-20",
          gezinslid_id: 2,
        }
        
      ]
    );
  },
};