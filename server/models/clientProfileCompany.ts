import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ClientProfileCompanyAttributes {
  id: number;
  client_profile_id: number;
  name: string;
  introduction: string;
  contact_information: string;
  profession: string;
  registation_number: string;
  foundation_year: number;
  representative_name: string;
  total_employees: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileCompanyInput extends Optional<ClientProfileCompanyAttributes, 'id'> {

}
export interface ClientProfileCompanyOutput extends Required<ClientProfileCompanyAttributes> { }

class ClientProfileCompany extends Model<ClientProfileCompanyAttributes, ClientProfileCompanyInput> implements ClientProfileCompanyAttributes {
  public id!: number;
  public client_profile_id!: number;
  public name!: string;
  public introduction!: string;
  public contact_information!: string;
  public profession!: string;
  public registation_number!: string;
  public foundation_year!: number;
  public representative_name!: string;
  public total_employees!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileCompany.init({
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
    type: DataTypes.STRING,
    allowNull: true
  },
  introduction: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contact_information: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profession: {
    type: DataTypes.TEXT,
  },
  registation_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foundation_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  representative_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  total_employees: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  tableName: 'client_profile_company',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileCompany