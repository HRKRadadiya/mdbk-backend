import { ClientProfileCompany } from '../models'
import { ClientProfileCompanyInput, ClientProfileCompanyOutput } from '../models/clientProfileCompany'
import { isEmpty } from '../utils/helper';


export default class ClientProfileCompanyService {

	public getClientProfileCompany = async (id: number): Promise<any> => {
		return ClientProfileCompany.findOne({ where: { client_profile_id: id } });
	};

	public createClientProfileCompany = async (client: ClientProfileCompanyInput): Promise<any> => {
		return ClientProfileCompany.create(client)
	}

	public updateClientProfileCompany = async (companyData: ClientProfileCompanyInput, filter: any): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				await ClientProfileCompany.update(companyData, filter);
				let companyProfile: ClientProfileCompanyOutput = await this.findByClientProfileId(filter);
				resolve(companyProfile);
			} catch (error) {
				reject(error);
			}
		});
	};

	public deleteClientProfileCompany = async (filter: any): Promise<any> => {
		return ClientProfileCompany.destroy(filter);
	}

	public findByClientProfileId = async (filter: any): Promise<any> => {
		return ClientProfileCompany.findOne(filter);
	}

	public createOrUpdate = async (companyProfile: ClientProfileCompanyInput): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.getClientProfileCompany(companyProfile.client_profile_id)
				.then(async (companyPro: any) => {
					try {
						let profileData;
						if (isEmpty(companyPro)) {
							profileData = await this.createClientProfileCompany(companyProfile)
						} else {
							let filter = { where: { client_profile_id: companyProfile.client_profile_id } }
							profileData = await this.updateClientProfileCompany(companyProfile, filter)
						}
						resolve(profileData)
					} catch (error) {
						reject(error)
					}
				})
				.catch((error) => reject(error))
		})
	}
}