import ForumHashtag, { ForumHashtagInput } from "../models/forum_hashtag";

export default class ForumHashtagService {
	public create = async (hashtag: ForumHashtagInput): Promise<any> => {
		return ForumHashtag.create(hashtag)
	}
	public delete = async (filter: any): Promise<any> => {
		return ForumHashtag.destroy(filter);
	}

	// public update = async (link: any, filter: any): Promise<any> => {
	// 	return await ForumLink.update(link, filter);
	// }
	
	// public getVote = async (filter: any): Promise<any> => {
	// 	return await ForumLink.findOne(filter)
	// }
}
