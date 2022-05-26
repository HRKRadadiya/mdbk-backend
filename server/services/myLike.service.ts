import { MyLike } from '../models'
import * as CONSTANT from '../constants'
import { isEmpty } from '../utils/helper'

export default class MyLikeService {

    public static LIKE_TYPE_PROJECT = 'project';
    public static LIKE_TYPE_SIDE_CHARACTER = 'side-character';
    public static LIKE_TYPE_CLIENT = 'client';

    public likeUnlike = async (payload: any): Promise<any> => {
        const isLike: any = await MyLike.findOne({
            where: payload
        })
        if (isLike) {
            await MyLike.destroy({
                where: payload
            })
            return false;
        } else {
            await MyLike.create(payload)
            return true;
        }
    }

    public likeFlag = async (source_id: number, like_type: string, member_id: number): Promise<any> => {
        const like: any = await MyLike.findOne({
            where: {
                source_id,
                like_type,
                member_id
            }
        });
        return !isEmpty(like);
    }

    public totalLikes = async (source_id: number, like_type: string): Promise<any> => {
        return await MyLike.count({
            where: {
                source_id,
                like_type
            }
        });
    }


    public findAll = async (filter: any): Promise<any> => {
        return await MyLike.findAll(filter)
    }

    public pagination = (page: number, filter: any = {}, limit: number = 10): Promise<any> => {
        const offset: number = (page - 1) * limit;
        let options: any = {
            offset: offset,
            limit: limit,
            distinct: true,
            order: [[CONSTANT.DEFAULT_ORDER.FIELD, CONSTANT.DEFAULT_ORDER.TYPE]],
        }
        if (!isEmpty(filter)) {
            options = { ...options, ...filter }
        }

        return MyLike.findAndCountAll(options)
    }
}