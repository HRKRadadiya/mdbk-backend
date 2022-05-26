import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ClientProfileCompanyHastagAttributes {
  id: number;
  client_profile_company_id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileCompanyHastagInput extends Optional<ClientProfileCompanyHastagAttributes, 'id'> {

}
export interface ClientProfileCompanyHastagOutput extends Required<ClientProfileCompanyHastagAttributes> { }

class ClientProfileCompanyHastag extends Model<ClientProfileCompanyHastagAttributes, ClientProfileCompanyHastagInput> implements ClientProfileCompanyHastagAttributes {
  public id!: number;
  public client_profile_company_id!: number;
  public name!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileCompanyHastag.init({
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
  tableName: 'client_profile_company_hastag',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileCompanyHastag
