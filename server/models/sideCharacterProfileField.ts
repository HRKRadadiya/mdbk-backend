import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface SideCharacterProfileFieldAttributes {
  id: number;
  side_character_profile_id: number;
  name: string;


  created_at?: Date;
  updated_at?: Date;
}

export interface SideCharacterProfileFieldInput extends Optional<SideCharacterProfileFieldAttributes, 'id'> {

}
export interface SideCharacterProfileFieldOutput extends Required<SideCharacterProfileFieldAttributes> { }

class SideCharacterProfileField extends Model<SideCharacterProfileFieldAttributes, SideCharacterProfileFieldInput> implements SideCharacterProfileFieldAttributes {
  public id!: number;
  public side_character_profile_id!: number;
  public name!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SideCharacterProfileField.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  side_character_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: 'SideCharacterProfileField', key: 'id' },
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
  tableName: 'side_character_profile_field',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SideCharacterProfileField
