import { ProjectImage } from '../models'

export default class ProjectImageService {

	public create = async (image: ProjectImage): Promise<any> => {
		return ProjectImage.create(image)
	}

	public findById = async (filter: any): Promise<any> => {
		return ProjectImage.findOne(filter)
	}

	public destory = async (filter: any): Promise<any> => {
		return ProjectImage.destroy(filter)
	}
}
