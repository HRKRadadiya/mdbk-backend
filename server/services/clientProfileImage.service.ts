import { ClientProfileImage } from '../models'
import { ClientProfileImageInput, ClientProfileImageInputOutput } from '../models/clientProfileImage'
import { isEmpty, removeFile } from '../utils/helper';

export default class ClientProfileImageService {
	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createClientProfileImg = async (img: [ClientProfileImageInput]): Promise<any> => {
		return ClientProfileImage.bulkCreate(img)
	}

	public create = async (img: ClientProfileImageInput): Promise<any> => {
		return ClientProfileImage.create(img)
	}

	public update = async (profileImg: ClientProfileImageInput, filter: any, oldProfileImg: ClientProfileImageInputOutput): Promise<any> => {
		return ClientProfileImage.update(profileImg, filter)
			.then(() => removeFile(oldProfileImg.file_path));
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteClientProfileImg = async (filter: any): Promise<any> => {
		return ClientProfileImage.destroy(filter)
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileImage.findOne(filter);
	}

	public createOrUpdate = async (img: ClientProfileImageInput): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				let filter: any = { where: { client_profile_id: img.client_profile_id } }
				let profileImg = await this.findByProfileId(filter);
				if (!isEmpty(profileImg)) {
					await this.update(img, filter, profileImg)
				} else {
					await this.create(img)
				}
				profileImg = await this.findByProfileId(filter);
				resolve(profileImg)
			} catch (error) {
				reject(error)
			}
		})
	}
}