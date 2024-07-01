const verjaardagService = require('./verjaardagen');
const gezinService = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');
const Role = require('../core/roles');
const { getLogger } = require('../core/logging')
const { hashPassword, verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');

const checkAndParseSession = async (authHeader) => {
  if(!authHeader){
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if(!authHeader.startsWith('Bearer ')){
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try{
    const {roles, gezinslid_id} = await verifyJWT(authToken);
    gezinslid = await getGezinslidById(gezinslid_id);
    gezin_id = gezinslid.Gezin.id;
    return {
      roles,
      gezinslid_id,
      gezin_id,
      authToken
    };
  } 
  catch (error){
      getLogger().error('error.message', {error});
      if(error instanceof ServiceError){
        throw ServiceError.unauthorized('User no longer has access');
      }
      throw new Error(error.message);
    }
};

const checkRole = (role,roles) => {
  const hasPermission = roles.includes(role);

  if(!hasPermission){
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application');
  }
};

const makeExposedUser = ({id,voornaam,email,roles}) => ({
  id,
  voornaam,
  email,
  roles,
});

const login = async (email,wachtwoord) => {
  const gezinslid = await getSequelize().models.Gezinslid.findOne({
    where: {
      email: email,
    },
  });

  if(!gezinslid){
    throw ServiceError.unauthorized(
      'There is no gezinslid with this email');
  }
  
  const passwordValid = await verifyPassword(wachtwoord,gezinslid.wachtwoord);
  
  if(!passwordValid){
    throw ServiceError.unauthorized(
      'The given email and password do not match');
  }

  return await makeLoginData(gezinslid);
};

const makeLoginData = async (gezinslid) => {
  const token = await generateJWT(gezinslid);
  return {
    token,
    gezinslid: makeExposedUser(gezinslid)
  };
};

const include = () => ({
  attributes: {
    exclude :['verjaardag_id','gezin_id']
  },
  include: [
    {
    model: getSequelize().models.GeplandeTaak,
    as: 'GeplandeTaken',
    attributes: ['naam','dag']
    // through enkel gebruiken voor tussentabellen  
    // through: { attributes: []},
    },
    {
    model: getSequelize().models.Verjaardag,
    as: 'Verjaardag',
    attributes: ['dagnummer','maandnummer']
    },
    {
    model: getSequelize().models.Gezin,
    as: 'Gezin',
    attributes: ['id', 'familienaam']
    }
          ]
});

const getAllGezinsleden = async () => {
  const items = await getSequelize().models.Gezinslid.findAll(include());
  return{
    items,
    // items: items.map(makeExposedUser),
    count: items.length,
  }; 
};

const getGezinslidById = async (id) => {
  const gezinslid = await getSequelize().models.Gezinslid.findByPk(id,include());
  if(!gezinslid){
    throw ServiceError.notFound(`Er bestaat geen gezinslid met id ${id}`, { id });
  }
  return gezinslid;
};
// const getAllGezinsledenByGezinsId = async (id) => {
//   const gezinsleden = await (gezinsledenRepo.findAllGezinsledenByGezinsId(id));
//   if (!gezinsleden) {
//     throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
//   }
//   return gezinsleden;
// };

const createGezinslid = async ({voornaam, email, gezin_id, verjaardag_id}) => {

  const bestaandGezin = await gezinService.getGezinById(gezin_id);
  const bestaandeVerjaardag = await verjaardagService.getVerjaardagById(verjaardag_id);

  if(!bestaandGezin){
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  } 
  if(!bestaandeVerjaardag){
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
  }
  try{
    const gezinslid = await getSequelize().models.Gezinslid.create({
      voornaam, email, gezin_id, verjaardag_id, roles: JSON.stringify([Role.USER]),
    }); 
    return await getGezinslidById(gezinslid.id);
  }catch (error) {
    getLogger().error('Fout bij het maken van het gezinslid')
    throw handleDBError(error);
  }
};

const updateGezinslidById = async (id,{voornaam, email, gezin_id, verjaardag_id}) => {

  if(gezin_id){
    const bestaandGezin = await gezinService.getGezinById(gezin_id);
    if(!bestaandGezin){
      getLogger().error("Gezin niet gevonden");
      throw ServiceError.notFound(`Er is geen gezin met id ${gezin_id}.`,{gezin_id});
    }
  }
  if(verjaardag_id){
    const geldigeVerjaardag = await verjaardagService.getVerjaardagById(verjaardag_id);
    if(!geldigeVerjaardag){
      getLogger().error("Verjaardag ongeldig")
      throw ServiceError.notFound(`Er is geen verjaardag met id ${verjaardag_id}.`,{verjaardag_id});
      
    }
  }
  try{
    const gezinslid = await getGezinslidById(id);

    await gezinslid.set({
      voornaam, email, gezin_id, verjaardag_id
    });
    await gezinslid.save();
    return await getGezinslidById(gezinslid.id);
  }catch (error) {
    getLogger().error('Fout bij het maken van het gezinslid')
    throw handleDBError(error);
  }
};
const deleteGezinslidById = async (id) => {
  try {
    const gezinslid = await getGezinslidById(id);
    await gezinslid.destroy();

  } catch (error) {
    getLogger().error("Fout bij het verwijderen van het gezinslid")
    throw handleDBError(error);
  }
};

// Wanneer je registreert moet er nog geen verjaardag zijn aangemaakt, dit gebeurt in deze methode
const register = async ({voornaam,wachtwoord,email,gezin_id, dagnummer, maandnummer }) => {
try{
  const password_hash = await hashPassword(wachtwoord);
  const gezin = await getSequelize().models.Gezin.findByPk(gezin_id);
  if (!gezin){
    throw ServiceError.notFound(`Er bestaat nog geen gezin met id ${id}`, { id });

  } 
  const verjaardag = await getSequelize().models.Verjaardag.create({
    voornaam,
    dagnummer,
    maandnummer
  })
  const gezinslid = await getSequelize().models.Gezinslid.create({ 
      voornaam,
      wachtwoord: password_hash,
      email,
      roles: JSON.stringify([Role.USER]),
      gezin_id: gezin.id,
      verjaardag_id: verjaardag.id
    });
  // Not sure to use the setter or use id as argument for create method
  // await gezinslid.setGezin(gezin_id)
  return await makeLoginData(gezinslid);
  } catch (error){
  getLogger().error('Error creating user', {error});
  throw handleDBError(error);
  }
};

module.exports = {
  checkAndParseSession,
  checkRole,
  register,
  login,
  getAllGezinsleden,
  getGezinslidById,
  // getAllGezinsledenByGezinsId,
  createGezinslid,
  updateGezinslidById,
  deleteGezinslidById,
}
