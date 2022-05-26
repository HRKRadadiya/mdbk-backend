import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ReportAttributes {
  id: number;
  source_id: number;
  report_type: string;
  member_id: number;

  created_at?: Date;
  updated_at?: Date;
}

export interface ReportInput extends Optional<ReportAttributes, 'id'> {

}
export interface ReportOutput extends Required<ReportAttributes> { }

class Report extends Model<ReportAttributes, ReportInput> implements ReportAttributes {
  public id!: number;
  public source_id!: number;
  public report_type!: string;
  public member_id!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Report.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  source_id: {
    type: DataTypes.INTEGER
  },
  report_type: {
    type: DataTypes.ENUM('request-interview', 'request-contact-information', 'side-character', 'client'),
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'report',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Report
