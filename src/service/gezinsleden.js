/**
 * Service for gezinslid related REST operations.
 * @module service/gezinsleden
 */

const verjaardagService = require('./verjaardagen');
const gezinService = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');
const Role = require('../core/roles');
const { getLogger } = require('../core/logging')
const { hashPassword, verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');

/**
 * Check if the given authHeader is valid and parse the session data.
 * @param {string} authHeader
 * @returns {Promise<{roles: string[], gezinslid_id: number, gezin_id: number, authToken: string}>}
 * @throws ServiceError.unauthorized if the authHeader is invalid or the gezinslid no longer exists.
 */
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
/**
 * Check if the given gezinslid has the given role.
 * @param {string} role
 * @param {string[]} roles
 * @returns {void}
 * @throws ServiceError.forbidden if the user does not have the given role.
 */
const checkRole = (role,roles) => {
  const hasPermission = roles.includes(role);

  if(!hasPermission){
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application');
  }
};
/**
 * expose only the necessary gezinslid data
 * @param {number} id
 * @param {string} voornaam
 * @param {string} email
 * @param {string[]} roles
 * @returns {ExposedUser}
 */
const makeExposedUser = ({id,voornaam,email,roles}) => ({
  id,
  voornaam,
  email,
  roles,
});


/**
 * Login a gezinslid.
 * @param {string} email
 * @param {string} wachtwoord
 * @returns {Promise<{token: string, user: ExposedUser}>}
 * @throws ServiceError.unauthorized if the given password does not match the gezinslids password.
 * @throws ServiceError.unauthorized if the given email does not match the gezinslids email.
 */
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
/**
 * make a login data object for the given gezinslid
 * @param {Gezinslid} gezinslid
 * @returns {Promise<{token: string, user: ExposedUser}>}
 */
const makeLoginData = async (gezinslid) => {
  const token = await generateJWT(gezinslid);
  return {
    token,
    gezinslid: makeExposedUser(gezinslid)
  };
};

/**
 * Displays the following attributes:
 * Geplande Taken (naam, dag)
 * Gezin (id, familienaam)
 * Verjaardag (dagnummer, maandnummer)
 */
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

/**
 * Get all gezinsleden (only for admin)
 * @returns {Promise<{items: ExposedUser[], count: number}>}
 */
const getAllGezinsleden = async () => {
  const items = await getSequelize().models.Gezinslid.findAll(include());
  return{
    items,
    count: items.length,
  }; 
};
/**
 * Get gezinslid by id.
 * @param {number} id
 * @returns {Promise<Gezinslid>}
 * @throws ServiceError.NOT_FOUND if no user with the given id exists.
 */
const getGezinslidById = async (id) => {
  const gezinslid = await getSequelize().models.Gezinslid.findByPk(id,include());
  if(!gezinslid){
    throw ServiceError.notFound(`Er bestaat geen gezinslid met id ${id}`, { id });
  }
  return gezinslid;
};

/**
 * Create a gezinslid without registering.
 * @param {string} voornaam
 * @param {string} email
 * @param {number} gezin_id
 * @param {number} verjaardag_id
 * @returns {Promise<Gezinslid>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given gezin_id exists.
 * @throws ServiceError.NOT_FOUND if no verjaardag with the given verjaardag_id exists.
 */
const createGezinslid = async ({voornaam, email, gezin_id, verjaardag_id}) => {

  await gezinService.getGezinById(gezin_id);
  await verjaardagService.getVerjaardagById(verjaardag_id);

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
/**
 * Modify an existing gezinslid by id.
 * @param {number} id
 * @param {string} voornaam
 * @param {string} email
 * @param {number} gezin_id
 * @param {number} verjaardag_id
 * @returns {Promise<Gezinslid>}
 * @throws ServiceError.NOT_FOUND if no gezinslid with the given id exists.
 * @throws ServiceError.NOT_FOUND if no gezin with the given gezin_id exists.
 * @throws ServiceError.NOT_FOUND if no verjaardag with the given verjaardag_id exists.
 */
const updateGezinslidById = async (id,{voornaam, email, gezin_id, verjaardag_id}) => {

  if(gezin_id){
    await gezinService.getGezinById(gezin_id);
  }
  if(verjaardag_id){
    await verjaardagService.getVerjaardagById(verjaardag_id);
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

/**
 * Delete an existing gezinslid
 * @param {number} id 
 * @throws ServiceError.NOT_FOUND if no gezinslid with the given id exists.
 */
const deleteGezinslidById = async (id) => {
  try {
    const gezinslid = await getGezinslidById(id);
    await gezinslid.destroy();

  } catch (error) {
    getLogger().error("Fout bij het verwijderen van het gezinslid")
    throw handleDBError(error);
  }
};

/**
 * Create and register a gezinslid. This method creates a new verjaardag as well.
 * @param {string} voornaam
 * @param {string} wachtwoord
 * @param {string} email
 * @param {number} gezin_id
 * @param {number} dagnummer
 * @param {number} maandnummer
 * @returns {Promise<Gezinslid>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given gezin_id exists.
 */
const register = async ({voornaam,wachtwoord,email,gezin_id, dagnummer, maandnummer }) => {
try{
  const password_hash = await hashPassword(wachtwoord);
  const gezin = gezinService.getGezinById(gezin_id);
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
  createGezinslid,
  updateGezinslidById,
  deleteGezinslidById,
}
