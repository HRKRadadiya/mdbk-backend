import { ClientProfileLocation } from '../models'
import { ClientProfileLocationInput } from '../models/clientProfileLocation'

export default class ClientProfileLocationService {
	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public create = async (location: ClientProfileLocationInput): Promise<any> => {
		return ClientProfileLocation.create(location)
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteClientProfileLocation = async (filter: any): Promise<any> => {
		return ClientProfileLocation.destroy(filter)
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileLocation.findOne(filter);
	};

	public update = async (locationReq: ClientProfileLocationInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			ClientProfileLocation.update(locationReq, filter)
				.then(() => {
					this.findByProfileId(filter)
						.then((data: any) => resolve(data))
						.catch((error: Error) => reject(error))
				}).catch((error) => reject(error))
		})
	}

	public createOrUpdate = async (locationReq: ClientProfileLocationInput[]): Promise<any> => {
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
				locationData = await this.findByProfileId({ where: { client_profile_id: locationReq[0].client_profile_id } });
				resolve(locationData)
			} catch (error) {
				reject(error)
			}
		})
	}
}