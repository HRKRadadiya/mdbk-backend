import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ForumImageAttributes {
  id: number;
  forum_id: number;
  file_name: string;
  original_file_name: string;
  file_type: string;
  file_path: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface ForumImageInput extends Optional<ForumImageAttributes, 'id'> {

}
export interface ForumImageOutput extends Required<ForumImageAttributes> { }

class ForumImage extends Model<ForumImageAttributes, ForumImageInput> implements ForumImageAttributes {
  public id!: number;
  public forum_id!: number;
  public file_name!: string;
  public original_file_name!: string;
  public file_type!: string;
  public file_path!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ForumImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  forum_id: {
    type: DataTypes.INTEGER,
    references: { model: 'forum', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'forum_image',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ForumImage
