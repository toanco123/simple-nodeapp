import { sequelize } from "../db.js";

const  Languages = sequelize.define('languages',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER
    },
    code: {
      type: sequelize.Sequelize.STRING,
    },
    name: sequelize.Sequelize.STRING,
    native: sequelize.Sequelize.STRING,
    rtl: sequelize.Sequelize.BOOLEAN
  }, {
    sequelize,
    modelName: 'languages',
  });

export default Languages;