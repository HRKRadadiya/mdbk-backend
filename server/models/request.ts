import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface RequestAttributes {
  id: number;
  from_member_id: number;
  to_member_id: number;
  request_type: string;
  wage_type: string;
  amount: number;
  is_negotiable: string;
  message_id: number;
  status: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface RequestInput extends Optional<RequestAttributes, 'id'> {

}
export interface RequestOutput extends Required<RequestAttributes> { }

class Request extends Model<RequestAttributes, RequestInput> implements RequestAttributes {
  public id!: number;
  public from_member_id!: number;
  public to_member_id!: number;
  public request_type!: string;
  public wage_type!: string;
  public amount!: number;
  public is_negotiable!: string;
  public message_id!: number;
  public status!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Request.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  from_member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  to_member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  request_type: {
    type: DataTypes.ENUM('contact-information', 'interview'),
  },
  wage_type: {
    type: DataTypes.ENUM('hourly', 'daily', 'monthly'),
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  is_negotiable: {
    type: DataTypes.ENUM('yes', 'no'),
  },
  message_id: {
    type: DataTypes.INTEGER,
    references: { model: 'message', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  status: {
    type: DataTypes.ENUM('accepted', 'rejected', 'waiting', 'accept'),
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
  tableName: 'request',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Request
