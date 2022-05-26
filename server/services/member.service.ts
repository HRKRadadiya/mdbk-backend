import sequelizeConnection from '../config/database'
import { QueryTypes } from 'sequelize';
import bcrypt from 'bcryptjs'
import { Member } from '../models'
import * as CONSTANT from '../constants'
import { MemberInput, MemberOutput } from '../models/member'
import TokenService from './token.service'
import httpStatus from 'http-status';
import SideCharacterProfileService from './sideCharacterProfile.service';
import ClientProfileService from './clientProfile.service';
import { isEmpty, uuidv4, _json } from '../utils/helper';
import { PaymentHistoryService, ProfileService } from '.';

export default class MemberService {

	public static LOGIN_TYPE_GOOGLE = 'google';
	public static LOGIN_TYPE_FACEBOOK = 'facebook';
	public static LOGIN_TYPE_NAVER = 'naver';
	public static LOGIN_TYPE_KAKAOTALK = 'kakaotalk';
	public static LOGIN_TYPE_APPLE = 'apple';
	public static LOGIN_TYPE_WEBSITE = 'website';

	public static STATUS_ENABLE = 'enable';
	public static STATUS_DISABLE = 'disable';
	public static STATUS_DELETED = 'deleted';

	public static ALL_STATUS = [
		this.STATUS_ENABLE,
		this.STATUS_DISABLE,
		this.STATUS_DELETED,
	];

	public tokenService = new TokenService()
	public sideCharacterProfileService = new SideCharacterProfileService()
	public clientProfileService = new ClientProfileService()
	public paymentHistoryService = new PaymentHistoryService()
	public profileService = new ProfileService()


	public pagination = (page: number, where: any = {}, sortDirection = 'DESC', limit: number = 10): Promise<any> => {
		const offset: number = (page - 1) * limit;
		let options: any = {
			offset: offset,
			limit: limit,
			distinct: true,
			order: [[CONSTANT.ADMIN_DEFAULT_ORDER.FIELD, sortDirection]],
		}
		if (!isEmpty(where)) {
			options = { ...options, where }
		}
		return Member.findAndCountAll(options)
	}


	/**
	 * @param {object} member
	 * @return Success : member object
	 * @return Error : DB error
	 */
	public createMember = async (member: MemberInput): Promise<any> => {
		return Member.create(member);
	};

	/**
	 * @param {object} member
	 * @return Success : boolean
	 * @return Error : DB error
	 */
	public getMemberByEmail = async (email: string): Promise<any> => {
		return Member.findOne({ where: { email: email } });
	};

	/**
	 * @param {String} password
	 * @param {String} correctPassword
	 * @return Success : true
	 * @return Error : Passwords do not match error
	 */
	public checkPassword = async (password: string, correctPassword: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			bcrypt
				.compare(password, correctPassword)
				.then(isPasswordMatch => {
					if (isPasswordMatch) {
						resolve(isPasswordMatch)
					} else {
						reject({ message: "Incorrect email or password", code: httpStatus.BAD_REQUEST })
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	/**
	 * @param {String} authToken
	 * @return Success : member
	 * @return Error : DB error
	 */
	public validateAccess = async (authToken: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			this.tokenService.verifyAccessToken(authToken)
				.then(member => {
					resolve(member);
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	/**
	 * @param {object} member
	 * @return Success : member object
	 * @return Error : DB error
	 */
	public updateMember = async (member: any): Promise<any> => {
		return Member.update(member, { where: { id: member.id } })
	}

	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllUser = (filter: any = {}): Promise<any> => {
		return Member.findAll(filter);
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getUserById = async (id: number): Promise<any> => {
		return this.findById(id);
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public findById = async (id: number): Promise<any> => {
		return Member.findByPk(id);
	}

	public findByMemberId = async (filter: any): Promise<any> => {
		return Member.findOne(filter);
	}

	public updateMembersByIds = async (member: any, filter: any): Promise<any> => {
		return Member.update(member, filter)
	}

	public updateProfileProgress = async (Id: number, registration_type: number, step: number): Promise<any> => {
		await this.findById(Id).then(async (member: any) => {
			let progress = 0;
			let info = JSON.parse(member.step_completion)
			if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {
				info.side_character.push(step);
				info.side_character = info.side_character.filter((item: any, i: any, ar: any) => ar.indexOf(item) === i)
				info.side_character.map((step: number, index: number) => {
					switch (step) {
						case 1:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.SIDE_CHARACTER].step1
							break;
						case 2:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.SIDE_CHARACTER].step2
							break;
						case 3:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.SIDE_CHARACTER].step3
							break;
					}
				})
				member.side_character_profile_progress = progress;
			} else {
				info.client.push(step);
				info.client = info.client.filter((item: any, i: any, ar: any) => ar.indexOf(item) === i)
				info.client.map((step: number, index: number) => {
					switch (step) {
						case 1:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.CLIENT].step1
							break;
						case 2:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.CLIENT].step2
							break;
						case 3:
							progress += CONSTANT.PROFILE_PROGRESS[CONSTANT.MEMBER.CLIENT].step3
							break;
					}
				})
				member.client_profile_progress = progress;
			}
			info = JSON.stringify(info);
			await this.updateMember({
				id: Id,
				step_completion: info,
				client_profile_progress: member.client_profile_progress,
				side_character_profile_progress: member.side_character_profile_progress,
			})

			let profileData: any = await this.profileService.findByMemberId(Id, registration_type)
			let isBonus = await this.paymentHistoryService.findOne({
				where: {
					profile_id: profileData.id,
					profile_type: (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER_TYPE.SIDE_CHARACTER : CONSTANT.MEMBER_TYPE.CLIENT,
					payment_type: 'bonus',
					member_id: Id,
					coins: CONSTANT.COINS.bonus_coin_registration,
				}
			})

			if (isEmpty(isBonus)) {
				if ((registration_type == CONSTANT.MEMBER.SIDE_CHARACTER && member.side_character_profile_progress >= CONSTANT.BASIC_VALIDATION.profile_needed_progress)
					|| (registration_type == CONSTANT.MEMBER.CLIENT && member.client_profile_progress >= CONSTANT.BASIC_VALIDATION.profile_needed_progress)) {
					let availableBalanceColumn: any = (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? 'side_character_available_coin' : 'client_available_coin'
					let payload = {
						member_id: Id,
						status: 'success',
						transaction_id: uuidv4(),
						amount: 0,
						coins: CONSTANT.COINS.bonus_coin_registration,
						profile_id: profileData.id,
						profile_type: (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER_TYPE.SIDE_CHARACTER : CONSTANT.MEMBER_TYPE.CLIENT,
						payment_type: 'bonus'
					}
					await this.paymentHistoryService.purchasePackage(payload)

					await this.updateMember({
						id: Id,
						coin_balance: parseInt(member.coin_balance) + CONSTANT.COINS.bonus_coin_registration,
						[availableBalanceColumn]: Math.round(member[availableBalanceColumn]) + CONSTANT.COINS.bonus_coin_registration
					})
				}
			}
		})
	}
}