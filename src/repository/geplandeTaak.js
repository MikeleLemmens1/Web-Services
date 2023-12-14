const {getKnex, tables}= require('../data/index');
const { getLogger } = require('../core/logging');
// const geplande_taken = require('../rest/geplande_taken');

const formatGeplandeTaak = ({
  gezinslid_id,
  gezinslid_voornaam,
  ...geplandeTaak
}) => {
  return {
    ...geplandeTaak,
    gezinslid: {
      id: gezinslid_id,
      naam: gezinslid_voornaam
    }
  };
};

const SELECT_COLUMNS = [
  `${tables.geplandeTaak}.id`,
  'naam',
  'dag',
  `${tables.gezinslid}.id as gezinslid_id`,
  `${tables.gezinslid}.voornaam as gezinslid_voornaam`,
];

/**
 * Geef alle geplande taken
 *
 */
const findAllGeplandeTaken = async()=> {
  const geplandeTaken = await getKnex()(tables.geplandeTaak)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.geplandeTaak}.gezinslid_id`
  )
  .select(SELECT_COLUMNS)
  .orderBy('dag','ASC');

  return geplandeTaken.map(formatGeplandeTaak);
};
/**
 * Geef het totaal aantal geplande taken.
 *
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.geplandeTaak).count();

  return count['count(*)'];
};

/**
 * Vind een geplande taak met een gegeven id.
 *
 * @param {number} id - id van de gezochte taak.
 */
const findGeplandeTaakById = async (id) => {
  const geplandeTaak = await getKnex()(tables.geplandeTaak)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.geplandeTaak}.gezinslid_id`
  ).where(`${tables.geplandeTaak}.id`,id)
  .first(SELECT_COLUMNS);

  return geplandeTaak && formatGeplandeTaak(geplandeTaak);
};
/**
 * Vind alle geplande taken van een gezinslid.
 *
 * @param {number} id - id van het gezinslid.
 */
const findGeplandeTakenByGezinslidId = async (id) => {
  const geplandeTaken = await getKnex()(tables.geplandeTaak)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.geplandeTaak}.gezinslid_id`
  ).where(`${tables.gezinslid}.id`,id)
  .select(SELECT_COLUMNS);

  return geplandeTaken.map(formatGeplandeTaak);
};

/**
 * Vind alle geplande taken voor een dag.
 *
 * @param {Date} dag - dag van de gezochte taak.
 */
const findGeplandeTakenByDay = async (dag) => {
  const geplandeTaken = await getKnex()(tables.geplandeTaak)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.geplandeTaak}.gezinslid_id`
  ).where(`${tables.geplandeTaak}.dag`,dag)
  .select(SELECT_COLUMNS);

  return geplandeTaken.map(formatGeplandeTaak);
};
/**
 * Maak een nieuwe geplande taak.
 *
 * @param {object} geplandeTaak - De nieuwe geplande taak
 * @param {object} geplandeTaak.naam - Naam van de geplande taak
 * @param {Date} geplandeTaak.dag - Dag van de geplande taak
 * @param {number} geplandeTaak.gezinslidId - Id van de uitvoerder
 *
 * @returns {Promise<number>} Id van de gemaakte taak
 */
const createGeplandeTaak = async ({ naam, dag, gezinslidId }) => {

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

/**
 * Pas een bestaande geplande taak aan.
 *
 * @param {number} id - Id van de aan te passen taak
 * @param {object} geplandeTaak - De op te slagen taak
 * @param {object} geplandeTaak.naam - De naam van de taak
 * @param {Date} geplandeTaak.dag - De dag van de taak
 * @param {number} geplandeTaak.gezinslidId - De uitvoerder van de taak
 * 
 * @returns {Promise<number>} Id van de taak
 */
const updateGeplandeTaakById = async (id, {naam, dag, gezinslidId}) => {
  try{  
    await getKnex()(tables.geplandeTaak)
    .update({
      naam,
      gezinslid_id: gezinslidId,
      dag
    })
    .where(`${tables.geplandeTaak}.id`, id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateGeplandeTaakById', {
      error,
    });
    throw error;
  } 
  };

/**
 * Verwijder een geplande taak met een gegeven id.
 *
 * @param {number} id - Id van de te verwijderen taak.
  *
 * @returns {Promise<boolean>} Of de geplande taak al dan niet is verwijderd.
 */
  
const deleteGeplandeTaakById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.geplandeTaak)
      .where(`${tables.geplandeTaak}.id`, id)
      .delete();

    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteGeplandeTaakById', {
      error,
    });
    throw error;
  };
};

module.exports = {
  findAllGeplandeTaken,
  findGeplandeTaakById,
  findGeplandeTakenByGezinslidId,
  findGeplandeTakenByDay,
  findCount,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById
};