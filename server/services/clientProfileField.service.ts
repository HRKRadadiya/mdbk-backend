import { ClientProfileField } from '../models'
import { ClientProfileFieldInput } from '../models/clientProfileField'
import _ from 'lodash';
import { Op } from 'sequelize';
import { findDifferentArray } from '../utils/helper';

export default class ClientProfileFieldService {
	/**
	 * @param {object} ClientProfileField
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public create = async (fields: ClientProfileFieldInput[]): Promise<any> => {
		fields = _.uniqBy(fields, 'name');

		await ClientProfileField.destroy({
			where: { client_profile_id: fields[0].client_profile_id }
		})
		await ClientProfileField.bulkCreate(fields)
	}

	public deleteClientProfileField = async (filter: any): Promise<any> => {
		return ClientProfileField.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileField.findAll(filter);
	};
}
