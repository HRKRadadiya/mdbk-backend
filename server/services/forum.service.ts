import Forum, { ForumInput } from "../models/forum";
import * as CONSTANT from '../constants'
import { isEmpty, _json } from "../utils/helper";
import sequelize from '../config/database'
import { Op, QueryTypes } from "sequelize";
import { ProjectService } from ".";
import _ from "lodash";
import ForumCommentsService from "./forumComments.service";

export default class ForumService {
	public forumCommentService = new ForumCommentsService()

	public static CATEGORY_DEVELOPMENT = 'development';
	public static CATEGORY_DESIGN = 'design';
	public static CATEGORY_MARKETING = 'marketing';
	public static CATEGORY_OTHER = 'other';

	public static STATUS_PUBLIC = 'public';
	public static STATUS_PRIVATE = 'private';
	public static STATUS_DREFT = 'draft';
	public static STATUS_DELETED = 'deleted';

	public static ALL_CATEGORYS = [
		this.CATEGORY_DEVELOPMENT,
		this.CATEGORY_DESIGN,
		// this.CATEGORY_MARKETING,
		this.CATEGORY_OTHER
	]

	public create = async (forum: ForumInput): Promise<any> => {
		return Forum.create(forum)
	}

	public update = async (forum: any, filter: any): Promise<any> => {
		return await Forum.update(forum, filter);
	}

	public find = async (filter: any): Promise<any> => {
		return await Forum.findAll(filter);
	}

	public findById = async (filter: any): Promise<any> => {
		return await Forum.findOne(filter)
	}

	public destroy = async (filter: any): Promise<any> => {
		return await Forum.destroy(filter)
	}

	public softDeleteQuestion = async (deletedIds: any): Promise<any> => {
		let filter: any = {
			where: {
				[Op.or]: {
					id: {
						[Op.in]: deletedIds
					},
					parent_id: {
						[Op.in]: deletedIds
					}
				}
			}
		}

		let payload: any = {
			status: ProjectService.STATUS_DELETED
		}

		await this.update(payload, filter);
		let response: any = await this.find({
			where: {
				parent_id: {
					[Op.in]: deletedIds
				}
			}
		});

		let responseIds: any = _.map(response, 'id');
		await this.forumCommentService.update(payload, {
			where: {
				forum_id: {
					[Op.in]: responseIds
				}
			}
		})
	}

	public softDeleteResponse = async (deletedIds: any): Promise<any> => {
		let filter: any = {
			where: {
				id: {
					[Op.in]: deletedIds
				}
			}
		}

		let payload: any = {
			status: ProjectService.STATUS_DELETED
		}

		await this.update(payload, filter);
		await this.forumCommentService.update(payload, {
			where: {
				forum_id: {
					[Op.in]: deletedIds
				}
			}
		})
	}


	public findForum = async (filter: any): Promise<any> => {
		return Forum.findOne(filter)
	}

	public pagination = async (page: number, payload: any = {}, isAdmin = false, sortDirection = 'DESC', limit: number = 10): Promise<any> => {

		const defaultOrder = isAdmin ? CONSTANT.ADMIN_DEFAULT_ORDER : CONSTANT.DEFAULT_ORDER;
		const offset: number = (page - 1) * limit;
		let options: any = {
			offset: offset,
			limit: limit,
			order: [[defaultOrder.FIELD, sortDirection]],
			distinct: true,
			// required: false
		}
		if (!isEmpty(payload) && payload.type != 'all') {
			options = { ...options, ...payload }
		}

		let list: any = {
			rows: [],
			count: 0
		}

		if (!isEmpty(payload.type) && payload.type == 'all') {
			payload = {
				...payload, ...{
					offset: offset,
					limit: limit,
				}
			}
			payload.q = `%${payload.q}%`;

			if (payload.forum_type == 'question') {
				list = await this.findQuestion(payload, options);
			} else {
				list = await this.findResponse(payload, options);
			}

		} else {
			list = await Forum.findAndCountAll(options);
		}

		return list
	}

	public findQuestion = async (payload: any, options: any): Promise<any> => {
		let list: any = {
			rows: [],
			count: 0
		}

		let sql: any = '';
		sql = `SELECT 
				parent.id as id
					FROM
				forum AS parent,
				forum AS child,
				member as member
				WHERE
				(
					parent.parent_id = 0 AND
					child.parent_id = parent.id AND
					member.id = child.member_id AND
					member.id = parent.member_id AND
					(
						parent.text ilike :q OR 
						child.text ilike :q OR 
						member.name ilike :q
					)
				) 
				OR
				(
					parent.parent_id = 0 AND
					member.id = parent.member_id AND
					(
						parent.text ilike :q OR member.name ilike :q
					)
				)
				AND parent.status != '${ForumService.STATUS_DELETED}'
				`;


		sql = await sequelize.query(sql,
			{
				replacements: payload,
				type: QueryTypes.SELECT
			}
		);

		let ids: any = _.map(sql, 'id');
		options.where = {
			...options.where, id: {
				[Op.in]: ids
			},
		}
		options.include = payload.include;
		list = await _json(Forum.findAndCountAll(options));
		return list;
	}

	public findResponse = async (payload: any, options: any): Promise<any> => {
		let list: any = {
			rows: [],
			count: 0
		}

		let sql: any = '';
		sql = `SELECT 
					child.id as id
				FROM   
					forum AS parent,
					forum AS child,
					member as member
				WHERE  
					child.parent_id = parent.id AND 
					child.parent_id != 0 AND
					child.status != '${ForumService.STATUS_DELETED}' AND
					member.id = child.member_id AND
					( parent.text ilike :q OR  child.text ilike :q or member.name ilike :q)`;


		sql = await sequelize.query(sql,
			{
				replacements: payload,
				type: QueryTypes.SELECT
			}
		);

		let ids: any = _.map(sql, 'id');


		options.where = {
			...options.where, id: {
				[Op.in]: ids
			},
		}
		options.include = payload.include;
		list = await _json(Forum.findAndCountAll(options));
		return list;
	}

	public questionListIds = async (): Promise<any> => {
		let sql: any = `SELECT forum.id as id
									FROM 
									forum AS forum,
									forum AS child
									WHERE forum.id = child.parent_id
									AND Forum.id = forum.id AND Forum.status = '${ForumService.STATUS_PUBLIC}'
								AND Forum.parent_id = 0 GROUP BY forum.id`;

		let data: any = await sequelize.query(sql,
			{
				type: QueryTypes.SELECT
			}
		);
		return _.map(data, 'id')
	}
}
