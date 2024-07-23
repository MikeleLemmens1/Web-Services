const {shutdownData, getSequelize } = require('../src/data/index');

module.exports = async () => {
  const sequelize = getSequelize();

  await sequelize.models.Boodschap.destroy({ where: {} });
  await sequelize.models.Verjaardag.destroy({ where: {} });
  await sequelize.models.GeplandeTaak.destroy({ where: {} });
  await sequelize.models.GezinVerjaardag.destroy({ where: {} });
  await sequelize.models.Gezinslid.destroy({ where: {} });
  await sequelize.models.Gezin.destroy({ where: {} });

  await shutdownData();
}