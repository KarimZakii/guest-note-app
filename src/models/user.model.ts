import { DataTypes, Model } from "sequelize";
import db from "../DBConfig";
import Notes from "./notes.model";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public profilePicUrl!: string;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // pw min len 8
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profilePicURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { sequelize: db, tableName: "users" }
);

User.hasMany(Notes);

export default User;
