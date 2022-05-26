import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface SearchOptionLocationAttributes {
  id: number;
  search_option_id: number;
  city: string;
  district: string;
  country: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface SearchOptionLocationInput extends Optional<SearchOptionLocationAttributes, 'id'> {

}
export interface SearchOptionLocationOutput extends Required<SearchOptionLocationAttributes> { }

class SearchOptionLocation extends Model<SearchOptionLocationAttributes, SearchOptionLocationInput> implements SearchOptionLocationAttributes {
  public id!: number;
  public search_option_id!: number;
  public city!: string;
  public district!: string;
  public country!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SearchOptionLocation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  search_option_id: {
    type: DataTypes.INTEGER,
    references: { model: 'searchOption', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  city: {
    type: DataTypes.STRING
  },
  district: {
    type: DataTypes.STRING
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
  tableName: 'search_option_location',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SearchOptionLocation
