import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ClientProfileLocationAttributes {
  id: number;
  client_profile_id: number;
  city: string;
  district: string;
  country: string;


  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileLocationInput extends Optional<ClientProfileLocationAttributes, 'id'> {

}
export interface ClientProfileLocationOutput extends Required<ClientProfileLocationAttributes> { }

class ClientProfileLocation extends Model<ClientProfileLocationAttributes, ClientProfileLocationInput> implements ClientProfileLocationAttributes {
  public id!: number;
  public client_profile_id!: number;
  public city!: string;
  public district!: string;
  public country!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileLocation.init({
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
  city: {
    type: DataTypes.STRING,
    get() {
      const city = this.getDataValue('city');
      return parseInt(city);
    }
  },
  district: {
    type: DataTypes.STRING,
    get() {
      const district = this.getDataValue('district');
      return parseInt(district);
    }
  },
  country: {
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
  tableName: 'client_profile_location',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileLocation
