import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface DistrictAttributes {
    id: number;
    province_id: number;
    name: string;

    created_at?: Date;
    updated_at?: Date;
}

export interface DistrictInput extends Optional<DistrictAttributes, 'id'> {

}
export interface DistrictOutput extends Required<DistrictAttributes> { }

class District extends Model<DistrictAttributes, DistrictInput> implements DistrictAttributes {
    public id!: number;
    public province_id!: number;
    public name!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

District.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    province_id: {
        type: DataTypes.INTEGER,
        references: { model: 'province', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    name: {
        type: DataTypes.STRING,
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
    tableName: 'district',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default District
