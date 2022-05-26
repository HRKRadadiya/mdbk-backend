import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { SearchOption } from '../models'
import { SearchOptionInput } from '../models/searchOption'
import { isEmpty, _json } from '../utils/helper';
import { MemberService, ProfileService, SearchOptionFieldService, SearchOptionLocationService, SearchOptionProfessionService } from '.';
import { RELATIONSHIP } from '../constants';

export default class SearchOptionService {

	public profileService = new ProfileService()
	public memberService = new MemberService()
	public searchOptionFieldService = new SearchOptionFieldService()
	public searchOptionLocationService = new SearchOptionLocationService()
	public searchOptionProfessionService = new SearchOptionProfessionService()
	/**
	 * Query for All search options
	 * @returns {Promise<QueryResult>}
	 */
	public getAllSearchOptions = async (): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * from search_option`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	}


	/**
	 * Query for Get searchOption by id 
	 * @returns {Promise<QueryResult>}
	 */
	public getSearchOption = async (id: number): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * from search_option WHERE id = '${id}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getSearchOptionByMemberIdAndType = (id: number, type: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * from search_option WHERE member_id = '${id}' AND search_type = '${type}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	}

	/**
	 * @param {object} searchOption
	 * @return Success : searchOption object
	 * @return Error : DB error
	 */
	public createSearchOption = async (searchOptionData: SearchOptionInput): Promise<any> => {
		return new Promise((resolve, reject) => {
			SearchOption.create(searchOptionData)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	}


	/**
	 * @param {object} searchOptionData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public updateSearchOption = async (searchOptionData: SearchOptionInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			SearchOption.update(searchOptionData, filter)
				.then((Data) => {
					resolve(Data)
				}).catch((error) => {
					reject(error);
				});
		});
	};

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteSearchOption = async (filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			SearchOption.destroy(filter)
				.then((Data) => {
					resolve(Data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}


	/* New */

	public find = async (filter: any): Promise<any> => {
		return await SearchOption.findOne(filter)
	}

	public create = async (obj: any): Promise<any> => {
		return await SearchOption.create(obj)
	}

	public destroy = async (filter: any): Promise<any> => {
		let searchOption: any = await this.find(filter);
		if (!isEmpty(searchOption)) {
			let searchFilter: any = { where: { search_option_id: searchOption.id } }
			await this.searchOptionFieldService.destroy(searchFilter);
			await this.searchOptionLocationService.destroy(searchFilter);
			await this.searchOptionProfessionService.destroy(searchFilter);
			return await SearchOption.destroy(filter)
		}
		return true;
	}

	public update = async (obj: any, filter: any): Promise<any> => {
		await SearchOption.update(obj, filter)
		return await this.find(filter)
	}

	public createOrUpdate = async (obj: any): Promise<any> => {
		let filter: any = {
			where: {
				search_type: obj.search_type,
				member_id: obj.member_id,
				registration_type: obj.registration_type
			}
		};
		let searchOption = await this.find(filter)
		if (isEmpty(searchOption)) {
			await this.create(obj);
		} else {
			await this.update(obj, filter);
		}
		return await this.find(filter)
	}

	public findByMemberId = async (memberId: number, isSearchOption: boolean = false): Promise<any> => {

		let memberData: any = await _json(this.memberService.findByMemberId({
			where: { id: memberId },
			include: [
				{
					model: SearchOption,
					as: RELATIONSHIP.search_option,
					include: [RELATIONSHIP.fields, RELATIONSHIP.profession, RELATIONSHIP.locations]
				}
			]
		}));

		memberData.search_option = await this._filterSearchOption(memberData.search_option);
		if (isSearchOption) {
			return memberData.search_option
		}
		return memberData;
	}


	public _filterSearchOption = async (searchOption: any): Promise<any> => {
		if (!isEmpty(searchOption)) {
			let _options: any = {};
			for (const option of searchOption) {
				option.locations = option.locations.map((location: any) => {
					return {
						city: location.city ? parseInt(location.city) : location.city,
						district: location.district ? parseInt(location.district) : location.district
					}
				})

				option.fields = option.fields.map((field: any) => {
					return field.name;
				})

				option.profession = option.profession.map((profession: any) => {
					return profession.name;
				})
				let filed = option.registration_type + '__' + option.search_type.replace('-', '_');
				_options[filed] = option;
				searchOption = _options;
			}
		}
		return searchOption
	}
}
