import { Op } from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
import { ProjectService } from '../services';
import ForumService from '../services/forum.service';
import { isEmpty } from '../utils/helper';
interface ForumAttributes {
  id: number;
  member_id: number;
  parent_id: number;
  text: string;
  link: string;
  category: string;
  status: string;
  source_type: string;
  source_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ForumInput extends Optional<ForumAttributes, 'id'> {

}
export interface ForumOutput extends Required<ForumAttributes> { }

class Forum extends Model<ForumAttributes, ForumInput> implements ForumAttributes {
  public id!: number;
  public member_id!: number;
  public parent_id!: number;
  public text!: string;
  public link!: string;
  public category!: string;
  public status!: string;
  public source_type!: string;
  public source_id!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Forum.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  },
  text: {
    type: DataTypes.TEXT
  },
  link: {
    allowNull: true,
    type: DataTypes.STRING
  },
  parent_id: {
    type: DataTypes.INTEGER
  },
  category: {
    allowNull: true,
    type: DataTypes.ENUM('development', 'design', 'marketing', 'other'),
  },
  status: {
    type: DataTypes.STRING
  },
  source_type: {
    type: DataTypes.STRING
  },
  source_id: {
    type: DataTypes.INTEGER
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
    beforeCreate(book) {
      if (isEmpty(book.status)) {
        book.status = ForumService.STATUS_PUBLIC;
      }
    },
    beforeFind(options: any) {
      if (isEmpty(options.where) || (isEmpty(options.where.status))) {
        options.where.status = {
          [Op.ne]: ProjectService.STATUS_DELETED
        }
      }

    }
  },
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'forum',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Forum
