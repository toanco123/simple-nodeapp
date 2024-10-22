import { sequelize } from "../db.js";
const Subdivision = sequelize.define('subdivisions',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER
    },
    code: sequelize.Sequelize.STRING,
    name: sequelize.Sequelize.STRING,
    emoji: sequelize.Sequelize.STRING
  }, {
    sequelize,
    modelName: 'subdivisions',
  });

  export default Subdivision