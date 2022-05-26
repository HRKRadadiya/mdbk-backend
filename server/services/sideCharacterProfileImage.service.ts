import { SideCharacterProfileImage } from '../models'
import { SideCharacterProfileImageInput, SideCharacterProfileImageOutput } from '../models/sideCharacterProfileImage'
import { isEmpty, removeFile } from '../utils/helper';

export default class SideCharacterProfileImageService {
	/**
	 * Query for Get Side character profile image 
	 * @returns {Promise<QueryResult>}
	 */
	public getSideCharacProfileImg = async (id: number): Promise<any> => {
		return SideCharacterProfileImage.findByPk(id);
	};

	/**
	 * @param {object} img
	 * @return Success : data object
	 * @return Error : DB error
	 */
	public createSideCharacProfileImg = async (img: [SideCharacterProfileImageInput]): Promise<any> => {
		return SideCharacterProfileImage.bulkCreate(img)
	}

	public create = async (img: SideCharacterProfileImageInput): Promise<any> => {
		return SideCharacterProfileImage.create(img)
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteSideCharacProfileImg = async (filter: any, profileImage: SideCharacterProfileImageOutput): Promise<any> => {
		return SideCharacterProfileImage.destroy(filter)
			.then(() => {
				removeFile(profileImage.file_path);
			});
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return SideCharacterProfileImage.findOne(filter);
	}

	public update = async (profileImg: SideCharacterProfileImageInput, filter: any, oldProfileImg: SideCharacterProfileImageOutput): Promise<any> => {
		return SideCharacterProfileImage.update(profileImg, filter)
			.then(() => {
				removeFile(oldProfileImg.file_path);
			});
	}

	public createOrUpdate = async (img: SideCharacterProfileImageInput): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				let filter: any = { where: { side_character_profile_id: img.side_character_profile_id } }
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