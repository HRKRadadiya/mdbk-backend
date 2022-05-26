import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface PaymentHistoryAttributes {
  id: number;
  member_id: number;
  transaction_id: string;
  amount: number;
  coins: number;
  use: number;
  status: string;
  payment_type?: string;
  profile_id: string;
  profile_type: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentHistoryInput extends Optional<PaymentHistoryAttributes, 'id' | 'payment_type' | 'use'> {

}
export interface PaymentHistoryOutput extends Required<PaymentHistoryAttributes> { }

class PaymentHistory extends Model<PaymentHistoryAttributes, PaymentHistoryInput> implements PaymentHistoryAttributes {
  public id!: number;
  public member_id!: number;
  public transaction_id!: string;
  public amount!: number;
  public coins!: number;
  public use!: number;
  public status!: string;
  public payment_type!: string;
  public profile_id!: string;
  public profile_type!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PaymentHistory.init({
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
  transaction_id: {
    type: DataTypes.STRING
  },
  amount: {
    type: DataTypes.INTEGER
  },
  coins: {
    type: DataTypes.INTEGER
  },
  use: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'fail'),
  },
  payment_type: {
    type: DataTypes.ENUM('purchase', 'bonus'),
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
  tableName: 'payment_history',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default PaymentHistory
