"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteTypes = exports.notesTypes = void 0;
const sequelize_1 = require("sequelize");
const DBConfig_1 = __importDefault(require("../DBConfig"));
var notesTypes;
(function (notesTypes) {
    notesTypes["CONGRATS"] = "congrats";
    notesTypes["INVITATION"] = "invitation";
    notesTypes["REMINDER"] = "reminder";
})(notesTypes || (exports.notesTypes = notesTypes = {}));
class NoteTypes extends sequelize_1.Model {
}
exports.NoteTypes = NoteTypes;
NoteTypes.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: sequelize_1.DataTypes.ENUM(...Object.values(notesTypes)) },
    disabled: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize: DBConfig_1.default, tableName: "NotesTypes" });
