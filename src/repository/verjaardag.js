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
  ...verjaardag
}) => {
  return {
    ...verjaardag,
    gezinslid: {
      id: gezinslid_id,
      naam: voornaam,
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
  `${tables.gezin}.id as gezins_id`,
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
const findVerjaardagenByGezinsId = async (id) => {
  const verjaardagskalender = await getKnex()(tables.verjaardag)
  .where(`${tables.verjaardag}.gezin_id`,id)
  .select(SELECT_COLUMNS);

  return verjaardagskalender && formatVerjaardag(verjaardagskalender);
};
/**
 * Vind een verjaardag met een gegeven id.
 *
 * @param {number} id - id van de gezochte verjaardag.
 */
const findVerjaardagById = async (id) => {
  const verjaardag = await getKnex()(tables.verjaardag)
  .join(
    tables.gezinslid,
    `${tables.gezinslid}.id`,
    '=',
    `${tables.verjaardag}.gezinslid_id`)
  .where('id',id)
  .first(SELECT_COLUMNS);

  return verjaardag && formatVerjaardag(verjaardag);
};

/**
 * Maak een nieuwe verjaardag.
 *
 * @param {object} verjaardag - De nieuwe verjaardag
 * @param {number} verjaardag.dagnummer - Dagindex van de verjaardag
 * @param {number} verjaardag.maandnummer - Maandindex van de verjaardag
 * @param {object} verjaardag.voornaam - Voornaam van de jarige
 * @param {object} verjaardag.achternaam - Achternaam van de jarige
 * @param {number} verjaardag.gezinsId - Id van de gezin waartoe de verjaardag behoort (voor op de kalender)
 * @param {number} verjaardag.gezinsLidId - Id van het gezinslid indien van toepassing
 *
 * @returns {Promise<number>} Id van de gemaakte taak
 */
const createVerjaardag = async ({ gezinsId, voornaam, achternaam, dagnummer, maandnummer, gezinslidId }) => {

  try{
  const [id] = await getKnex()(tables.verjaardag).insert({
    gezinsId,
    voornaam,
    achternaam,
    dagnummer,
    gezinslid_id: gezinslidId,
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
 * @param {number} verjaardag.gezinsId - Id van de gezin waartoe de verjaardag behoort (voor op de kalender)
 * @param {number} verjaardag.gezinsLidId - Id van het gezinslid indien van toepassing
 *
 * @returns {Promise<number>} Id van de aan te passen verjaardag
 * 
 */

const updateVerjaardag = async (id,{ gezinsId, voornaam, achternaam, dagnummer, maandnummer, gezinslidId }) => {

  try{
    await getKnex()(tables.verjaardag).update({
      gezinsId,
      voornaam,
      achternaam,
      dagnummer,
      gezinslid_id: gezinslidId,
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