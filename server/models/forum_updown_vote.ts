import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
interface ForumUpDownVoteAttributes {
  id: number;
  member_id: number;
  forum_id:number;
  vote_type: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ForumUpDownVoteInput extends Optional<ForumUpDownVoteAttributes, 'id'> {

}
export interface ForumUpDownVoteOutput extends Required<ForumUpDownVoteAttributes> { }

class ForumUpDownVote extends Model<ForumUpDownVoteAttributes, ForumUpDownVoteInput> implements ForumUpDownVoteAttributes {
  public id!: number;
  public member_id!: number;
  public forum_id!: number;
  public vote_type!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ForumUpDownVote.init({
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
  forum_id: {
    type: DataTypes.INTEGER,
    references: { model: 'forum', key: 'id' },
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  },
  vote_type: {
    type: DataTypes.NUMBER
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
  tableName: 'forum_updown_votes',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ForumUpDownVote
