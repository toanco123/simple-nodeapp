import { sequelize } from "../db.js";
import Continents from "./continents.js";
import Country from "./country.js";
import States from "./states.js";

const ContinentsCountriesStates = sequelize.define(
  "continents_countries_states",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER,
    },
    id_countries: sequelize.Sequelize.INTEGER,
    id_continents: sequelize.Sequelize.INTEGER,
    id_states: sequelize.Sequelize.INTEGER,
  },
  {
    sequelize,
    modelName: "continents_countries_states",
  }
);

ContinentsCountriesStates.belongsTo(Country, { foreignKey: "id_countries" });
ContinentsCountriesStates.belongsTo(Continents, {
  foreignKey: "id_continents",
});
ContinentsCountriesStates.belongsTo(States, { foreignKey: "id_states" });

export default ContinentsCountriesStates;
