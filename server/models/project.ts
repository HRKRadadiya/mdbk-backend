import { DataTypes, Model, Op, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
import { ProjectService } from '../services';
import { isEmpty } from '../utils/helper';

interface ProjectAttributes {
  id: number;
  member_id: number;
  profession: string;
  field: string;
  current_planning_stage: string;
  suggested_amount: number;
  is_negotiable: string;
  schedule: string;
  schedule_direct_start_date: Date;
  schedule_direct_end_date: Date;
  city: string;
  district: string;
  work_related_details: string;
  status: string;
  direct_input: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectInput extends Optional<ProjectAttributes, 'id'> {

}
export interface ProjectOutput extends Required<ProjectAttributes> { }

class Project extends Model<ProjectAttributes, ProjectInput> implements ProjectAttributes {
  public id!: number;
  public member_id!: number;
  public profession!: string;
  public field!: string;
  public current_planning_stage!: string;
  public suggested_amount!: number;
  public is_negotiable!: string;
  public schedule!: string;
  public schedule_direct_start_date!: Date;
  public schedule_direct_end_date!: Date;
  public city!: string;
  public district!: string;
  public work_related_details!: string;
  public status!: string;
  public direct_input!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  profession: {
    type: DataTypes.ENUM('development', 'design', 'marketing', 'other'),
  },
  field: {
    type: DataTypes.STRING,
    allowNull: true
  },
  current_planning_stage: {
    type: DataTypes.ENUM('idea-ready', 'content-organization-complete', 'detailed-plan-ready', 'other'),
  },
  suggested_amount: {
    type: DataTypes.DECIMAL
  },
  is_negotiable: {
    type: DataTypes.ENUM('yes', 'no'),
    defaultValue: 'no'
  },
  schedule: {
    type: DataTypes.ENUM('negotiable', 'asap', 'not-hurry', 'direct'),
  },
  schedule_direct_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  schedule_direct_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING
  },
  district: {
    type: DataTypes.STRING
  },
  work_related_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING
  },
  direct_input: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  hooks: {
    beforeCreate(book, options) {
      book.status = ProjectService.STATUS_ENABLE;
    },
    beforeFind(options: any) {
      // if (isEmpty(options.where.status)) {
      options.where = { ...options.where, status: ProjectService.STATUS_ENABLE }
      // }
    },
    beforeCount(options: any) {
      // if (isEmpty(options.where) && isEmpty(options.where.status)) {
      // options.where.status = ProjectService.STATUS_ENABLE
      options.where = { ...options.where, status: ProjectService.STATUS_ENABLE }
      options.distinct = true
      // }
    }
  },
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'project',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Project
