import { sequelize } from "../db.js";
import Continents from "./continents.js";
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
    tableName: "continents_countries_states",
  }
);

ContinentsCountriesStates.belongsTo(Continents, {foreignKey: "id_continents",as:"continent"});
ContinentsCountriesStates.belongsTo(States, { foreignKey: "id_states",as: "state" });

export default ContinentsCountriesStates;
