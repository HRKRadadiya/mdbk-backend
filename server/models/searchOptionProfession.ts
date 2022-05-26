import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'

interface SearchOptionProfessionAttributes {
    id: number;
    search_option_id: number;
    name: string;

    created_at?: Date;
    updated_at?: Date;
}

export interface SearchOptionProfessionInput extends Optional<SearchOptionProfessionAttributes, 'id'> {

}
export interface SearchOptionProfessionOutput extends Required<SearchOptionProfessionAttributes> { }

class SearchOptionProfession extends Model<SearchOptionProfessionAttributes, SearchOptionProfessionInput> implements SearchOptionProfessionAttributes {
    public id!: number;
    public search_option_id!: number;
    public name!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

SearchOptionProfession.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    search_option_id: {
        type: DataTypes.INTEGER,
        references: { model: 'SearchOptionProfession', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    name: {
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
    tableName: 'search_option_profession',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default SearchOptionProfession
