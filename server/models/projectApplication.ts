import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ProjectApplicationAttributes {
  id: number;
  project_id: number;
  applicant_id: number;
  wage_type: string;
  suggested_amount: number;
  is_negotiable: string;
  message_id: number;
  status: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectApplicationInput extends Optional<ProjectApplicationAttributes, 'id'> {

}
export interface ProjectApplicationOutput extends Required<ProjectApplicationAttributes> { }

class ProjectApplication extends Model<ProjectApplicationAttributes, ProjectApplicationInput> implements ProjectApplicationAttributes {
  public id!: number;
  public project_id!: number;
  public applicant_id!: number;
  public wage_type!: string;
  public suggested_amount!: number;
  public is_negotiable!: string;
  public message_id!: number;
  public status!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProjectApplication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: { model: 'project', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  wage_type: {
    type: DataTypes.ENUM('hourly', 'daily', 'monthly'),
    allowNull: true
  },
  suggested_amount: {
    type: DataTypes.INTEGER
  },
  is_negotiable: {
    type: DataTypes.ENUM('yes', 'no'),
    defaultValue: 'no'
  },
  message_id: {
    type: DataTypes.INTEGER,
    references: { model: 'message', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  status: {
    type: DataTypes.ENUM('accepted', 'rejected', 'waiting'),
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
  tableName: 'project_application',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ProjectApplication
