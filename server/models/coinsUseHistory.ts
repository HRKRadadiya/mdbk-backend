import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface CoinsUseHistoryAttributes {
  id: number;
  member_id: number;
  coins: number;
  event_type: string;
  details: string;
  profile_id: string;
  profile_type: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface CoinsUseHistoryInput extends Optional<CoinsUseHistoryAttributes, 'id'> {

}
export interface CoinsUseHistoryOutput extends Required<CoinsUseHistoryAttributes> { }

class CoinsUseHistory extends Model<CoinsUseHistoryAttributes, CoinsUseHistoryInput> implements CoinsUseHistoryAttributes {
  public id!: number;
  public member_id!: number;
  public coins!: number;
  public event_type!: string;
  public details!: string;
  public profile_id!: string;
  public profile_type!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CoinsUseHistory.init({
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
  coins: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_id: {
    type: DataTypes.INTEGER
  },
  profile_type: {
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
  tableName: 'coins_use_history',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default CoinsUseHistory
