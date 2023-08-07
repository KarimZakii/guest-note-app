import { Sequelize } from "sequelize";

const db = new Sequelize({
  username: "root",
  password: "password",
  database: "guest-note-app",
  dialect: "mysql",
  host: "localhost",
});

export default db;
