import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
interface ForumHashtagAttributes {
  id: number;
  forum_id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ForumHashtagInput extends Optional<ForumHashtagAttributes, 'id'> {

}
export interface ForumHashtagOutput extends Required<ForumHashtagAttributes> { }

class ForumHashtag extends Model<ForumHashtagAttributes, ForumHashtagInput> implements ForumHashtagAttributes {
  public id!: number;
  public forum_id!: number;
  public name!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ForumHashtag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  forum_id: {
    type: DataTypes.INTEGER,
    references: { model: 'forum', key: 'id' },
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
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
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'forum_hashtag',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ForumHashtag

