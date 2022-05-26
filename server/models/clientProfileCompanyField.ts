import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ClientProfileCompanyFieldAttributes {
  id: number;
  client_profile_company_id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileCompanyFieldInput extends Optional<ClientProfileCompanyFieldAttributes, 'id'> {

}
export interface ClientProfileCompanyFieldOutput extends Required<ClientProfileCompanyFieldAttributes> { }

class ClientProfileCompanyField extends Model<ClientProfileCompanyFieldAttributes, ClientProfileCompanyFieldInput> implements ClientProfileCompanyFieldAttributes {
  public id!: number;
  public client_profile_company_id!: number;
  public name!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileCompanyField.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_profile_company_id: {
    type: DataTypes.INTEGER,
    references: { model: 'clientProfileCompany', key: 'id' },
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
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'client_profile_company_field',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileCompanyField
