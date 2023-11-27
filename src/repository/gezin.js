const { getLogger } = require('../core/logging');
const {getKnex, tables}= require('../data');
/**
 * Geef een gezin op basis van id
 * 
 * @param {number} id - id van het gezochte gezin
 * 
 */
const getById = async(id)=> {
  return await getKnex()(tables.gezin).select().where('id',id);
}
/**
 * Maak een nieuw gezin
 * 
 * @param {object} gezin - het nieuwe gezin
 * @param {string} gezin.familienaam - naam van het gezin
 * @param {string} gezin.straar - naam van het gezin
 * @param {number} gezin.huisnummer - huisnummer van het gezin
 * @param {number} gezin.postcode - huisnummer van het gezin
 * @param {string} gezin.stad - huisnummer van het gezin
 * 
 * @returns {Promise<number>} Id van het gemaakte gezin
 */
const createGezin = async ({ familienaam, straat, huisnummer, postcode, stad }) => {
  
  const [id] = await getKnex()(tables.gezin).insert({
    familienaam,
    straat,
    huisnummer,
    postcode,
    stad,
    gezinsId,
  }); 
  return id; 
};
/**
 * Wijzigt een bestaand gezin
 * 
 * @param {number} id - id van het aan te passen gezin
 * @param {object} gezin - het op te slagen gezin
 * @param {string} gezin.familienaam - naam van het gezin
 * @param {string} gezin.straar - naam van het gezin
 * @param {number} gezin.huisnummer - huisnummer van het gezin
 * @param {number} gezin.postcode - huisnummer van het gezin
 * @param {string} gezin.stad - huisnummer van het gezin
 * 
 * @returns {Promise<number>} Id van het gezin
 */
const updateGezinById = async (id, {familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    const [mySQLid] = await getKnex()(tables.gezin).where('id', id).update({
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad,
    });
    return mySQLid;
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
  const rowsAffected = await getKnex()(tables.gezin).where('id', id).delete();
  return rowsAffected > 0;
  } catch (error){
    getLogger().error('Error in verwijderen van gezin', {
      error,
    });
    throw error;
  }
};

module.exports = {
  getById,
  createGezin,
  updateGezinById,
  deleteGezinById
};