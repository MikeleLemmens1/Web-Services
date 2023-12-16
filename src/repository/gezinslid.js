const { getLogger } = require('../core/logging');
const {getKnex, tables}= require('../data');

const formatGezinslid = ({
  gezin_id,
  gezin_familienaam,
  verjaardag_id,
  ...gezinslid
  }) => {
  return {
    ...gezinslid,
    verjaardag: verjaardag_id,
    gezin: {
      id: gezin_id,
      familienaam: gezin_familienaam,
    }
  };
};

const SELECT_COLUMNS = [
  `${tables.gezinslid}.id`,
  `${tables.gezin}.id as gezin_id`,
  `${tables.gezin}.familienaam as gezin_familienaam`,
  `${tables.verjaardag}.voornaam`,
  'email',
  'wachtwoord',
  `${tables.verjaardag}.id as verjaardag_id  `,
];

/**
 * Geef alle gezinsleden
 * 
 */
const findAllGezinsleden = async()=> {
  const gezinsleden = await getKnex()(tables.gezinslid)
  .join(
    tables.gezin,
    `${tables.gezinslid}.gezin_id`,
    '=',
    `${tables.gezin}.id`
  ).join(
    tables.verjaardag,
    `${tables.gezinslid}.verjaardag_id`,
    '=',
    `${tables.verjaardag}.id`
  ).select(SELECT_COLUMNS)
  .orderBy('voornaam','ASC');

  return await gezinsleden.map(formatGezinslid);
};
/**
 * Geef het totaal aantal gezinsleden
 * 
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.gezinslid).count();
  return count['count(*)'];
}
/**
 * Vind alle gezinsleden van een gezin
 * 
 * @param {number} id - id van het gezin 
 */
const findAllGezinsledenByGezinsId = async(id) => {
  return await getKnex()(tables.gezinslid).select().where('gezinslid.gezinsId',id);
}
/**
 * Vind een gezinslid met een gegeven id
 * 
 * @param {number} id - id van het gezochte gezinslid 
 * @returns 
 */
const findGezinslidById = async(id)=> {
  const gezinslid = await getKnex()(tables.gezinslid)
  .join(
    tables.gezin,
    `${tables.gezinslid}.gezin_id`,
    '=',
    `${tables.gezin}.id`
  ).join(
    tables.verjaardag,
    `${tables.gezinslid}.verjaardag_id`,
    '=',
    `${tables.verjaardag}.id`
  ).where(`${tables.gezinslid}.id`,'=',id)
  .first(SELECT_COLUMNS);
  return gezinslid && formatGezinslid(gezinslid);
}
/**
 * Maak een nieuw gezinslid
 * 
 * @param {object} gezinslid - Het aan te maken gezinslid
 * @param {number} gezinslid.gezinsId - Het id van het gezin waartoe het lid behoort
 * @param {object} gezinslid.voornaam - De voornaam van het gezinslid
 * @param {object} gezinslid.email - Het e-mailadres van het gezinslid
 * @param {object} gezinslid.wachtwoord - Het wachtwoord van het gezinslid
 * @param {number} gezinslid.verjaardagsId - De verjaardag van het gezinslid
 * 
 * @returns {Promise<number>} id van het gemaakte gezinslid
 */
const createGezinslid = async ({gezinsId, voornaam, email, wachtwoord, verjaardagsId}) => {
  try{
    const [id] = await getKnex()(tables.gezinslid).insert({
      gezin_id: gezinsId,
      voornaam,
      email,
      wachtwoord,
      verjaardag_id: verjaardagsId,
    });
    return id;
  } catch (error) {
    getLogger().error('Error in createGezinslid', {
      error,
    });
    throw error;
    
  };

};
/**
 * Pas een bestaand gezinslid aan
 * 
 * @param {number} id - Id van het aan te passen gezinslid 
 * @param {object} gezinslid - Het aan te passen gezinslid
 * @param {number} gezinslid.gezinsId - Het id van het gezin waartoe het lid behoort 
 * @param {object} gezinslid.voornaam - De voornaam van het gezinslid
 * @param {object} gezinslid.email - Het e-mailadres van het gezinslid
 * @param {object} gezinslid.wachtwoord - Het wachtwoord van het gezinslid
 * @param {number} gezinslid.verjaardagsId - de verjaardagsid van het gezinslid
 * 
 * @returns {Promise<number>} Id van het gezinslid
 */
const updateGezinslidById = async (id, {gezinsId, voornaam, email, wachtwoord, verjaardagsId}) => {
  try{
    await getKnex()(tables.gezinslid).update({
      gezins_id:gezinsId,
      voornaam,
      email,
      wachtwoord,
      verjaardags_id: verjaardagsId,
    })
    .where('id',id);
    return id;
  } catch (error) {
      getLogger().error('Error in updateGezinslid', {
        error,
      });
      throw error;
  }
};

/** 
 * Verwijder een gezinslid met een gegeven id.
 *  
 * @param {number} id - id van het te verwijderen gezinslid.
 *
 * @returns {Promise<boolean>} Of het gezinslid al dan niet verwijderd is
 */
const deletegezinslidById = async (id) => {
  try{
    const rowsAffected = await getKnex()(tables.gezinslid)
    .where(`${tables.gezinslid}.id`,id)
    .delete();
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteGezinslid', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAllGezinsleden,
  findGezinslidById,
  findAllGezinsledenByGezinsId,
  findCount,
  createGezinslid,
  updateGezinslidById,
  deletegezinslidById,
};