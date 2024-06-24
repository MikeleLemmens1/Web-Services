const config = require('config'); 
const argon2 = require('argon2'); 

const ARGON_SALT_LENGTH = config.get('auth.argon.saltLength'); 
const ARGON_HASH_LENGTH = config.get('auth.argon.hashLength'); 
const ARGON_TIME_COST = config.get('auth.argon.timeCost'); 
const ARGON_MEMORY_COST = config.get('auth.argon.memoryCost');

const hashPassword = async (wachtwoord) => {
  const passwordHash = await argon2.hash(wachtwoord, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  });

  return passwordHash;
};

const verifyPassword = async (wachtwoord, wachtwoordHash) => {
  const valid = await argon2.verify(wachtwoordHash, wachtwoord, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  });

  return valid;
};


module.exports = {
  hashPassword,
  verifyPassword,
};