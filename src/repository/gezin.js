const { getLogger } = require('../core/logging');
const {getKnex, tables}= require('../data');


const SELECT_COLUMNS = [
  `${tables.gezin}.id`,
  'familienaam',
  'straat',
  'huisnummer',
  'postcode',
  'stad',
];
/**
 * Geef alle gezinnen
 * 
 */
const findAllGezinnen = async() => {
  return await getKnex()(tables.gezin).select()
};

/**
 * Geef een gezin op basis van id
 * 
 * @param {number} id - id van het gezochte gezin
 * 
 */
const findGezinById = async(id)=> {
  return await getKnex()(tables.gezin).select().where('id',id);
}
/**
 * Geef het totaal aantal gezinsleden
 * 
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.gezin).count();
  return count['count(*)'];
}
/**
 * Maak een nieuw gezin
 * 
 * @param {object} gezin - het nieuwe gezin
 * @param {string} gezin.familienaam - naam van het gezin
 * @param {string} gezin.straat - straat van het gezin
 * @param {number} gezin.huisnummer - huisnummer van het gezin
 * @param {number} gezin.postcode - postcode van het gezin
 * @param {string} gezin.stad - woonplaats van het gezin
 * 
 * @returns {Promise<number>} Id van het gemaakte gezin
 */
const createGezin = async ({ familienaam, straat, huisnummer, postcode, stad }) => {
  try{
    const [id] = await getKnex()(tables.gezin).insert({
    familienaam,
    straat,
    huisnummer,
    postcode,
    stad,
    gezinsId,
  }); 
  return id;
  }catch (error) {
    getLogger().error('error in createGezin', {
      error,
    });
    throw error;
  };
   
};
/**
 * Wijzigt een bestaand gezin
 * 
 * @param {number} id - id van het aan te passen gezin
 * @param {object} gezin - het op te slagen gezin
 * @param {string} gezin.familienaam - naam van het gezin
  * @param {string} gezin.straat - straat van het gezin
 * @param {number} gezin.huisnummer - huisnummer van het gezin
 * @param {number} gezin.postcode - postcode van het gezin
 * @param {string} gezin.stad - woonplaats van het gezin
 * 
 * @returns {Promise<number>} Id van het gezin
 */
const updateGezinById = async (id, {familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    await getKnex()(tables.gezin).update({
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad,
    })
    .where('id', id);
    return id;
  } catch (error){
    getLogger().error('Error in het wijzigen van het gezin',{
      error,
    });
    throw error;
  }
};

/**
 * Verwijder een gezin met een gegeven id.
 *
 * @param {number} id - Id van het te verwijderen gezin
  *
 * @returns {Promise<boolean>} Of het gezin al dan niet is verwijderd
 */
const deleteGezinById = async (id) => {

  try{
  const rowsAffected = await getKnex()(tables.gezin).where(`${tables.gezin}.id`, id).delete();
  return rowsAffected > 0;
  } catch (error){
    getLogger().error('Error in verwijderen van gezin', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAllGezinnen,
  findCount,
  findGezinById,
  createGezin,
  updateGezinById,
  deleteGezinById
};