import { isArray } from 'lodash';
import { Op } from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
import { MEMBER } from '../constants';
import { ProjectService } from '../services';
import ForumService from '../services/forum.service';
import { isEmpty } from '../utils/helper';


interface ForumCommentsAttributes {
  id: number;
  forum_id: number;
  member_id: number;
  text: string;
  source_type: string;
  source_id: number;
  parent_id: number;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ForumCommentsInput extends Optional<ForumCommentsAttributes, 'id'> {

}
export interface ForumCommentsOutput extends Required<ForumCommentsAttributes> { }

class ForumComments extends Model<ForumCommentsAttributes, ForumCommentsInput> implements ForumCommentsAttributes {
  public id!: number;
  public forum_id!: number;
  public member_id!: number;
  public text!: string;
  public source_type!: string;
  public source_id!: number;
  public parent_id!: number;
  public status!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ForumComments.init({
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
  member_id: {
    type: DataTypes.INTEGER,
    references: { model: 'member', key: 'id' },
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  },
  text: {
    type: DataTypes.TEXT
  },
  source_type: {
    type: DataTypes.STRING
  },
  source_id: {
    type: DataTypes.INTEGER
  },
  parent_id: {
    type: DataTypes.INTEGER
  },
  status: {
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
  hooks: {
    beforeCreate(book, options) {
      book.status = ForumService.STATUS_PUBLIC;
    },
    beforeFind(options: any) {
      if (isEmpty(options.where) || (isEmpty(options.where.status))) {
        options.where.status = {
          [Op.ne]: ProjectService.STATUS_DELETED
        }
      }
    },
    // async afterFind(data: any) {
    //   let forum: any = [];
    //   if (!isArray(data)) {
    //     forum.push(data);
    //   } else {
    //     forum = data;
    //   }

    //   return data.map(async (item: any) => {
    //     let profile: any = await this.profileService.findProfile({
    //       where: { member_id: item.member_id }
    //     }, MEMBER.SIDE_CHARACTER)
    //     item.name = (isEmpty(item.member.name) && !isEmpty(profile)) ? profile.nick_name : item.member.name
    //   })
    // }
  },
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'forum_comments',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ForumComments

