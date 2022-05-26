import { ClientProfileCompanyLocation } from '../models'
import { ClientProfileCompanyLocationInput } from '../models/clientProfileCompanyLocation'

export default class ClientProfileCompanyLocationService {

	public create = async (location: ClientProfileCompanyLocationInput): Promise<any> => {
		return ClientProfileCompanyLocation.create(location)
	}

	public createOrUpdate = async (locationReq: ClientProfileCompanyLocationInput[]): Promise<any> => {
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
				locationData = await this.findByProfileId({ where: { client_profile_company_id: locationReq[0].client_profile_company_id } });
				resolve(locationData)
			} catch (error) {
				reject(error)
			}
		})
	}

	public update = async (locationReq: ClientProfileCompanyLocationInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			ClientProfileCompanyLocation.update(locationReq, filter)
				.then(() => {
					this.findByProfileId(filter)
						.then((data: any) => resolve(data))
						.catch((error: Error) => reject(error))
				}).catch((error) => reject(error))
		})
	}

	public deleteClientProfileCompanyLocation = async (filter: any): Promise<any> => {
		return ClientProfileCompanyLocation.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileCompanyLocation.findAll(filter);
	};
}