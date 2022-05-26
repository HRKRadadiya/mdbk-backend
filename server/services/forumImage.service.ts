import ForumImage from "../models/forumImage"


export default class ForumImageService {

	public create = async (image: ForumImage): Promise<any> => {
		return ForumImage.create(image)
	}
	public findById = async (filter: any): Promise<any> => {
		return await ForumImage.findOne(filter)
	}

	public findAll = async (filter: any): Promise<any> => {
		return await ForumImage.findAll(filter)
	}

	public destory = async (filter: any): Promise<any> => {
		return ForumImage.destroy(filter)
	}

}
