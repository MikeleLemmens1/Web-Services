const {getKnex, tables}= require('../data');
const { getLogger } = require('../core/logging');


const SELECT_COLUMNS = [
  `${tables.verjaardag}.id`,
  'dagnummer',
  'maandnummer',
  `${tables.verjaardag}.voornaam`,
  'achternaam',
  `${tables.gezin}.id as gezin_id`,
];

/**
 * Geef alle verjaardagen (van alle gezinnen) gesorteerd op maand en dag
 *
 */
const findAllVerjaardagen = async()=> {
  const verjaardagen = await getKnex()(tables.verjaardag)
  .join(
    tables.gezin, 
    `${tables.gezin}.id`,
    '=',
    `${tables.verjaardag}.gezin_id`
  )
  .select(SELECT_COLUMNS)
  .orderBy('maandnummer','ASC')
  .orderBy('dagnummer','ASC');
  
  return verjaardagen;
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
 * Vind alle verjaardagen van een gezin.
 *
 * @param {number} id - id van het gezin.
 */
const findVerjaardagenByGezinsId = async (id) => {
  const verjaardagskalender = await getKnex()(tables.verjaardag)
  .join(
    tables.gezin, 
    `${tables.gezin}.id`,
    '=',
    `${tables.verjaardag}.gezin_id`
  )
  .where(`${tables.verjaardag}.gezin_id`,id)
  .select(SELECT_COLUMNS);
    
  return verjaardagskalender;
};
/**
 * Vind een verjaardag met een gegeven id.
 *
 * @param {number} id - id van de gezochte verjaardag.
 */
const findVerjaardagById = async (id) => {
  const verjaardag = await getKnex()(tables.verjaardag)
  .join(
    tables.gezin, 
    `${tables.gezin}.id`,
    '=',
    `${tables.verjaardag}.gezin_id`
  )
  .where(`${tables.verjaardag}.id`,id)
  .first(SELECT_COLUMNS);

  return verjaardag;
};

/**
 * Maak een nieuwe verjaardag.
 *
 * @param {object} verjaardag - De nieuwe verjaardag
 * @param {number} verjaardag.dagnummer - Dagindex van de verjaardag
 * @param {number} verjaardag.maandnummer - Maandindex van de verjaardag
 * @param {object} verjaardag.voornaam - Voornaam van de jarige
 * @param {object} verjaardag.achternaam - Achternaam van de jarige
 * @param {number} verjaardag.gezin_id - Id van de gezin waartoe de verjaardag behoort (voor op de kalender)
 *
 * @returns {Promise<number>} Id van de gemaakte taak
 */
const createVerjaardag = async ({ gezin_id, voornaam, achternaam, dagnummer, maandnummer}) => {

  try{
  const [id] = await getKnex()(tables.verjaardag).insert({
    gezin_id,
    voornaam,
    achternaam,
    dagnummer,
    maandnummer,
  });
  return id;
  } catch (error) {
    getLogger().error('Error in createVerjaardag', {
      error,
    });
    throw error;
  };
};
/**
 * Wijzig een bestaande verjaardag.
 *
 * @param {object} verjaardag - De aan te passen verjaardag
 * @param {number} id - Het is van de aan te passen verjaardag
 * @param {number} verjaardag.dagnummer - Dagindex van de verjaardag
 * @param {number} verjaardag.maandnummer - Maandindex van de verjaardag
 * @param {object} verjaardag.voornaam - Voornaam van de jarige
 * @param {object} verjaardag.achternaam - Achternaam van de jarige
 * @param {number} verjaardag.gezin_id - Id van de gezin waartoe de verjaardag behoort (voor op de kalender)
 *
 * @returns {Promise<number>} Id van de aan te passen verjaardag
 * 
 */

const updateVerjaardag = async (id,{ gezin_id, voornaam, achternaam, dagnummer, maandnummer}) => {

  try{
    await getKnex()(tables.verjaardag).update({
      gezin_id,
      voornaam,
      achternaam,
      dagnummer,
      dagnummer,
      maandnummer,
    })
    .where(`${tables.verjaardag}.id`, id);
  return id;
  } catch (error) {
    getLogger().error('Error in updateVerjaardag', {
      error,
    });
    throw error;
  };
};


/**
 * Verwijder een verjaardag met een gegeven id.
 *
 * @param {number} id - Id van de te verwijderen verjaardag.
  *
 * @returns {Promise<boolean>} Of de verjaardag al dan niet is verwijderd.
 */

const deleteVerjaardag = async (id) => {
  try{
    const rowsAffected = await getKnex()(tables.verjaardag)
    .where(`${tables.verjaardag}.id`,id)
    .delete();
    return rowsAffected>0;
  }catch(error){
    getLogger().error('Error in deleteVerjaardag', {
      error
    });
    throw error;
  };
};

module.exports = {
  findAllVerjaardagen,
  findCount,
  findVerjaardagenByGezinsId,
  findVerjaardagById,
  createVerjaardag,
  updateVerjaardag,
  deleteVerjaardag,  
};