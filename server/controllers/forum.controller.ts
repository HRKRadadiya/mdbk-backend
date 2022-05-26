import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import * as CONSTANT from '../constants'
import { Op } from "sequelize";
import { ProfileService, ProjectService, ReportService } from "../services";
import ForumService from "../services/forum.service";
import ForumCommentsService from "../services/forumComments.service";
import ForumHashtagService from "../services/forumHashtag.service";
import ForumImageService from "../services/forumImage.service";
import ForumLinkService from "../services/forumLink.service";
import ForumUpdownVoteService from "../services/forumUpdownVote.service";
import { convertToArray, getFilePath, getImagePath, isEmpty, removeFile, saveFile, saveNotification, _bool, _json } from "../utils/helper";
import { RESET_CONTENT } from "http-status";
import ForumReportService from "../services/forumReport.service";
import { authenticate } from "passport";
import Forum from "../models/forum";
import urlMetadata from "url-metadata";
import ForumComments from "../models/forum_comments";
import ForumHashtag from "../models/forum_hashtag";

export default class ForumController {
    public forumService = new ForumService()
    public forumImageService = new ForumImageService()
    public formsUpDownVoteService = new ForumUpdownVoteService()
    public formsLinkService = new ForumLinkService()
    public forumHashtagService = new ForumHashtagService()
    public forumCommentService = new ForumCommentsService()
    public profileService = new ProfileService()
    public forumReportService = new ForumReportService()

    public createForum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const forum = req.body
        var memberProfile: any = await _json(this.profileService.findByMemberId(req.authMember.id, req.body.registration_type))
        const profile_type: string = (forum.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER_TYPE.SIDE_CHARACTER : CONSTANT.MEMBER_TYPE.CLIENT; // profile type
        var parent_id: number = forum.parent_id || 0;

        let profileType = (parent_id == 0) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER
        // let profile: any = await this.profileService.findProfile({
        //     where: { member_id: req.authMember.id }
        // }, profileType)

        // if (isEmpty(profile) && ) {
        //     return res.api.badResponse({
        //         is_profile_completed: false,
        //         profile_type: profileType
        //     })
        // }

        let profileRate = (parent_id == 0) ? Number(req.authMember.client_profile_progress) : Number(req.authMember.side_character_profile_progress)

        if (profileRate < CONSTANT.BASIC_VALIDATION.profile_needed_progress) {
            return res.api.badResponse({
                is_profile_completed: false,
                profile_type: profileType,
                switch_response: await this.profileService.switchAccount(req.authMember.id, profileType)
            })
        }

        if (!forum.text) {
            res.api.validationErrors({
                "text": "text must be required"
            })
        }
        let forumRes;
        let forumData: any;
        if (parent_id == 0) {
            if (!forum.category) {
                return res.api.validationErrors({
                    "category": "category must be required"
                })
            }

            try {
                await this.prepareUrlMetadata(forum.link, true)
            } catch (error) {
                return res.api.validationErrors({
                    'link': 'Invalid link'
                })
            }

            forumData = {
                member_id: req.authMember.id,
                text: forum.text,
                link: !isEmpty(forum.link) ? forum.link : null,
                category: forum.category,
                source_type: profile_type,
                parent_id: parent_id,
                source_id: memberProfile.id,
            }

            forumRes = await this.editOrCreateQuestion(forumData, forum);
        } else {
            const payload: any = { where: { id: parent_id } }
            const forums = await this.forumService.findById(payload)
            forumData = {
                member_id: req.authMember.id,
                text: forum.text,
                category: forums.category,
                source_type: profile_type,
                parent_id: parent_id,
                source_id: memberProfile.id
            }
            forumRes = await this.forumService.create(forumData)

            await saveNotification({
                from_member_id: req.authMember.id,
                to_member_id: forums.member_id,
                notification_type: CONSTANT.NOTIFICATION_EVENT_TYPE.user_answered_on_your_forum_question,
                meta: JSON.stringify({
                    question_id: parent_id,
                    answer_id: forumRes.id,
                })
            });
        }

        // store image
        if (!isEmpty(req.files) && !isEmpty(forum.links)) {
            await this.addLinks(forum.links, forumRes.id);
        } else {
            if (!isEmpty(req.files)) {
                await this.addImages(req.files, forumRes.id)
            }

            // for question and answer        
            if (!isEmpty(forum.links)) {
                await this.addLinks(forum.links, forumRes.id);
            }
        }

        if (!isEmpty(forum.hashtags)) {
            await this.addHashtags(forum.hashtags, forumRes.id);
        }

        let filter: any = {
            where: { id: forumRes.id }
        }
        if (parent_id != 0) {
            filter = {
                ...filter,
                include: [CONSTANT.RELATIONSHIP.forum_hashtags, CONSTANT.RELATIONSHIP.forum_links, CONSTANT.RELATIONSHIP.parent, CONSTANT.RELATIONSHIP.forum_comments]
            }
        }
        let response: any = await _json(this.forumService.findForum(filter))

        if (!isEmpty(response.forum_hashtags)) {
            response.forum_hashtags = response.forum_hashtags.map((item: any) => item.name);
        }

        if (!isEmpty(response.forum_links)) {
            response.forum_links = response.forum_links.map((item: any) => item.link);
        }

        if (parent_id == 0) {
            response.link_info = await this.prepareUrlMetadata(response.link)
        }

        response.is_my_post = true

        res.api.create(
            {
                forum: response,
                is_profile_completed: true,
                profile_type: profileType
            }
        )
    }

    public getQuestionList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let operation: any = (_bool(filter.is_waiting_response) == true) ? Op.notIn : Op.in;
        let payload: any = {
            where: {
                status: ForumService.STATUS_PUBLIC,
                parent_id: 0,
                id: {
                    [operation]: await this.forumService.questionListIds()
                }
            }
        }

        if (filter.category) {
            payload.where = {
                ...payload.where,
                category: filter.category,
            }
        }

        if (!isEmpty(filter.question_ids)) {
            payload.where = {
                ...payload.where,
                id: filter.question_ids,
            }
        }

        if (_bool(filter.is_waiting_response) == false || !isEmpty(filter.question_ids)) {
            payload = {
                ...payload,
                ... {
                    include: {
                        model: Forum,
                        as: CONSTANT.RELATIONSHIP.child,
                        where: {
                            status: ForumService.STATUS_PUBLIC
                        },
                        order: [[CONSTANT.DEFAULT_ORDER.FIELD, CONSTANT.DEFAULT_ORDER.TYPE]],
                    }
                }
            }
        }

        let list: any = await _json(this.forumService.pagination(page, payload))

        list.rows = await Promise.all(list.rows.map(async (forum: any): Promise<any> => {
            forum = {
                ...forum,
                ... await this.getLikeDislike(forum.id),
            }
            if (req.authMember) {
                let vote = await this.formsUpDownVoteService.likeFlag(forum.id, req.authMember.id);
                forum.like_flag = !isEmpty(vote);
                if (forum.like_flag) {
                    forum.vote_type = vote.vote_type
                }
                forum.is_my_post = (req.authMember.id == forum.member_id)

                forum.client_profile = await _json(this.profileService.findProfile({
                    where: { member_id: forum.member_id },
                    include: CONSTANT.RELATIONSHIP.profile_picture
                }, CONSTANT.MEMBER.CLIENT))

                if (!isEmpty(forum.client_profile)) {
                    forum.client_profile.profile_picture = isEmpty(forum.client_profile.profile_picture) ? null : forum.client_profile.profile_picture.file_path;
                }
            }

            forum.total_reports = await this.forumReportService.myReportCount(forum.id, ForumReportService.REPORT_TYPE_QUESTION)
            forum.total_response = !isEmpty(forum.child) ? forum.child.length : 0;
            if (_bool(filter.is_waiting_response) == false) {
                forum.child.length = 1;
                forum.latest_response = forum.child;
                delete forum.child;
            }
            forum.link_info = await this.prepareUrlMetadata(forum.link);
            return forum;
        }));

        res.api.create(list);
    }

    private getLikeDislike = async (id: number) => {
        let likeFilter: any = {
            where: {
                forum_id: id
            },
        }
        let totalResponse: any = await this.formsUpDownVoteService.getLikeDislike(likeFilter)
        let like = totalResponse.filter((data: any) => data.vote_type == 1).length
        return {
            total_upvote: like,
            total_downvote: totalResponse.length - like
        };

    }

    public forumVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const vote = req.body
        let data: any = {
            like_flag: true,
            vote_type: vote.vote_type
        }
        var payload: any;
        if (!isEmpty(vote.forum_id)) {
            payload = {
                where: {
                    member_id: req.authMember.id,
                    forum_id: vote.forum_id
                }
            }
        }
        const forums = await this.formsUpDownVoteService.getVote(payload)
        if (forums) {
            let voteData: any = {
                member_id: req.authMember.id,
                forum_id: vote.forum_id,
                vote_type: vote.vote_type
            }

            const isRemoveVote = !isEmpty(await this.formsUpDownVoteService.getVote({ where: voteData }));
            if (isRemoveVote) {
                await this.formsUpDownVoteService.destroy({ where: voteData })
                data.like_flag = false;
            } else {
                await this.formsUpDownVoteService.update(voteData, { where: { id: forums.id } })
            }

        } else {
            let voteData: any = {
                member_id: req.authMember.id,
                forum_id: vote.forum_id,
                vote_type: vote.vote_type
            }
            await this.formsUpDownVoteService.create(voteData)
        }
        res.api.create({
            "forums": data,
            ...await this.getLikeDislike(vote.forum_id)
        })
    }

    public editForum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const forum_id: any = req.params.id;
        const payload: any = { where: { id: forum_id } }
        const forum = req.body
        const forums = await this.forumService.findById(payload)

        if (!isEmpty(req.body.delete_forum_image_ids)) {
            const deleteForumImageIds: any = req.body.delete_forum_image_ids;
            //delete image
            let images: any = []
            images = await convertToArray(deleteForumImageIds);
            for (let id of images) {
                let imageData = await this.forumImageService.findById({ where: { id: parseInt(id) } });
                if (!isEmpty(imageData)) {
                    await removeFile(imageData.file_path)
                    await this.forumImageService.destory({ where: { id: parseInt(imageData.id) } })
                }
            }
        }
        if (forums.parent_id == 0) {
            const forumData: any = {
                text: forum.text,
                link: forum.link,
                category: forum.category
            }
            try {
                await this.prepareUrlMetadata(forum.link, true);
            } catch (error) {
                return res.api.validationErrors({
                    'link': 'Invalid link'
                })
            }

            await this.forumService.update(forumData, { where: { id: forum_id } })
            const updateCategory: any = {
                category: forum.category
            }
            await this.forumService.update(updateCategory, { where: { parent_id: forum_id } })
            await this.forumReportService.update(updateCategory, { where: { source_id: forum_id } });

        } else {
            let forumImages: any = await this.forumImageService.findAll({ where: { forum_id: forum_id } })
            await this.removeForumImages(forumImages);
            await this.formsLinkService.delete({ where: { forum_id: forum_id } })

            if (!isEmpty(req.files)) {
                if (!isEmpty(req.files)) {
                    await this.addImages(req.files, forum_id)
                }
            } else if (!isEmpty(forum.links)) {
                if (!isEmpty(forum.links)) {
                    await this.addLinks(forum.links, forum_id);
                }
            }

            await this.forumHashtagService.delete({ where: { forum_id: forum_id } })
            const forumData: any = {
                text: forum.text
            }
            await this.forumService.update(forumData, { where: { id: forum_id } })


            if (!isEmpty(forum.hashtags)) {
                await this.addHashtags(forum.hashtags, forum_id);
            }
        }

        // store image 


        let filter: any = {
            where: { id: forum_id, status: ForumService.STATUS_PUBLIC },

        }
        if (forums.id != 0) {
            filter = {
                ...filter,
                include: [CONSTANT.RELATIONSHIP.forum_hashtags, CONSTANT.RELATIONSHIP.parent,
                CONSTANT.RELATIONSHIP.forum_links, CONSTANT.RELATIONSHIP.forum_images,
                {
                    model: ForumComments,
                    as: CONSTANT.RELATIONSHIP.forum_comments,
                    where: {
                        status: ForumService.STATUS_PUBLIC
                    },
                    required: false
                }
                ],
            }
        }
        const response: any = await _json(this.forumService.findForum(filter))
        if (!isEmpty(response.forum_hashtags)) {
            response.forum_hashtags = response.forum_hashtags.map((item: any) => item.name);
        }

        if (!isEmpty(response.forum_links)) {
            response.forum_links = response.forum_links.map((item: any) => item.link);
        }

        if (!isEmpty(response.forum_images)) {
            response.forum_images = response.forum_images.map((item: any) => getImagePath(item.file_path));
        }

        if (forums.parent_id == 0) {
            response.link_info = await this.prepareUrlMetadata(response.link);
        }

        res.api.create({
            "forum": response
        })
    }

    public deleteForum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);

        await this.forumService.softDeleteQuestion([Id])
        res.api.create({
            'message': 'Forum Deleted Successfully'
        });
    }

    public getForumsResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let payload: any = {
            where: {
                status: ForumService.STATUS_PUBLIC,
                parent_id: {
                    [Op.ne]: 0
                }
            },
            include: ['forum_links', 'forum_images',
                {
                    model: ForumHashtag,
                    as: CONSTANT.RELATIONSHIP.forum_hashtags
                },
                {
                    model: Forum,
                    as: CONSTANT.RELATIONSHIP.parent,
                },
                {
                    model: ForumComments,
                    as: CONSTANT.RELATIONSHIP.forum_comments,
                    where: {
                        status: ForumService.STATUS_PUBLIC,
                        parent_id: 0
                    },
                    required: false,
                    include: {
                        model: ForumComments,
                        as: CONSTANT.RELATIONSHIP.child_comment,
                        where: {
                            status: ForumService.STATUS_PUBLIC
                        },
                        required: false
                    }
                }]
        }
        if (filter.category) {
            payload.where = {
                ...payload.where,
                category: filter.category,
            }
        }

        if (!isEmpty(filter.response_ids)) {
            payload.where = {
                ...payload.where,
                id: filter.response_ids,
            }
        }

        if (!isEmpty(filter.question_ids)) {
            payload.include = payload.include.map((item: any) => {
                if (!isEmpty(item.as) && item.as == CONSTANT.RELATIONSHIP.parent) {
                    return {
                        ...item, where: { id: filter.question_ids }
                    }
                }
                return item;
            })
        }

        if (!isEmpty(filter.hashtag)) {
            payload.include = payload.include.map((item: any) => {
                if (!isEmpty(item.as) && item.as == CONSTANT.RELATIONSHIP.forum_hashtags) {
                    return {
                        ...item, where: {
                            name: {
                                [Op.iLike]: '%' + filter.hashtag + '%'
                            }
                        }
                    }
                }
                return item;
            })
        }

        let list: any = await _json(this.forumService.pagination(page, payload))

        list.rows = await Promise.all(list.rows.map(async (forum: any): Promise<any> => {
            forum = {
                ...forum,
                ... await this.getLikeDislike(forum.id)
            }
            if (!isEmpty(forum.forum_hashtags)) {
                forum.forum_hashtags = forum.forum_hashtags.map((item: any) => item.name);
            }
            if (!isEmpty(forum.forum_links)) {
                forum.forum_links = forum.forum_links.map((item: any) => item.link);
            }

            if (req.authMember) {
                let vote = await this.formsUpDownVoteService.likeFlag(forum.id, req.authMember.id);
                forum.like_flag = !isEmpty(vote);
                if (forum.like_flag) {
                    forum.vote_type = vote.vote_type
                }
                forum.is_my_post = (req.authMember.id == forum.member_id)
                forum.side_character_profile = await _json(this.profileService.findProfile({
                    where: { member_id: forum.member_id },
                    include: CONSTANT.RELATIONSHIP.profile_picture
                }, CONSTANT.MEMBER.SIDE_CHARACTER))

                if (!isEmpty(forum.side_character_profile)) {
                    forum.side_character_profile.profile_picture = isEmpty(forum.side_character_profile.profile_picture) ? null : forum.side_character_profile.profile_picture.file_path;
                }
            }
            forum.total_reports = await this.forumReportService.myReportCount(forum.id, ForumReportService.REPORT_TYPE_RESPONSE)

            forum.forum_images = forum.forum_images.map((image: any) => {
                return getImagePath(image.file_path)
            })

            forum.forum_comments = await Promise.all(forum.forum_comments.map(async (item: any) => {
                item.name = await this.getNickNameByProfile(item.member_id, CONSTANT.MEMBER.SIDE_CHARACTER)
                delete item.member;
                item.total_reports = await this.forumReportService.myReportCount(item.id, ForumReportService.REPORT_TYPE_COMMENT)
                if (!isEmpty(req.authMember)) {
                    item.is_my_post = (req.authMember.id == item.member_id)
                }

                item.profile_picture = await this.profileService.findProfileImagesByMemberId({
                    where: { member_id: item.member_id }
                }, CONSTANT.MEMBER.SIDE_CHARACTER)

                item.child_comment = await Promise.all(item.child_comment.map(async (child: any) => {
                    child.name = await this.getNickNameByProfile(child.member_id, CONSTANT.MEMBER.SIDE_CHARACTER)

                    child.profile_picture = await this.profileService.findProfileImagesByMemberId({
                        where: { member_id: child.member_id }
                    }, CONSTANT.MEMBER.SIDE_CHARACTER)

                    child.total_reports = await this.forumReportService.myReportCount(child.id, ForumReportService.REPORT_TYPE_COMMENT)
                    if (!isEmpty(req.authMember)) {
                        child.is_my_post = (req.authMember.id == child.member_id)
                    }
                    return child;
                }))
                return item;
            }))

            forum.question = forum.parent;
            delete forum.parent;
            let profile: any = await this.profileService.findProfile({
                where: { member_id: forum.question.member_id }
            }, CONSTANT.MEMBER.CLIENT)
            forum.question.name = (!isEmpty(profile)) ? profile.nick_name : ''

            return forum;
        }));

        list.question = null;
        if (!isEmpty(filter.question_ids)) {
            list.question = await _json(this.forumService.findById({
                where: {
                    id: filter.question_ids
                }
            }));
        }
        res.api.create(list);
    }

    public createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const forum = req.body
        let profileData: any = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, CONSTANT.MEMBER.SIDE_CHARACTER)

        // if (isEmpty(profileData)) {
        //     return res.api.badResponse({
        //         is_profile_completed: false,
        //         profile_type: CONSTANT.MEMBER.SIDE_CHARACTER
        //     })
        // }


        if (Number(req.authMember.side_character_profile_progress) < CONSTANT.BASIC_VALIDATION.profile_needed_progress) {
            return res.api.badResponse({
                is_profile_completed: false,
                profile_type: CONSTANT.MEMBER.SIDE_CHARACTER,
                switch_response: await this.profileService.switchAccount(req.authMember.id, CONSTANT.MEMBER.SIDE_CHARACTER)
            })
        }

        let profile: any = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, forum.registration_type)

        // if (isEmpty(profileData)) {
        //     return res.api.badResponse({
        //         is_profile_completed: false,
        //         profile_type: forum.registration_type
        //     })
        // }

        let forumData: any = {
            member_id: req.authMember.id,
            forum_id: forum.forum_id,
            text: forum.text,
            source_type: (forum.registration_type == CONSTANT.MEMBER.CLIENT) ? CONSTANT.MEMBER_TYPE.CLIENT : CONSTANT.MEMBER_TYPE.SIDE_CHARACTER,
            source_id: profile.id,
        }

        if (!isEmpty(forum.parent_id) && forum.parent_id != 0) {
            let comment: any = await this.forumCommentService.findOne({
                where: { id: forum.parent_id, parent_id: 0 }
            })
            if (isEmpty(comment)) {
                return res.api.validationErrors({
                    'parent_id': 'Invalid Id'
                })
            }

            forumData = { ...forumData, parent_id: forum.parent_id }
            forumData.forum_id = comment.forum_id
        }

        let response: any = await _json(this.forumCommentService.create(forumData))

        let answer: any = await this.forumService.findById({
            where: { id: response.forum_id }
        })

        await saveNotification({
            from_member_id: req.authMember.id,
            to_member_id: answer.member_id,
            notification_type: CONSTANT.NOTIFICATION_EVENT_TYPE.user_commented_on_your_forum_answered,
            meta: JSON.stringify({
                question_id: answer.parent_id,
                answer_id: answer.id,
                comment_id: response.id
            })
        });


        response.name = profileData.nick_name
        response.is_my_post = true

        response.side_character_profile = await _json(this.profileService.findProfile({
            where: { member_id: req.authMember.id },
            include: CONSTANT.RELATIONSHIP.profile_picture
        }, CONSTANT.MEMBER.SIDE_CHARACTER))

        if (!isEmpty(response.side_character_profile)) {
            response.profile_picture = isEmpty(response.side_character_profile.profile_picture) ? null : response.side_character_profile.profile_picture.file_path;
        }
        delete response.side_character_profile;

        res.api.create({
            "response": response,
            is_profile_completed: true,
            profile_type: CONSTANT.MEMBER.SIDE_CHARACTER
        })
    }

    public editComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const forum = req.body
        const Id = parseInt(req.params.Id)

        let filter: any = {
            where: { id: Id }
        }

        let comment: any = await this.forumCommentService.findOne(filter)
        if (isEmpty(comment)) {
            return res.api.validationErrors({
                'Id': 'Invalid Id'
            })
        }

        let forumData: any = {
            text: forum.text,
        }

        await this.forumCommentService.update(forumData, filter)

        res.api.create({
            'message': 'comment updated successfully'
        })
    }

    public deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)

        let filter: any = {
            where: {
                [Op.or]: {
                    id: Id,
                    parent_id: Id
                }
            }
        }

        let comment: any = await this.forumCommentService.findAll(filter)
        if (isEmpty(comment)) {
            return res.api.validationErrors({
                'Id': 'Invalid Id'
            })
        }

        await this.forumCommentService.softDelete(filter)
        res.api.create({
            'message': 'comment deleted successfully'
        })
    }

    public addImages = async (file: any, id: number): Promise<void> => {

        let forumImages = await convertToArray(file.forum_image);
        // save forum images
        for (const image of forumImages) {
            const forumFiles: any = await saveFile(image, 'forum')
            let imgData: any = {
                forum_id: id,
                file_name: forumFiles.file_name,
                original_file_name: image.name,
                file_type: image.mimetype,
                file_path: forumFiles.upload_path,
            }
            await this.forumImageService.create(imgData);
        }
    }

    public addLinks = async (link: any, id: number): Promise<void> => {
        let links: any = await convertToArray(link);
        for (const link of links) {
            const links: any = {
                forum_id: id,
                link: link
            }
            await this.formsLinkService.create(links)
        }
    }

    public addHashtags = async (hashtags: any, id: number): Promise<void> => {
        let forumHashtsgs: any = await convertToArray(hashtags);
        for (const hashtag of forumHashtsgs) {
            const hashtagdata: any = {
                forum_id: id,
                name: hashtag
            }
            await this.forumHashtagService.create(hashtagdata)
        }
    }

    public reportUnreport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.body;

        let foruumData: any;
        switch (filter.report_type) {
            case ForumReportService.REPORT_TYPE_QUESTION:
            case ForumReportService.REPORT_TYPE_RESPONSE:
                foruumData = await this.forumService.findById({
                    where: { id: filter.source_id }
                })
                break;

            case ForumReportService.REPORT_TYPE_COMMENT:
                foruumData = await this.forumCommentService.findOne({
                    where: { id: filter.source_id }
                })

                if (!isEmpty(foruumData)) {
                    foruumData = await this.forumService.findById({
                        where: { id: foruumData.forum_id }
                    })
                }

                break;

            default:
                break;
        }

        if (isEmpty(foruumData)) {
            return res.api.validationErrors({
                'source_id': 'invalid Id'
            })
        }

        const profileType: any = (filter.registration_type == CONSTANT.MEMBER.CLIENT) ? ForumReportService.PROFILE_TYPE_CLIENT : ForumReportService.PROFILE_TYPE_SIDE_CHARACTER
        const profile: any = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, filter.registration_type)

        if (isEmpty(profile)) {
            return res.api.validationErrors({
                'profile': 'invalid profile'
            })
        }

        const payload: any = {
            report_type: filter.report_type,
            source_id: filter.source_id,
            member_id: parseInt(req.authMember.id + ""),
            profile_type: profileType,
            profile_id: profile.id,
            category: foruumData.category
        };

        const report_flag = await this.forumReportService.create(payload);
        res.api.create({
            report_flag
        });
    }

    private editOrCreateQuestion = async (payload: any, filter: any): Promise<void> => {
        let forumRes: any;
        payload.status = (!isEmpty(filter.is_draft) && _bool(filter.is_draft)) ? ForumService.STATUS_DREFT : ForumService.STATUS_PUBLIC

        let filter1 = {
            where: {
                member_id: payload.member_id,
                status: ForumService.STATUS_DREFT
            }
        }

        let draftForum: any = await this.forumService.findById(filter1);

        if (isEmpty(draftForum)) {
            forumRes = await this.forumService.create(payload)
        } else {
            const forumData: any = {
                text: filter.text,
                link: filter.link,
                category: filter.category,
                status: payload.status
            }
            await this.forumService.update(forumData, { where: { id: draftForum.id } })
            const updateCategory: any = {
                category: filter.category
            }
            await this.forumService.update(updateCategory, { where: { parent_id: draftForum.id } })
            await this.forumReportService.update(updateCategory, { where: { source_id: draftForum.id } });
            forumRes = await this.forumService.findById({
                where: { id: draftForum.id }
            })
        }
        return forumRes
    }

    public findDraftQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let filter = {
            where: {
                member_id: req.authMember.id,
                status: ForumService.STATUS_DREFT
            }
        }

        let draftForum: any = await this.forumService.findById(filter);
        if (!isEmpty(draftForum)) {
            try {
                draftForum.link_info = await this.prepareUrlMetadata(draftForum.link, true)
            } catch (error) {
                return res.api.validationErrors({
                    'link': 'Invalid link',
                })
            }
        }

        res.api.create({
            'question': draftForum,
            'is_draft': (!isEmpty(draftForum))
        })
    }

    private getNickNameByProfile = async (memberId: any, profileType: any): Promise<void> => {
        let profile: any = await this.profileService.findProfile({
            where: { member_id: memberId }
        }, profileType)
        return !isEmpty(profile) ? profile.nick_name : ''
    }

    private removeForumImages = async (imagesData: any): Promise<any> => {
        if (isEmpty(imagesData)) {
            return false;
        }
        let images: any = []
        images = await convertToArray(imagesData);

        for (let image of images) {
            await removeFile(image.file_path)
            await this.forumImageService.destory({ where: { id: parseInt(image.id) } })
        }
    }

    private prepareUrlMetadata = async (link: string, isThrowError = false): Promise<any> => {
        if (isEmpty(link)) {
            return link;
        }

        let data: any = ['www.', 'http://', 'https://'];
        let flag = false;
        let addedPrefix: any;
        data.forEach((item: any) => {
            if (link.includes(item)) {
                flag = true;
                addedPrefix = item;
            }
        });

        if (flag) {
            try {
                return await urlMetadata(link);
            } catch (error) {
                link = link.replace(addedPrefix, '')
            }
        }

        let fullLink = '';
        let linkInfo = null;
        for await (const prefix of data) {
            try {
                fullLink = prefix + link;
                linkInfo = await urlMetadata(fullLink);
                fullLink = '';
                break;
            } catch (error) {
                fullLink = '';
                linkInfo = null;
            }
        }

        if (isThrowError) {
            new Error('Invalid Link');
        }

        return linkInfo;
    }

}