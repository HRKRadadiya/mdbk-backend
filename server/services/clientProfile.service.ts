import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { ClientProfile as Client } from '../models'
import { ClientProfileInput, ClientProfileOutput } from '../models/clientProfile'
import { isEmpty } from '../utils/helper';
import * as CONSTANT from '../constants'

export default class ClientProfileService {
	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllClients = async (): Promise<{}> => {
		return Client.findAll();
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getClientProfile = async (id: number): Promise<any> => {
		return Client.findByPk(id)
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getClientProfileByMemberId = async (memberId: number): Promise<any> => {
		return Client.findOne({ where: { member_id: memberId } })
	}

	/**
	 * @param {object} client
	 * @return Success : boolean
	 * @return Error : DB error
	 */
	public getClientByNickName = async (nickName: string): Promise<any> => {
		return Client.findOne({ where: { nick_name: nickName } })
	};

	/**
   * @param {object} client
   * @return Success : boolean
   * @return Error : DB error
   */
	public getClientByProfession = (profession: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT cp.id,cp.nick_name,cp.introduction,cp.profession, cpf.name AS field,
        cp.desired_date,cp.desired_time,cp.desired_project_type,cp.insurance_status,
        cp.desired_work_type,cp.is_company, cp.created_at
         FROM client_profile AS cp
         LEFT OUTER JOIN client_profile_field AS cpf ON cp.id = cpf.client_profile_id
          WHERE cp.profession = '${profession}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	};

	/**
	 * @param {object} client
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createClient = async (client: ClientProfileInput): Promise<any> => {

		const fetchClient = await Client.findOne({
			where:{
				member_id: client.member_id
			}
		});
		if(isEmpty(fetchClient)){
			return Client.create(client)
		}
		return fetchClient;
	}


	/**
	 * @param {object} clientData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public update = async (clientData: ClientProfileInput, filter: any): Promise<any> => {
		return await new Promise(async (resolve, reject) => {
			await Client.update(clientData, filter)
				.then(async () => {
					await this.getClientProfileByMemberId(clientData.member_id)
						.then((member: ClientProfileOutput) => {
							resolve(member)
						}).catch((error) => {
							reject(error);
						});
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
	public deleteClientProfile = async (filter: any): Promise<any> => {
		return Client.destroy(filter);
	}

	public createOrUpdate = async (clientData: ClientProfileInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.getClientProfileByMemberId(clientData.member_id)
				.then(async (member: ClientProfileOutput) => {
					let clientProfile: any;
					if (!isEmpty(member)) {
						clientProfile = await this.update(clientData, filter)
					} else {
						clientProfile = await this.createClient(clientData)
					}
					resolve(clientProfile)
				}).catch((error) => {
					reject(error);
				});
		});
	};

	public findOrCreate = async (clientData: ClientProfileInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.findProfile(filter)
				.then(async (member: ClientProfileOutput) => {
					let clientProfile: any;
					if (!isEmpty(member)) {
						clientProfile = member
					} else {
						clientProfile = await this.createClient(clientData)
					}
					resolve(clientProfile)
				}).catch((error) => {
					reject(error);
				});
		});
	}

	public findProfile = async (filter: any): Promise<any> => {
		return Client.findOne(filter);
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

		return Client.findAndCountAll(options)
	}
}