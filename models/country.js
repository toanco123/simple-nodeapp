import { sequelize } from "../db.js";
import Languages from "./languages.js";
import Subdivision from "./subdivision.js";
import ContinentsCountriesStates from "./continents_countries_states.js";

const Country = sequelize.define(
  "countries",
  {
    id: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    awsRegion: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
    },
    capital: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    code: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    currencies: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true,
    },
    currency: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    emoji: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    emojiU: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    name: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    native: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    },
    phones: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true,
    },
    subdivisions_id: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true,
    },
    languages_id: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Country",
  }
);

Country.belongsTo(Subdivision,{
  foreignKey: 'subdivisions_id',
})

Country.belongsTo(Languages,{
  foreignKey: 'languages_id',
  as: "language",
})

Country.hasMany(ContinentsCountriesStates, { foreignKey: "id_countries" });


// Country.belongsToMany(Continents, {
//   through: ContinentsCountriesStates,
//   foreignKey: "id_countries",
//   otherKey: "id_continents",
//   as: "continents"
// });

export default Country;
