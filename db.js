import { Sequelize } from "sequelize";
const sequelize = new Sequelize("my_database", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
});
export { sequelize };
