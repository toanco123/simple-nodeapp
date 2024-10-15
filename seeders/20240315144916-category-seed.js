// seeders/YYYYMMDDHHMMSS-category-seed.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Category",
      [
        { name: "Category 1" },
        { name: "Category 2" },
        // Add more categories as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Category", null, {});
  },
};
