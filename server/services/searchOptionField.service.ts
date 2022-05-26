import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { SearchOptionField } from '../models'
import { SearchOptionFieldInput } from '../models/searchOptionField'
import _ from 'lodash';

export default class SearchOptionFieldService {
	/**
	 * Query for All SearchOptionFields
	 * @returns {Promise<QueryResult>}
	 */
	public getSearchOptionFields = async (): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM search_option_field`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};


	/**
	 * Query for Get SearchOptionField 
	 * @returns {Promise<QueryResult>}
	 */
	public getSearchOptionField = async (id: number): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM search_option_field WHERE id = '${id}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};

	/**
	 * @param {object} SearchOptionField
	 * @return Success : SearchOptionField object
	 * @return Error : DB error
	 */
	public createSearchOptionField = async (searchOptionData: [SearchOptionFieldInput]): Promise<any> => {
		return new Promise((resolve, reject) => {
			SearchOptionField.bulkCreate(searchOptionData)
				.then((data) => {
					resolve(data)
				})
				.catch((error) => reject(error))
		})
	}


	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteSearchOptionField = async (filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			SearchOptionField.destroy(filter)
				.then((Data) => {
					resolve(Data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	/* New */
	public create = async (searchOptionData: SearchOptionFieldInput[]): Promise<any> => {
		await this.destroy({
			where: {
				search_option_id: _.map(searchOptionData, 'search_option_id')
			}
		});
		return await SearchOptionField.bulkCreate(searchOptionData)
	}

	public destroy = async (filter: any): Promise<any> => {
		return await SearchOptionField.destroy(filter);
	}
}