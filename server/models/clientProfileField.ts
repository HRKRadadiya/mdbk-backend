import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ClientProfileFieldAttributes {
  id: number;
  client_profile_id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileFieldInput extends Optional<ClientProfileFieldAttributes, 'id'> {

}
export interface ClientProfileFieldOutput extends Required<ClientProfileFieldAttributes> { }

class ClientProfileField extends Model<ClientProfileFieldAttributes, ClientProfileFieldInput> implements ClientProfileFieldAttributes {
  public id!: number;
  public client_profile_id!: number;
  public name!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileField.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: 'clientProfile', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  name: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'client_profile_field',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileField
