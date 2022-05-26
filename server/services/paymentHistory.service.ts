import { PaymentHistory } from '../models'
import { isEmpty, _json } from '../utils/helper';
import * as CONSTANT from '../constants'
import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';

export default class PaymentHistoryService {
	public purchasePackage = async (coinData: any) => {
		return await PaymentHistory.create(coinData);
	}

	public findAll = async (filter: any) => {
		return await _json(PaymentHistory.findAll(filter));
	}

	public findOne = async (filter: any) => {
		return await PaymentHistory.findOne(filter);
	}

	public pagination = async (page: number, filter: any = '', sortDirection = 'DESC', limit: number = 10): Promise<any> => {
		const offset: number = (page - 1) * limit;
		let options: any = {
			offset: offset,
			distinct: true,
			limit: limit,
		}

		let list: any = {
			rows: [],
			count: 0
		}

		list.rows = await sequelize.query(
			`select member_id from payment_history  ${filter} group by member_id ORDER BY member_id ${sortDirection} LIMIT :limit OFFSET :offset`,
			{
				replacements: options,
				type: QueryTypes.SELECT
			}
		);

		let totalReport: any = await sequelize.query(
			`select count(*) from (select member_id from payment_history  ${filter} group by member_id) as t`,
			{
				type: QueryTypes.SELECT
			}
		);
		list.count = parseInt(totalReport[0].count)
		return list
	}
}

