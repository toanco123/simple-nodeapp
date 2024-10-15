// "use strict";

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert(
//       "Product",
//       [
//         {
//           name: "Product 1",
//           price: 10.99,
//           description: "Description for Product 1",
//         },
//         {
//           name: "Product 2",
//           price: 24.99,
//           description: "Description for Product 2",
//         },
//         {
//           name: "Product 3",
//           price: 15.49,
//           description: "Description for Product 3",
//         },
//         // Add more products as needed
//       ],
//       {}
//     );
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete("Product", null, {});
//   },
// };

// "use strict";
// const { faker } = require("@faker-js/faker");

// /** @type {import('sequelize-cli').Migration} */

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const productsData = [];
//     const numProducts = 15; // Number of products to generate

//     for (let i = 0; i < numProducts; i++) {
//       productsData.push({
//         name: faker.commerce.productName(),
//         price: faker.commerce.price(),
//         description: faker.commerce.productDescription(),
//       });
//     }

//     await queryInterface.bulkInsert("Product", productsData, {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete("Product", null, {});
//   },
// };

// seeders/YYYYMMDDHHMMSS-product-seed.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get Category ID from existing categories
    const category1Id = await queryInterface.rawSelect(
      "Category",
      {
        where: { name: "Category 1" },
      },
      ["id"]
    );

    const category2Id = await queryInterface.rawSelect(
      "Category",
      {
        where: { name: "Category 2" },
      },
      ["id"]
    );

    await queryInterface.bulkInsert(
      "Product",
      [
        {
          name: "Product 1",
          price: 10.99,
          description: "Description for Product 1",
          categoryId: category1Id,
        },
        {
          name: "Product 2",
          price: 24.99,
          description: "Description for Product 2",
          categoryId: category2Id,
        },
        {
          name: "Product 3",
          price: 15.99,
          description: "Description for Product 3",
          categoryId: category1Id,
        },
        {
          name: "Product 4",
          price: 29.99,
          description: "Description for Product 4",
          categoryId: category2Id,
        },
        // Add more products as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Product", null, {});
  },
};
