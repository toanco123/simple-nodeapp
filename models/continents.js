import { sequelize } from "../db.js";

const Continents = sequelize.define(
  "continents",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER,
    },
    code: {
      type: sequelize.Sequelize.STRING,
    },
    name: sequelize.Sequelize.STRING,
  },
  {
    sequelize,
    modelName: "Continents",
  }
);

// Continents.belongsToMany(Country, {
//   through: ContinentsCountriesStates,
//   foreignKey: "id_continents",
//   otherKey: "id_countries",
//   as: "countries"
// });

// Continents.hasMany(ContinentsCountriesStates, {foreignKey: "id_continents"});


export default Continents;
