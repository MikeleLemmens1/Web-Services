const { getLogger } = require('../core/logging')
const { getKnex, tables }= require('../data');

// const findAll = async()=> {
//   return await getKnex()(tables.boodschap).select().orderBy('boodschapId','ascending');
// }

const SELECT_COLUMNS = [
  `${tables.boodschap}.id`,
  'naam',
  'winkel',
  'hoeveelheid',
  `gezin_id`,
];

/**
 * Geef alle boodschappen
 *
 */
const findAllBoodschappen = async()=> {
  const boodschappen = await getKnex()(tables.boodschap)
  .select(SELECT_COLUMNS)
  .orderBy('winkel','ASC')
  .orderBy('naam','ASC');

  return boodschappen;
};
/**
 * Geef het totaal aantal boodschappen.
 *
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.boodschap).count();

  return count['count(*)'];
};
// TODO Misschien totaal aantal boodschappen van een gezin?

/**
 * Vind een boodschap met een gegeven id.
 *
 * @param {number} id - id van de boodschap.
 */
const findBoodschapByid = async (id) => {
  const boodschap = await getKnex()(tables.boodschap)
  .where(`${tables.boodschap}.id`,id)
  .first(SELECT_COLUMNS);

  return boodschap;
};
/**
 * Vind alle boodschappen van een gezin.
 *
 * @param {number} id - id van het gezin.
 */
const findBoodschappenByGezinsId = async (id) => {
  const boodschappen = await getKnex()(tables.boodschap)
  .where(`${tables.boodschap}.gezin_id`,id)
  .select(SELECT_COLUMNS);

  return boodschappen;
};
/**
 * Vind alle boodschappen van een bepaalde winkel.
 *
 * @param {number} id - id van het gezin.
 * @param {object} winkel - naam van de winkel.
 */
const findBoodschappenByWinkel = async (id,winkel) => {
  const boodschappen = await getKnex()(tables.boodschap)
  .where(`${tables.boodschap}.gezin_id`,id)
  .where(`${tables.boodschap}.winkel`,winkel)
  .select(SELECT_COLUMNS);

  return boodschappen;
};
/**
 * Maak een nieuwe boodschap.
 *
 * @param {object} boodschap - De nieuwe boodschap
 * @param {object} boodschap.naam - Naam van de boodschap
 * @param {object} boodschap.winkel - Winkel van de boodschap
 * @param {object} boodschap.hoeveelheid - Hoeveelheid van de boodschap
 * @param {number} geplandeTaak.gezin_id - Id van het gezin
 *
 * @returns {Promise<number>} Id van de boodschap
 */
const createBoodschap = async ({ naam, winkel, hoeveelheid, gezin_id }) => {

  try{
  const [id] = await getKnex()(tables.boodschap).insert({
    naam,
    winkel,
    hoeveelheid,
    gezin_id,
  });
  return id;
  } catch (error) {
    getLogger().error('Error in createBoodschap', {
      error,
    });
    throw error;
  };
};

/**
 * Pas een bestaande geplande taak aan.
 *
 * @param {number} id - Id van de aan te passen boodschap
 * @param {object} boodschap - De op te slagen boodschap
 * @param {object} boodschap.naam - De naam van de boodschap
 * @param {Date} boodschap.winkel - De winkel van de boodschap
 * @param {object} boodschap.hoeveelheid - De hoeveelheid van de boodschap
 * @param {number} boodschap.gezin_id - Het gezin waartoe de boodschap behoort (in een boodschappenlijstje)
 * 
 * @returns {Promise<number>} Id van de taak
 */
const updateBoodschapById = async (id, {naam, winkel, hoeveelheid, gezin_id}) => {
  try{  
    await getKnex()(tables.boodschap)
    .update({
      naam,
      winkel,
      hoeveelheid,
      gezin_id: gezin_id,
    })
    .where(`${tables.boodschap}.id`, id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateBoodschapById', {
      error,
    });
    throw error;
  } 
  };

/**
 * Verwijder een boodschap met een gegeven id.
 *
 * @param {number} id - Id van de te verwijderen boodschap.
  *
 * @returns {Promise<boolean>} Of de boodschap al dan niet is verwijderd.
 */
  
const deleteBoodschapById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.boodschap)
      .where(`${tables.boodschap}.id`, id)
      .delete();

    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteBoodschapById', {
      error,
    });
    throw error;
  };
};



module.exports = {
  findAllBoodschappen,
  findBoodschapByid,
  findBoodschappenByWinkel,
  findBoodschappenByGezinsId,
  createBoodschap,
  updateBoodschapById,
  deleteBoodschapById,
  findCount,
};