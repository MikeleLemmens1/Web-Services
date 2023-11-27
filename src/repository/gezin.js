const {getKnex, tables}= require('../data');

const getById = async(id)=> {
  return await getKnex()(tables.gezin).select().where('id',id);
}

const createGezin = async ({ familienaam, straat, huisnummer, postcode, stad }) => {
  //     👇 3
  const [id] = await getKnex()(tables.gezin).insert({
    familienaam,
    straat,
    huisnummer,
    postcode,
    stad,
    gezinsId,
  }); // 👈 2
  return id; // 👈 3
};

const updateGezinById = async (id, {familienaam, straat, huisnummer, postcode, stad}) => {

  const [mySQLid] = await getKnex()(tables.gezin).where('id', id).update({
    familienaam,
    straat,
    huisnummer,
    postcode,
    stad,
  });
  return mySQLid;
};

const deleteGezinById = async (id) => {

  const [mySQLid] = await getKnex()(tables.gezin).where('id', id).del();
  return mySQLid;
};

module.exports = {
  getById,
  createGezin,
  updateGezinById,
  deleteGezinById
};