import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface BCoinPackagesAttributes {
  id: number;
  name: string;
  price: number;
  coins: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface BCoinPackagesInput extends Optional<BCoinPackagesAttributes, 'id'> {

}
export interface BCoinPackagesOutput extends Required<BCoinPackagesAttributes> { }

class BCoinPackages extends Model<BCoinPackagesAttributes, BCoinPackagesInput> implements BCoinPackagesAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public coins!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BCoinPackages.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.INTEGER
  },
  coins: {
    type: DataTypes.INTEGER
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
  tableName: 'b_coin_packages',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default BCoinPackages