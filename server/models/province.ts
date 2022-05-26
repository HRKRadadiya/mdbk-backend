import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface ProvinceAttributes {
    id: number;
    name: string;

    created_at?: Date;
    updated_at?: Date;
}

export interface ProvinceInput extends Optional<ProvinceAttributes, 'id'> {

}
export interface ProvinceOutput extends Required<ProvinceAttributes> { }

class Province extends Model<ProvinceAttributes, ProvinceInput> implements ProvinceAttributes {
    public id!: number;
    public name!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Province.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    tableName: 'province',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Province
