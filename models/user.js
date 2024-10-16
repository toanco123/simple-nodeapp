import { sequelize } from "../db.js";
const User = sequelize.define("Users",{
    // userName: {
    //   type: DataTypes.STRING,
    //   field: 'username',  // Tên cột trong database
    // },
    username: sequelize.Sequelize.STRING,
    password: sequelize.Sequelize.STRING
  }, {
    sequelize,
    modelName: 'User',
  });


export default User