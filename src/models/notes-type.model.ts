import { DataTypes, Model } from "sequelize";
import db from "../DBConfig";

export enum notesTypes {
  CONGRATS = "congrats",
  INVITATION = "invitation",
  REMINDER = "reminder",
}

class NoteTypes extends Model {}

NoteTypes.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM(...Object.values(notesTypes)) },
    disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize: db, tableName: "NotesTypes" }
);

export { NoteTypes };
