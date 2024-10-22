import { sequelize } from "../db.js";
const  States = sequelize.define('states',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER
    },
    code: sequelize.Sequelize.STRING,
    name: sequelize.Sequelize.STRING
  }, {
    sequelize,
    modelName: 'states',
  });

  export default States