"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DBConfig_1 = __importDefault(require("../DBConfig"));
const notes_type_model_1 = require("./notes-type.model");
class Notes extends sequelize_1.Model {
}
Notes.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    noteMediaFiles: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    seen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { sequelize: DBConfig_1.default, tableName: "notes" });
Notes.belongsTo(notes_type_model_1.NoteTypes);
notes_type_model_1.NoteTypes.hasMany(Notes);
exports.default = Notes;
