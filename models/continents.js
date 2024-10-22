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

export default Continents;
