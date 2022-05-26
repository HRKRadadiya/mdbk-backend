import ForumUpDownVote from "../models/forum_updown_vote";


export default class ForumUpdownVoteService {
	public create = async (forum: ForumUpDownVote): Promise<any> => {
		return ForumUpDownVote.create(forum)
	}

	public update = async (forum: any, filter: any): Promise<any> => {
		return await ForumUpDownVote.update(forum, filter);
	}

	public destroy = async (filter: any): Promise<any> => {
		return await ForumUpDownVote.destroy(filter);
	}

	public getVote = async (filter: any): Promise<any> => {
		return await ForumUpDownVote.findOne(filter)
	}
	public getLikeDislike = async (filter: any): Promise<any> => {
		return ForumUpDownVote.findAll(filter)
	}

	public findOne = async (filter: any): Promise<any> => {
		return ForumUpDownVote.findOne(filter)
	}

	public likeFlag = async (forum_id: number, member_id: number): Promise<any> => {
		return await ForumUpDownVote.findOne({
			where: {
				forum_id,
				member_id
			}
		});
	}
}
