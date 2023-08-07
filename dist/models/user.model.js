"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DBConfig_1 = __importDefault(require("../DBConfig"));
const notes_model_1 = __importDefault(require("./notes.model"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    // pw min len 8
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    profilePicURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    notifications: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, { sequelize: DBConfig_1.default, tableName: "users" });
User.hasMany(notes_model_1.default);
exports.default = User;
