import { DataTypes, Model } from "sequelize";
import db from "../DBConfig";
import { NoteTypes } from "./notes-type.model";
import User from "./user.model";
class Notes extends Model {}
Notes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    noteMediaFiles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, tableName: "notes" }
);
Notes.belongsTo(NoteTypes);
NoteTypes.hasMany(Notes);

export default Notes;
