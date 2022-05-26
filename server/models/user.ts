import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  user_name: string;
  password: string;
  phone: string;
  employee_type: string;
  login_type: string;
  role: string;
  status: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'password'> { }
export interface UserOutput extends Required<UserAttributes> { }

export type Users = User[];

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public user_name!: string;
  public password!: string;
  public phone!: string;
  public employee_type!: string;
  public login_type!: string;
  public role!: string;
  public status!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  user_name: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  employee_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'freelancer', 'dispatch'),
  },
  login_type: {
    type: DataTypes.ENUM('google', 'facebook', 'naver', 'kakaotalk', 'apple', 'website'),
  },
  role: {
    type: DataTypes.ENUM('supar-admin', 'admin'),
  },
  status: {
    type: DataTypes.ENUM('enable', 'disable', 'deleted'),
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'user',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User
