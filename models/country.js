import { sequelize } from "../db.js";

const Country = sequelize.define(
  "countries",
  {
    name: sequelize.Sequelize.STRING,
    code: sequelize.Sequelize.STRING,
  },
  {
    sequelize,
    modelName: "Country",
  }
);

export default Country;
