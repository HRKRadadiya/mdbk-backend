import { ClientProfileCompanyHastag } from '../models'
import { ClientProfileCompanyHastagInput } from '../models/clientProfileCompanyHastag'
import _ from 'lodash';
import { Op } from 'sequelize';
import { findDifferentArray } from '../utils/helper';

export default class ClientProfileHastagService {
	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public create = async (hastags: ClientProfileCompanyHastagInput[]): Promise<any> => {
		let uniqueHastags = _.uniqBy(hastags, 'name');
		await ClientProfileCompanyHastag.destroy({
			where: {
				client_profile_company_id: hastags[0].client_profile_company_id
			}
		})
		await ClientProfileCompanyHastag.bulkCreate(uniqueHastags)
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteClientProfileCompanyHashtag = async (filter: any): Promise<any> => {
		return ClientProfileCompanyHastag.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileCompanyHastag.findAll(filter);
	};
}