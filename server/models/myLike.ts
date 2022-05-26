import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface MyLikeAttributes {
  id: number;
  source_id: number;
  like_type: string;
  member_id: number;

  created_at?: Date;
  updated_at?: Date;
}

export interface MyLikeInput extends Optional<MyLikeAttributes, 'id'> {

}
export interface MyLikeOutput extends Required<MyLikeAttributes> { }

class MyLike extends Model<MyLikeAttributes, MyLikeInput> implements MyLikeAttributes {
  public id!: number;
  public source_id!: number;
  public like_type!: string;
  public member_id!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

MyLike.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  source_id: {
    type: DataTypes.INTEGER
  },
  like_type: {
    type: DataTypes.ENUM('project', 'side-character', 'client'),
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
  tableName: 'my_like',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default MyLike
