import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
import { getFilePath } from '../utils/helper';

interface sideCharacterProfilePortfolioAttributes {
  id: number;
  side_character_profile_id: number;
  file_name: string;
  original_file_name: string;
  file_type: string;
  file_path: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface sideCharacterProfilePortfolioInput extends Optional<sideCharacterProfilePortfolioAttributes, 'id'> {

}
export interface sideCharacterProfilePortfolioOutput extends Required<sideCharacterProfilePortfolioAttributes> { }

class sideCharacterProfilePortfolio extends Model<sideCharacterProfilePortfolioAttributes, sideCharacterProfilePortfolioInput> implements sideCharacterProfilePortfolioAttributes {
  public id!: number;
  public side_character_profile_id!: number;
  public file_name!: string;
  public original_file_name!: string;
  public file_type!: string;
  public file_path!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

sideCharacterProfilePortfolio.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  side_character_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: 'sideCharacterProfile', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const file_path = this.getDataValue('file_path');
      return file_path ? getFilePath(file_path) : file_path;
    }
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
  tableName: 'side_character_profile_portfolio',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default sideCharacterProfilePortfolio
