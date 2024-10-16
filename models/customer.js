import { sequelize } from "../db.js";
const Customer = sequelize.define(
  "customers",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.Sequelize.INTEGER,
    },
    username: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
        },
      },
    },
    password: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be between 8 and 100 characters",
        },
        notEmpty: {
          msg: "Password cannot be empty",
        },
      },
    },
    refreshToken: {
      type: sequelize.Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: "Customer",
  }
);

export default Customer;
