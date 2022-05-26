import sequelize from '../config/database'
import { Op, QueryTypes } from 'sequelize';
import { SideCharacterProfileField } from '../models'
import { SideCharacterProfileFieldInput } from '../models/sideCharacterProfileField'
import _ from 'lodash';
import { findDifferentArray, _json } from '../utils/helper';

export default class SideCharacterProfileFieldService {
	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllRecords = async (): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM users`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};


	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getRecord = async (id: number): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM users WHERE id = '${id}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};

	/**
	 * @param {object} ClientProfileField
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public create = async (fields: SideCharacterProfileFieldInput[]): Promise<any> => {
		fields = _.uniqBy(fields, 'name');
		await SideCharacterProfileField.destroy({
			where: {
				side_character_profile_id: fields[0].side_character_profile_id
			}
		})
		await SideCharacterProfileField.bulkCreate(fields)
	}


	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteSideCharacProfileField = async (filter: any) => {
		return SideCharacterProfileField.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return SideCharacterProfileField.findAll(filter);
	};
}