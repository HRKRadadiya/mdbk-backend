// import sequelize from '../config/database'
import sequelize from "sequelize";
import { Op, QueryTypes, fn } from 'sequelize';
import { Request } from '../models'
import { RequestInput } from '../models/request'
import * as CONSTANT from '../constants'
import { isEmpty, _json } from '../utils/helper';
import { MemberService } from '.';
import { MemberOutput } from '../models/member';
import moment from 'moment';
import PaymentService from './payment.service';

export default class RequestService {

	public memberService = new MemberService();
	public paymentService = new PaymentService();

	public static ACCEPTED_STATUS = 'accepted';
	public static REJECTED_STATUS = 'rejected';
	public static WAITING_STATUS = 'waiting';

	public static ALL_STATUS = [
		this.ACCEPTED_STATUS,
		this.REJECTED_STATUS,
		this.WAITING_STATUS
	];


	public static REQUEST_TYPE_INTERVIEW = 'interview';
	public static REQUEST_TYPE_CONTACT_INFORMATION = 'contact-information';

	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllRequest = async (): Promise<any> => {
		// return new Promise((resolve, reject) => {
		// 	sequelize
		// 		.query(
		// 			`SELECT * FROM request`,
		// 			{ type: QueryTypes.SELECT }
		// 		)
		// 		.then((data) => resolve(data))
		// 		.catch((error) => reject(error));
		// });
	};


	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	// public getRequestById = async (id: number): Promise<any> => {
	// 	return new Promise((resolve, reject) => {
	// 		sequelize
	// 			.query(
	// 				`SELECT * FROM request WHERE id = '${id}'`,
	// 				{ type: QueryTypes.SELECT }
	// 			)
	// 			.then((data) => resolve(data))
	// 			.catch((error) => reject(error));
	// 	});
	// };


	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createRequest = async (requestData: RequestInput): Promise<any> => {
		return new Promise((resolve, reject) => {
			Request.create(requestData)
				.then((data) => resolve(data))
				.catch((error) => reject(error))
		})
	};


	/**
	 * @param {object} clientData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public updateRequest = async (requestData: RequestInput, filter: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			Request.update(requestData, filter)
				.then((Data) => {
					resolve(Data)
				}).catch((error) => {
					reject(error);
				});
		});
	};

	public create = async (request: Request): Promise<any> => {
		return Request.create(request)
	}

	public findrequestById = async (filter: any): Promise<any> => {
		return Request.findAll(filter)
	}

	public getRequestById = async (filter: any): Promise<any> => {
		return Request.findOne(filter)
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
		return Request.findAndCountAll(options)
	}

	public totalRequestPerDay = async (memberId: number) => {
		const _member: any = await _json(this.memberService.findByMemberId({
			where: { id: memberId },
			include: [CONSTANT.RELATIONSHIP.client_profile]
		}));

		if (isEmpty(_member.client_profile)) {
			return CONSTANT.REQUESTS.total_free_request;
		}

		let isFreeRequest = await this.findrequestById({
			where: {
				[Op.and]: [
					sequelize.where(sequelize.fn('date', sequelize.col('created_at')), '=', `${moment().format('YYYY-MM-DD')}`),
					{
						from_member_id: _member.client_profile.id
					}
				]
			}
		})

		let totalFreeRequest: any = -1;
		if (isFreeRequest.length < CONSTANT.REQUESTS.total_free_request) {
			totalFreeRequest = (isFreeRequest.length == 0) ? CONSTANT.REQUESTS.total_free_request : isFreeRequest.length
		}
		return totalFreeRequest;
	}

	public checkRequestValidOrNot = async (member: any, registrationType: number, isCheckFreeCoin = true) => {
		let availableBalanceColumn: any = (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) ? 'side_character_available_coin' : 'client_available_coin'
		let returnObj: any = {
			// is_enough_coin: member.coin_balance >= CONSTANT.COINS.request_coins,
			is_enough_coin: member[availableBalanceColumn] >= CONSTANT.COINS.request_coins,
			status: true,
			is_free_request: false,
			total_free_request: 0,
			available_coin: parseFloat(member[availableBalanceColumn])
		};

		if (isCheckFreeCoin) {
			let totalRequest: any = await this.totalRequestPerDay(member.id);

			if (totalRequest != -1) {
				returnObj.total_free_request = totalRequest - 1
				returnObj.is_free_request = true
			}
		}


		if (!returnObj.is_free_request) {
			// if (member.coin_balance >= CONSTANT.COINS.request_coins) {
			if (member[availableBalanceColumn] >= CONSTANT.COINS.request_coins) {
				returnObj.available_coin = Math.round(member[availableBalanceColumn]) - CONSTANT.COINS.request_coins;
				let coinBalance = Math.round(member.coin_balance) - CONSTANT.COINS.request_coins;
				await this.paymentService.checkCoinBalance(member.id, registrationType, isCheckFreeCoin);
				await this.memberService.updateMember({
					coin_balance: coinBalance,
					[availableBalanceColumn]: parseFloat(returnObj.available_coin),
					id: member.id
				});
			} else {
				returnObj.is_enough_coin = returnObj.status = false
			}
		}
		return returnObj;
	}

	public isAlreadyRequested = async (fromMemberId: number, toMemberId: number, requestType: string) => {
		let request: any = await this.getRequestById({
			where: {
				from_member_id: fromMemberId,
				to_member_id: toMemberId,
				request_type: requestType
			}
		});
		return !isEmpty(request);
	}

	public findByMemberProfile = async (fromMemberId: number, toMemberId: number, requestType: string) => {
		return await this.getRequestById({
			where: {
				from_member_id: fromMemberId,
				to_member_id: toMemberId,
				request_type: requestType
			}
		});
	}

	public update = async (payload: any, filter: any) => {
		return Request.update(payload, filter);
	}
}