import { sequelize } from "../db.js";

const Country = sequelize.define(
  "countries",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER,
    },
    name: sequelize.Sequelize.STRING,
    code: sequelize.Sequelize.STRING,
  },
  {
    sequelize,
    modelName: "Country",
  }
);

export default Country;
