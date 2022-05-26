import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { SideCharacterProfile, Project } from '../models'
import { SideCharacterProfileInput, SideCharacterProfileOutput } from '../models/sideCharacterProfile'
import { isEmpty } from '../utils/helper';
import * as CONSTANT from '../constants'

export default class SideCharacterProfileService {
	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllSideCharacters = async (): Promise<any> => {
		return SideCharacterProfile.findAll()
	}

	public findAll = async (filter: any): Promise<any> => {
		return SideCharacterProfile.findAll(filter)
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getSideCharacterProfile = async (id: number): Promise<any> => {
		return SideCharacterProfile.findByPk(id)
	}

	/**
   * @param {object} client
   * @return Success : boolean
   * @return Error : DB error
   */
	public getSideCharacterByProfession = async (profession: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT cp.id,cp.nick_name,cp.introduction,cp.profession,cp.member_id,
        cp.desired_date,cp.desired_time,cp.desired_project_type,cp.insurance_status,
        cp.desired_work_type,cp.is_experienced,cp.created_at,
	     	(SELECT array_to_string(array_agg(cpf.name), '/') FROM side_character_profile_field AS cpf WHERE cp.id = cpf.side_character_profile_id) AS field,
         (SELECT array_to_string(array_agg(workExp.position), ',') FROM side_character_profile_work_experience AS workExp WHERE cp.id = workExp.side_character_profile_id) AS workPosition,
         (SELECT array_to_string(array_agg(workExp.total_experience), ',') FROM side_character_profile_work_experience AS workExp WHERE cp.id = workExp.side_character_profile_id) AS workExperience
         FROM side_character_profile AS cp        
          WHERE cp.profession LIKE '%${profession}%'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};

	/**
   * @param {object} client
   * @return Success : boolean
   * @return Error : DB error
   */
	public getSideCharacterByNickName = async (nickName: string): Promise<any> => {
		return SideCharacterProfile.findOne({ where: { nick_name: nickName } });
	};

	/**
   * Query for Get Record 
   * @returns {Promise<QueryResult>}
   */
	public getSideCharacterByMemberId = async (member_id: number): Promise<any> => {
		return SideCharacterProfile.findOne({ where: { member_id: member_id } })
	}

	/**
	 * @param {object} sideCharacter
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createSideCharacterProfile = async (sideCharacterData: SideCharacterProfileInput): Promise<any> => {
		const fetchSideCharacter = await SideCharacterProfile.findOne({
			where: {
				member_id: sideCharacterData.member_id
			}
		});
		if (isEmpty(fetchSideCharacter)) {
			return SideCharacterProfile.create(sideCharacterData)
		}
		return fetchSideCharacter;
	}

	/**
	 * @param {object} sideCharacterData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public update = async (sideCharacterData: SideCharacterProfileInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			filter = { ...filter, returning: true, plain: true }
			SideCharacterProfile.update(sideCharacterData, filter)
				.then(async (member: any) => {
					let data: any = await this.findProfile(filter);
					resolve(data);
				})
				.catch((error) => reject(error));
		});
	};

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteSideCharacterProfile = async (filter: any): Promise<any> => {
		return SideCharacterProfile.destroy(filter);
	}

	public createOrUpdate = async (sideCharacterData: SideCharacterProfileInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.getSideCharacterByMemberId(sideCharacterData.member_id)
				.then(async (member: SideCharacterProfileOutput) => {
					let sideCharacterProfile: any;
					if (!isEmpty(member)) {
						sideCharacterProfile = await this.update(sideCharacterData, filter)
					} else {
						sideCharacterProfile = await this.createSideCharacterProfile(sideCharacterData)
					}
					resolve(sideCharacterProfile)
				}).catch((error) => {
					reject(error);
				});
		});
	};

	public findOrCreate = async (sideCharacterData: SideCharacterProfileInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.findProfile(filter)
				.then(async (member: SideCharacterProfileOutput) => {
					let sideCharacterProfile: any;
					if (!isEmpty(member)) {
						sideCharacterProfile = member
					} else {
						sideCharacterProfile = await this.createSideCharacterProfile(sideCharacterData)
					}
					resolve(sideCharacterProfile)
				}).catch((error) => {
					reject(error);
				});
		});
	};

	public findProfile = async (filter: any): Promise<any> => {
		return SideCharacterProfile.findOne(filter)
	}

	public pagination = (page: number, filter: any = {}, limit: number = 10): Promise<any> => {
		const offset: number = (page - 1) * limit;
		let options: any = {
			offset: offset,
			limit: limit,
			distinct: true,
			order: [[CONSTANT.DEFAULT_ORDER.FIELD, CONSTANT.DEFAULT_ORDER.TYPE]],
		}
		if (!isEmpty(filter)) {
			options = { ...options, ...filter }
		}

		return SideCharacterProfile.findAndCountAll(options)
	}

	public getSideCharacterAllProject = async (profession: any = {}): Promise<any> => {
		return Project.findAll(profession);
	};
}
