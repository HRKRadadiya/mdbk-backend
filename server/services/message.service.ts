import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { Message } from '../models'
import { MessageInput, MessageOutput } from '../models/message'
import { isEmpty } from '../utils/helper';


export default class MessageService {
	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */

	public getAllMessage = async (): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM message`,
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
	public getMessageById = async (id: number): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * FROM message WHERE id = '${id}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => { resolve(data) })
				.catch((error) => reject(error));
		});
	};


	/**
	* Query for Get Record 
	* @returns {Promise<QueryResult>}
	*/
	public getMessageByMemberId = async (id: number): Promise<any> => {
		return new Promise((resolve, reject) => {
			sequelize
				.query(
					`SELECT * from message AS msg WHERE msg.member_id = '${id}'`,
					{ type: QueryTypes.SELECT }
				)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	}

	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createMessage = async (messageData: MessageInput): Promise<any> => {
		return new Promise((resolve, reject) => {
			Message.create(messageData)
				.then((data) => { resolve(data) })
				.catch((error) => reject(error))
		})
	};

	/**
	 * @param {object} clientData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public updateMessage = async (messageData: Partial<MessageInput>, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			Message.update(messageData, filter)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	};

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteMessage = async (filter: any) => {
		return new Promise((resolve, reject) => {
			Message.destroy(filter)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		});
	}

	public findAll = (filter: any = {}): Promise<any> => {
		return Message.findAll(filter);
	}

	public findOne = (filter: any): Promise<any> => {
		return Message.findOne(filter);
	}

	public create = async (message: any): Promise<any> => {
		let messageData: any = await this.findOne({
			where: message
		});
		if (isEmpty(messageData)) {
			return await Message.create(message)
		} else {
			return messageData
		}
	}
}