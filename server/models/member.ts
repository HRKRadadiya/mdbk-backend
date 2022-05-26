import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface MemberAttributes {
    id: number;
    name: string;
    password: string;
    email: string;
    coin_balance: number;
    verification_code: number
    is_notification: boolean
    login_type: string,
    email_verified?: string,
    status: string,
    side_character_profile_progress?: number,
    client_profile_progress?: number,
    step_completion?: string,
    termination_at?: Date;
    client_available_coin: number;
    side_character_available_coin: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface MemberInput extends Optional<MemberAttributes, 'id' | 'name' | 'verification_code' | 'is_notification' | 'password' | 'coin_balance' | 'client_available_coin' | 'side_character_available_coin' | 'login_type' | 'status' | 'side_character_profile_progress' | 'client_profile_progress' | 'termination_at' | 'email_verified'> {

}
export interface MemberOutput extends Required<MemberAttributes> { }

class Member extends Model<MemberAttributes, MemberInput> implements MemberAttributes {
    public id!: number;
    public name!: string;
    public password!: string;
    public email!: string;
    public coin_balance!: number;
    public verification_code!: number;
    public is_notification!: boolean;
    public login_type!: string;
    public email_verified!: string;
    public status!: string;
    public side_character_profile_progress!: number;
    public client_profile_progress!: number;
    public step_completion!: string;
    public termination_at!: Date;
    public client_available_coin!: number;
    public side_character_available_coin!: number;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Member.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    coin_balance: {
        type: DataTypes.DECIMAL
    },
    client_available_coin: {
        type: DataTypes.DECIMAL
    },
    side_character_available_coin: {
        type: DataTypes.DECIMAL
    },
    verification_code: {
        type: DataTypes.INTEGER
    },
    is_notification: {
        type: DataTypes.BOOLEAN
    },
    login_type: {
        type: DataTypes.ENUM('google', 'facebook', 'naver', 'kakaotalk', 'apple', 'website'),
        defaultValue: 'website'
    },
    email_verified: {
        type: DataTypes.ENUM('yes', 'no'),
        defaultValue: 'no'
    },
    status: {
        type: DataTypes.ENUM('enable', 'disable', 'deleted'),
        defaultValue: 'enable'
    },
    side_character_profile_progress: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    client_profile_progress: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    step_completion: {
        type: DataTypes.TEXT
    },
    termination_at: {
        type: DataTypes.DATE,
        allowNull: true
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
    tableName: 'member',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Member