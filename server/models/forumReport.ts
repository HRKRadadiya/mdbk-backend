import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ForumReportAttributes {
    id: number;
    source_id: number;
    report_type: string;
    member_id: number;
    profile_type: string,
    category: string,
    profile_id: number,

    created_at?: Date;
    updated_at?: Date;
}

export interface ForumReportInput extends Optional<ForumReportAttributes, 'id'> {

}
export interface ForumReportOutput extends Required<ForumReportAttributes> { }

class ForumReport extends Model<ForumReportAttributes, ForumReportInput> implements ForumReportAttributes {
    public id!: number;
    public source_id!: number;
    public report_type!: string;
    public member_id!: number;
    public profile_type!: string;
    public category!: string;
    public profile_id!: number;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

ForumReport.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    source_id: {
        type: DataTypes.INTEGER
    },
    report_type: {
        type: DataTypes.STRING,
    },
    profile_type: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    profile_id: {
        type: DataTypes.INTEGER,
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
    tableName: 'forum_report',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default ForumReport
