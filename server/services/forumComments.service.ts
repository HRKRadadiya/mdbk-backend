import { ProjectService } from ".";
import ForumComments from "../models/forum_comments";

export default class ForumCommentsService {

	public create = async (forum: ForumComments): Promise<any> => {
		return ForumComments.create(forum)
	}

	public update = async (forum: any, filter: any): Promise<any> => {
		return await ForumComments.update(forum, filter);
	}

	public destroy = async (filter: any): Promise<any> => {
		return await ForumComments.destroy(filter);
	}

	public softDelete = async (filter: any): Promise<any> => {
		let payload: any = {
			status: ProjectService.STATUS_DELETED
		}

		await this.update(payload, filter);
	}

	public findOne = async (filter: any): Promise<any> => {
		return await ForumComments.findOne(filter);
	}

	public findAll = async (filter: any): Promise<any> => {
		return await ForumComments.findAll(filter);
	}

	// public findById = async (filter: any): Promise<any> => {
	// 	return await Forum.findOne(filter)
	// }

	// public findForum = async (filter: any): Promise<any> => {
	// 	return Forum.findOne(filter)
	// }

	// public pagination = (page: number, payload: any = {}, limit: number = 10): Promise<any> => {
	// 	const offset: number = (page - 1) * limit;
	// 	let options: any = {
	// 		offset: offset,
	// 		limit: limit,
	// 		order: [[CONSTANT.DEFAULT_ORDER.FIELD, CONSTANT.DEFAULT_ORDER.TYPE]],
	// 	}
	// 	if (!isEmpty(payload)) {
	// 		options = { ...options, ...payload }
	// 	}

	// 	return Forum.findAndCountAll(options)
	// }

}
