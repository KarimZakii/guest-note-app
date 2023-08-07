"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize({
    username: "root",
    password: "password",
    database: "guest-note-app",
    dialect: "mysql",
    host: "localhost",
});
exports.default = db;
