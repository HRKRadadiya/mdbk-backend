import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
interface ForumLinkAttributes {
  id: number;
  forum_id: number;
  link: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ForumLinkInput extends Optional<ForumLinkAttributes, 'id'> {

}
export interface ForumLinkOutput extends Required<ForumLinkAttributes> { }

class ForumLink extends Model<ForumLinkAttributes, ForumLinkInput> implements ForumLinkAttributes {
  public id!: number;
  public forum_id!: number;
  public link!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ForumLink.init({
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
  link: {
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
  tableName: 'forum_link',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ForumLink

