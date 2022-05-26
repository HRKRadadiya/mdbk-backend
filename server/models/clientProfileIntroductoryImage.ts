import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config/database'
import { getFilePath } from '../utils/helper';

interface ClientProfileIntroductoryImageAttributes {
  id: number;
  client_profile_id: number;
  file_name: string;
  original_file_name: string;
  file_type: string;
  file_path: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface ClientProfileIntroductoryImageInput extends Optional<ClientProfileIntroductoryImageAttributes, 'id'> {

}
export interface ClientProfileIntroductoryImageOutput extends Required<ClientProfileIntroductoryImageAttributes> { }

class ClientProfileIntroductoryImage extends Model<ClientProfileIntroductoryImageAttributes, ClientProfileIntroductoryImageInput> implements ClientProfileIntroductoryImageAttributes {
  public id!: number;
  public client_profile_id!: number;
  public file_name!: string;
  public original_file_name!: string;
  public file_type!: string;
  public file_path!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientProfileIntroductoryImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  client_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: 'clientProfile', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  original_file_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const file_path = this.getDataValue('file_path');
      return file_path ? getFilePath(file_path) : file_path;
    }
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  freezeTableName: true,
  timestamps: true,
  tableName: 'client_profile_introductory_image',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ClientProfileIntroductoryImage
