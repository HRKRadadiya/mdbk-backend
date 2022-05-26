import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface SearchOptionAttributes {
  id: number;
  member_id: number;
  search_type: string;
  desired_profession: string;
  desired_date: string;
  desired_time: string;
  desired_project_type: string;
  insurance_status: string;
  desired_work_type: string;
  registration_type: string;
  is_company: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface SearchOptionInput extends Optional<SearchOptionAttributes, 'id'> {

}
export interface SearchOptionOutput extends Required<SearchOptionAttributes> { }

class SearchOption extends Model<SearchOptionAttributes, SearchOptionInput> implements SearchOptionAttributes {
  public id!: number;
  public member_id!: number;
  public search_type!: string;
  public desired_profession!: string;
  public desired_date!: string;
  public desired_time!: string;
  public desired_project_type!: string;
  public insurance_status!: string;
  public desired_work_type!: string;
  public registration_type!: string;
  public is_company!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SearchOption.init({
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
  search_type: {
    type: DataTypes.ENUM('client', 'side-character'),
  },
  desired_profession: {
    type: DataTypes.ENUM('development', 'design', 'marketing', 'other'),
  },
  desired_date: {
    type: DataTypes.ENUM('weekdays', 'weekend', 'weekdays-weekend'),
  },
  desired_time: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
  },
  desired_project_type: {
    type: DataTypes.ENUM('short-term', 'long-term'),
  },
  insurance_status: {
    type: DataTypes.ENUM('available', 'unavailable'),
  },
  desired_work_type: {
    type: DataTypes.ENUM('workfrom-office', 'workfrom-home'),
  },
  registration_type: {
    type: DataTypes.ENUM('side_character', 'client'),
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_company: {
    type: DataTypes.ENUM('yes', 'no'),
    defaultValue: 'no'
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'search_option',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SearchOption
