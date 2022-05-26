
import { Project } from '../models'
import * as CONSTANT from '../constants'
import { isEmpty } from '../utils/helper'

export default class ProjectService {

	public static PROFESSION_DEVELOPMENT = 'development';
	public static PROFESSION_DESIGN = 'design';
	public static PROFESSION_MARKETING = 'marketing';
	public static PROFESSION_OTHER = 'other';

	public static ALL_PROFESSIONS = [
		this.PROFESSION_DEVELOPMENT,
		this.PROFESSION_DESIGN,
		this.PROFESSION_MARKETING,
		this.PROFESSION_OTHER
	]

	public static PROFESSIONS_MAPPING = [
		[this.PROFESSION_DEVELOPMENT] = "Development",
		[this.PROFESSION_DESIGN] = "Design",
		[this.PROFESSION_MARKETING] = "Marketing",
		[this.PROFESSION_OTHER] = "Other"
	]

	public static STATUS_ENABLE = 'enable';
	public static STATUS_DISABLE = 'disable';
	public static STATUS_DELETED = 'deleted';

	public static ALL_STATUS = [
		this.STATUS_ENABLE,
		this.STATUS_DISABLE,
		this.STATUS_DELETED,
	];

	public create = async (project: Project): Promise<any> => {
		return Project.create(project)
	}

	public update = async (project: any, filter: any): Promise<any> => {
		return await Project.update(project, filter);
	}

	public findAll = async (filter: any): Promise<any> => {
		return await Project.findAll(filter);
	}

	public findById = async (filter: any): Promise<any> => {
		return await Project.findOne(filter)
	}

	public destroy = async (filter: any): Promise<any> => {
		return await Project.destroy(filter)
	}

	public pagination = (page: number, payload: any = {}, isAdmin = false, sortDirection = 'DESC', limit: number = 10): Promise<any> => {
		const defaultOrder = isAdmin ? CONSTANT.ADMIN_DEFAULT_ORDER : CONSTANT.DEFAULT_ORDER;
		const offset: number = (page - 1) * limit;
		let options: any = {
			offset: offset,
			limit: limit,
			distinct: true,
			order: [[defaultOrder.FIELD, sortDirection]],
		}
		if (!isEmpty(payload)) {
			options = { ...options, ...payload }
		}

		return Project.findAndCountAll(options)
	}

}
