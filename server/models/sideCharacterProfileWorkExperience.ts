import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface SideCharacterProfileWorkExperienceAttributes {
  id: number;
  side_character_profile_id: number;
  company_name: string;
  position: string;
  profession: string;
  employment_start_date: Date;
  employment_end_date: Date;
  is_employed_currently: Boolean;

  created_at?: Date;
  updated_at?: Date;
}

export interface SideCharacterProfileWorkExperienceInput extends Optional<SideCharacterProfileWorkExperienceAttributes, 'id' | 'side_character_profile_id' | 'employment_end_date' | 'is_employed_currently'> {

}
export interface SideCharacterProfileWorkExperienceOutput extends Required<SideCharacterProfileWorkExperienceAttributes> { }

class SideCharacterProfileWorkExperience extends Model<SideCharacterProfileWorkExperienceAttributes, SideCharacterProfileWorkExperienceInput> implements SideCharacterProfileWorkExperienceAttributes {
  public id!: number;
  public side_character_profile_id!: number;
  public company_name!: string;
  public position!: string;
  public profession!: string;
  public employment_start_date!: Date;
  public employment_end_date!: Date;
  public is_employed_currently!: Boolean;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SideCharacterProfileWorkExperience.init({
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
  company_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employment_start_date: {
    type: DataTypes.DATEONLY
  },
  employment_end_date: {
    type: DataTypes.DATEONLY
  },
  is_employed_currently: {
    type: DataTypes.BOOLEAN
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
  tableName: 'side_character_profile_work_experience',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SideCharacterProfileWorkExperience
