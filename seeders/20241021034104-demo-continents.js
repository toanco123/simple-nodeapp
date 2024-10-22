module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Continents', [
      {
        code: 'NA',
        name: 'North America',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Continents', null, {});
  },
};