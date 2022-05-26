import bcrypt from 'bcryptjs'
import httpStatus from 'http-status';
import * as CONSTANT from '../constants';
import { User } from '../models'
import { UserInput } from '../models/user'
import { isEmpty } from '../utils/helper';


export default class UserService {

	public static STATUS_ENABLE = 'enable';
	public static STATUS_DISABLE = 'disable';
	public static STATUS_DELETED = 'deleted';

	public static ALL_STATUS = [
		this.STATUS_ENABLE,
		this.STATUS_DISABLE,
		this.STATUS_DELETED,
	];

	public static ROLE_SUPAR_ADMIN = 'supar-admin';
	public static ROLE_ADMIN = 'admin';

	public static EMPLOYEE_TYPE_FULL_TIME = 'full-time';
	public static EMPLOYEE_TYPE_PART_TIME = 'part-time';
	public static EMPLOYEE_TYPE_FREELANCER = 'freelancer';
	public static EMPLOYEE_TYPE_DISPATCH = 'dispatch';

	public static LOGIN_TYPE_GOOGLE = 'google';
	public static LOGIN_TYPE_FACEBOOK = 'facebook';
	public static LOGIN_TYPE_NAVER = 'naver';
	public static LOGIN_TYPE_KAKAOTALK = 'kakaotalk';
	public static LOGIN_TYPE_APPLE = 'apple';
	public static LOGIN_TYPE_WEBSITE = 'website';

	/**
	 * Query for All Records
	 * @returns {Promise<QueryResult>}
	 */
	public getAllUser = (): Promise<any> => {
		return User.findAll();
	}

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
		return User.findAndCountAll(options)
	}

	/**
	 * Query for Get Record 
	 * @returns {Promise<QueryResult>}
	 */
	public getUserById = async (id: number): Promise<any> => {
		return User.findByPk(id);
	}

	/**
	 * @param {object} user
	 * @return Success : user object
	 * @return Error : DB error
	 */
	public createUser = async (userData: UserInput): Promise<any> => {
		return User.create(userData)
	}

	/**
	 * @param {object} clientData
	 * @param {filter} filter
	 * @return Success : { result: [1] }
	 * @return Error : DB error
	 */
	public updateUser = async (userData: any, filter: any): Promise<any> => {
		return User.update(userData, filter);
	}

	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteUser = async (filter: any): Promise<any> => {
		return User.destroy(filter);
	}


	/**
	 * @param {filter} filter
	 * @return Success : [result:1]
	 * @return Error : DB error
	 */
	public deleteAllUsers = async (filter: any): Promise<any> => {
		return User.destroy(filter);
	}

	/**
	 * @param {object} user
	 * @return Success : boolean
	 * @return Error : DB error
	 */
	public getUserByEmail = async (email: string): Promise<any> => {
		return User.findOne({ where: { email: email } })
	}

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
						reject({ message: "Incorrect password", code: httpStatus.BAD_REQUEST })
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}
}