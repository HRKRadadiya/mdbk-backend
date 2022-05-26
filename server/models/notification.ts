import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface NotificationAttributes {
	id: number;
	notification_type: string;
	is_read: string;
	meta?: string;
	from_member_id: number;
	to_member_id: number;

	createdAt?: Date;
	updatedAt?: Date;
}

export interface NotificationInput extends Optional<NotificationAttributes, 'id' | 'is_read' | 'from_member_id'> {

}
export interface NotificationOutput extends Required<NotificationAttributes> { }

class Notification extends Model<NotificationAttributes, NotificationInput> implements NotificationAttributes {
	public id!: number;
	public from_member_id!: number;
	public to_member_id!: number;
	public notification_type!: string;
	public is_read!: string;
	public meta!: string;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Notification.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	from_member_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	to_member_id: {
		type: DataTypes.INTEGER,
	},
	notification_type: {
		type: DataTypes.STRING,
		allowNull: true
	},
	is_read: {
		type: DataTypes.ENUM('yes', 'no'),
		defaultValue: 'no'
	},
	meta: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	createdAt: {
		type: DataTypes.DATE
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	sequelize: sequelizeConnection,
	paranoid: false,
	freezeTableName: true,
	timestamps: true,
	tableName: 'notifications',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
});

export default Notification
