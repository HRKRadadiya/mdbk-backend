import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { SideCharacterProfileLocation } from '../models'
import { SideCharacterProfileLocationInput, SideCharacterProfileLocationOutput } from '../models/sideCharacterProfileLocation'
import { isEmpty } from '../utils/helper';

export default class SideCharacterProfileLocationService {
	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public create = async (client: SideCharacterProfileLocationInput): Promise<any> => {
		return SideCharacterProfileLocation.create(client)
	}

	public update = async (locationReq: SideCharacterProfileLocationInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			SideCharacterProfileLocation.update(locationReq, filter)
				.then(() => {
					this.findByProfileId(filter)
						.then((data: any) => resolve(data))
						.catch((error: Error) => reject(error))
				})
				.catch((error) => reject(error))
		})
	}

	public deleteSideCharacProfileLocation = async (filter: any) => {
		return SideCharacterProfileLocation.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return await SideCharacterProfileLocation.findAll(filter);
	}

	public createOrUpdateLocation = async (locationReq: SideCharacterProfileLocationInput[]): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				let locationData: any = [];
				for (const location of locationReq) {
					if (location.id == 0) {
						await this.create(location);
					} else {
						let filter = { where: { id: location.id } }
						await this.update(location, filter);
					}
				}
				locationData = await this.findByProfileId({ where: { side_character_profile_id: locationReq[0].side_character_profile_id } });
				resolve(locationData)
			} catch (error) {
				reject(error)
			}
		})
	}
}