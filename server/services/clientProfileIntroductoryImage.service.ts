import { ClientProfileIntroductoryImage } from '../models'
import { ClientProfileIntroductoryImageInput, ClientProfileIntroductoryImageOutput } from '../models/clientProfileIntroductoryImage'
import { removeFile } from '../utils/helper';

export default class ClientProfileIntroductoryImageService {

	public findById = async (id: number): Promise<any> => {
		return ClientProfileIntroductoryImage.findByPk(id)
	}

	public createClientProfileIntroductoryImg = async (img: [ClientProfileIntroductoryImageInput]): Promise<any> => {
		return ClientProfileIntroductoryImage.bulkCreate(img)
	}

	public destroy = async (filter: any, introductoryImage: ClientProfileIntroductoryImageOutput): Promise<any> => {
		return ClientProfileIntroductoryImage.destroy(filter)
			.then(() => removeFile(introductoryImage.file_path))
	}

	public create = async (img: ClientProfileIntroductoryImageInput): Promise<any> => {
		return ClientProfileIntroductoryImage.create(img)
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileIntroductoryImage.findAll(filter);
	}
}