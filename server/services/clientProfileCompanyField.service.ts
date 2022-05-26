import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { ClientProfileCompanyField, User } from '../models'
import { ClientProfileCompanyFieldInput, ClientProfileCompanyFieldOutput } from '../models/clientProfileCompanyField'
import _ from 'lodash';
import { Op } from 'sequelize';
import { findDifferentArray } from '../utils/helper';


export default class ClientProfileFieldService {
	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllRecords = async (): Promise<any> => {
		return User.findAll();
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getRecord = async (id: number): Promise<any> => {
		return ClientProfileCompanyField.findByPk(id);
	}

	public create = async (fields: ClientProfileCompanyFieldInput[]): Promise<any> => {
		fields = _.uniqBy(fields, 'name');
		await ClientProfileCompanyField.destroy({
			where: {
				client_profile_company_id: fields[0].client_profile_company_id
			}
		})

		ClientProfileCompanyField.bulkCreate(fields)
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteClientProfileCompanyField = async (filter: any): Promise<any> => {
		return ClientProfileCompanyField.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return ClientProfileCompanyField.findAll(filter);
	};
}