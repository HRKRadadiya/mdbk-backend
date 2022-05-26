import ForumLink, { ForumLinkInput } from "../models/forum_link";


export default class ForumLinkService {
	public create = async (link: ForumLinkInput): Promise<any> => {
		return ForumLink.create(link)
	}

	public update = async (link: any, filter: any): Promise<any> => {
		return await ForumLink.update(link, filter);
	}

	public getVote = async (filter: any): Promise<any> => {
		return await ForumLink.findOne(filter)
	}

	public delete = async (filter: any): Promise<any> => {
		return ForumLink.destroy(filter);
	}
}
