const {getKnex, tables}= require('../data');
const { getLogger } = require('../core/logging');

// {
// id: 1,
// dagnummer: 30,
// maandnummer: 12,
// voornaam: "Mikele",
// achternaam: "Lemmens",
// gezinsId: 1,
// gezinslidId: 1
// };

const formatVerjaardag = ({
  gezinslid_id,
  gezinslid_voornaam,
  ...verjaardag
}) => {
  return {
    ...verjaardag,
    gezinslid: {
      id: gezinslid_id,
      naam: gezinslid_voornaam
    }
  };
};

const SELECT_COLUMNS = [
  `${tables.verjaardag}.id`,
  'dagnummer',
  'maandnummer',
  'voornaam',
  'achternaam',
  `${tables.gezinslid}.id as gezinslid_id`,
  `${tables.gesinslid}.voornaam as gezinslid_voornaam`,
  `${tables.gesin}.is as gezins_id`,
];

/**
 * Geef alle verjaardagen (van alle gezinnen) gesorteerd op maand en dag
 *
 */
const findAllVerjaardagen = async()=> {
  const verjaardagen = await getKnex()(tables.verjaardag)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.verjaardag}.gezinslid_id`
  )
  .select(SELECT_COLUMNS)
  .orderBy('maandnummer','ASC')
  .orderBy('dagnummer','ASC');
  
  return verjaardagen.map(formatVerjaardag);
};
/**
 * Geef het totaal aantal verjaardagen.
 *
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.verjaardag).count();

  return count['count(*)'];
};
/**
 * Vind alle geplande taken van een gezinslid.
 *
 * @param {number} id - id van het gezinslid.
 */
const findVerjaardagByGezinslidId = async (id) => {
  const verjaardag = await getKnex()(tables.verjaardag)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.verjaardag}.gezinslid_id`
  ).where(`${tables.gezinslid}.id`,id)
  .first(SELECT_COLUMNS);

  return verjaardag && formatVerjaardag(verjaardag);
};

/**
 * Maak een nieuwe geplande taak.
 *
 * @param {object} verjaardag - De nieuwe verjaardag
 * @param {number} verjaardag.dagnummer - Dagindex van de verjaardag
 * @param {number} verjaardag.maandnummer - Maandindex van de verjaardag
 * @param {object} verjaardag.voornaam - Voornaam van de jarige
 * @param {object} verjaardag.achternaam - Achternaam van de jarige
 * @param {number} verjaardag.gezinsId - Id van de gezin waartoe de verjaardag behoort
 *
 * @returns {Promise<number>} Id van de gemaakte taak
 */
const createVerjaardag = async ({ naam, dag, gezinslidId }) => {

  try{
  const [id] = await getKnex()(tables.geplandeTaak).insert({
    naam,
    dag,
    gezinslid_id: gezinslidId,
  });
  return id;
  } catch (error) {
    getLogger().error('Error in createGeplandeTaak', {
      error,
    });
    throw error;
  };
};


module.exports = {
  findAllVerjaardagen,
  findCount,
  findVerjaardagByGezinslidId,
};