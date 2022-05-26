import { Request, Response, NextFunction } from 'express'
import { CoinsUseHistoryService, MemberService, PaymentHistoryService, ProjectService, ReportService, SideCharacterProfileService } from '../../services'
import { inArray, isEmpty, _json } from '../../utils/helper';
import { Op } from 'sequelize';
import Member from '../../models/member';
import moment from 'moment';
import ProfileService from '../../services/profile.service';
import _, { isArray } from 'lodash';
import { MEMBER, MEMBER_TYPE, RELATIONSHIP } from '../../constants';
import ForumService from '../../services/forum.service';
import ForumCommentsService from '../../services/forumComments.service';
import Forum from '../../models/forum';
import ForumReportService from '../../services/forumReport.service';
import sequelize from 'sequelize';
import ForumComments from '../../models/forum_comments';
import { profile } from 'winston';

export default class ForumSettingController {

    public memberService = new MemberService()
    public profileService = new ProfileService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public paymentHistoryService = new PaymentHistoryService();
    public coinsUseHistoryService = new CoinsUseHistoryService();
    public reportService = new ReportService();
    public forumCommentService = new ForumCommentsService()
    public forumReportService = new ForumReportService()

    public forumService = new ForumService();

    public getForumQuestionList = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const filter = req.query;
        const page = parseInt(filter.page);
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';

        let payload: any = {
            where: { parent_id: 0 },
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: RELATIONSHIP.client.client_profile
                },
                RELATIONSHIP.child
            ]
        }

        const where = this.__preparedWhere(filter, payload);
        const list: any = await this.forumService.pagination(page, where, true, sortDirection);

        list.rows = await Promise.all(list.rows.map(async (forum: any): Promise<any> => {
            var forum = JSON.parse(JSON.stringify(forum));
            forum.total_response = (!isEmpty(forum.child)) ? forum.child.length : 0;
            // forum.name = (isEmpty(forum.member.name) && !isEmpty(forum.member.client_profile)) ? forum.member.client_profile.nick_name : forum.member.name
            forum.name = forum.member.name;
            forum.total_reports = await this.forumReportService.findCount({
                where: {
                    source_id: forum.id,
                    report_type: ForumReportService.REPORT_TYPE_QUESTION
                }
            });
            delete forum.child;
            delete forum.member;
            return forum;
        }));

        res.api.create(list);
    }

    public findQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);

        let payload: any = {
            where: { id: Id },
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: RELATIONSHIP.client.client_profile
                },
                {
                    model: Forum,
                    as: RELATIONSHIP.child,
                    where: {
                        status: {
                            [Op.ne]: ProjectService.STATUS_DELETED
                        }
                    },
                    required: false,
                    include: [
                        {
                            model: Member,
                            as: RELATIONSHIP.member,
                            include: RELATIONSHIP.side_character_profile
                        },
                    ]
                },
            ]
        }


        const question: any = await _json(this.forumService.findById(payload));

        if (isEmpty(question)) {
            return res.api.validationErrors({
                'Id': 'invalid Id'
            });
        }

        question.total_response = (!isEmpty(question.child)) ? question.child.length : 0;
        // question.name = (isEmpty(question.member.name) && !isEmpty(question.member.client_profile)) ? question.member.client_profile.nick_name : question.member.name
        question.name = question.member.name
        question.responses = await Promise.all(question.child.map(async (item: any) => {
            item.name = (isEmpty(item.member.name) && !isEmpty(item.member.side_character_profile)) ? item.member.side_character_profile.nick_name : item.member.name
            delete item.member;
            return item;
        }))

        delete question.child;
        delete question.member;
        question.total_reports = await this.forumReportService.findCount({
            where: {
                source_id: question.id,
                report_type: ForumReportService.REPORT_TYPE_RESPONSE
            }
        });
        res.api.create({
            question
        });
    }

    public deleteForums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let deletedIds = req.body.deleted_ids

        await this.forumService.softDeleteQuestion(deletedIds)
        res.api.create({
            "message": "Question Deleted Successfully"
        });
    }

    public getForumResponseList = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const filter = req.query;
        const page = parseInt(filter.page);
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';

        let payload: any = {
            where: {
                parent_id: {
                    [Op.ne]: 0
                }
            },
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: RELATIONSHIP.side_character_profile
                },
                {
                    model: Forum,
                    as: RELATIONSHIP.parent
                },
                {
                    model: ForumComments,
                    as: RELATIONSHIP.forum_comments,
                    where: {
                        status: {
                            [Op.ne]: ProjectService.STATUS_DELETED
                        }
                    },
                    required: false,
                }
            ]
        }

        let searchFields = ['all', 'name', 'question', 'response'];

        if (filter.field && inArray(filter.field, searchFields) && filter.q && filter.q.trim().length != 0) {
            if (filter.field == 'all') {
                // let orWhere: any = ['$member.name$', '$parent.text$', 'text'].map((field: any) => {
                //     if (inArray(field, ['$parent.text$'])) {
                //         return {
                //             [Op.and]: {
                //                 [field]: {
                //                     [Op.iLike]: '%' + filter.q.trim() + '%'
                //                 },
                //                 // parent_id: (field == '$parent.text$') ? 0 : 1
                //             }
                //         }
                //     } else {
                //         return {
                //             [field]: {
                //                 [Op.iLike]: '%' + filter.q.trim() + '%'
                //             }
                //         }
                //     }
                //     return {
                //         [field]: {
                //             [Op.iLike]: '%' + filter.q.trim() + '%'
                //         }
                //     }
                // })

                // payload.where = {
                //     ...payload.where,
                //     [Op.or]: orWhere
                // }
            } else {
                if (filter.field == 'name') {
                    payload.include = payload.include.map((item: any) => {
                        if (!isEmpty(item.as) && item.as == RELATIONSHIP.member) {
                            return {
                                ...item, where: {
                                    [filter.field]: {
                                        [Op.iLike]: '%' + filter.q + '%'
                                    }
                                }
                            }
                        }
                        return item;
                    })
                }

                if (filter.field == 'question') {
                    payload.include = payload.include.map((item: any) => {
                        if (!isEmpty(item.as) && item.as == RELATIONSHIP.parent) {
                            return {
                                ...item, where: {
                                    text: {
                                        [Op.iLike]: '%' + filter.q + '%'
                                    }
                                }
                            }
                        }
                        return item;
                    })
                }

                if (filter.field == 'response') {
                    payload.where = {
                        ...payload.where,
                        text: {
                            [Op.iLike]: '%' + filter.q + '%'
                        }
                    }
                }
            }
        }

        if (filter.field == 'all') {
            payload = {
                include: payload.include,
                parent_id: 0,
                operation: '!=',
                q: filter.q.trim(),
                type: 'all',
                forum_type: 'response'
            }
        }

        const where = this.__preparedWhere(filter, payload, 'answer');
        const list: any = await this.forumService.pagination(page, where, true, sortDirection);

        list.rows = await Promise.all(list.rows.map(async (forum: any): Promise<any> => {
            var forum = JSON.parse(JSON.stringify(forum));
            forum.total_comments = (!isEmpty(forum.forum_comments)) ? forum.forum_comments.length : 0;
            forum.total_reports = await this.forumReportService.findCount({
                where: {
                    source_id: forum.id,
                    report_type: ForumReportService.REPORT_TYPE_RESPONSE
                }
            });
            // forum.name = (isEmpty(forum.member.name) && !isEmpty(forum.member.side_character_profile)) ? forum.member.side_character_profile.nick_name : forum.member.name
            forum.name = forum.member.name
            forum.question = forum.parent.text;
            delete forum.forum_comments;
            delete forum.member;
            delete forum.parent;
            return forum;
        }));

        res.api.create(list);
    }

    public findResponseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);

        let payload: any = {
            where: {
                id: Id,
                parent_id: {
                    [Op.ne]: 0
                }
            },
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: RELATIONSHIP.side_character_profile
                },
                {
                    model: Forum,
                    as: RELATIONSHIP.parent,
                },
                {
                    model: ForumComments,
                    as: RELATIONSHIP.forum_comments,
                    include: RELATIONSHIP.member,
                    where: {
                        status: {
                            [Op.ne]: ProjectService.STATUS_DELETED
                        }
                    },
                    required: false,
                },
            ]
        }
        const response: any = await _json(this.forumService.findById(payload));
        if (isEmpty(response)) {
            return res.api.validationErrors({
                'Id': 'Invalid Id'
            })
        }

        response.total_comments = (!isEmpty(response.forum_comments)) ? response.forum_comments.length : 0;
        response.total_reports = 0;
        response.total_reports = await this.forumReportService.findCount({
            where: {
                source_id: response.id,
                report_type: ForumReportService.REPORT_TYPE_RESPONSE
            }
        });
        // response.name = (isEmpty(response.member.name) && !isEmpty(response.member.side_character_profile)) ? response.member.side_character_profile.nick_name : response.member.name
        response.name = response.member.name
        response.forum_comments = await Promise.all(response.forum_comments.map(async (item: any) => {
            let profile: any = await this.profileService.findProfile({
                where: { member_id: item.member_id }
            }, MEMBER.SIDE_CHARACTER)
            item.name = (isEmpty(item.member.name) && !isEmpty(profile)) ? profile.nick_name : item.member.name
            // item.name = item.member.name
            delete item.member;
            return item;
        }))
        response.question = response.parent.text;
        delete response.parent;
        delete response.member;

        res.api.create({
            response
        });
    }

    public deleteResponseForum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let deletedIds = req.body.deleted_ids

        await this.forumService.softDeleteResponse(deletedIds)
        res.api.create({
            "message": "Response Deleted Successfully"
        });
    }

    public deletComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    // for active & termination query builder
    private __preparedWhere(filter: any, payload: any, type = 'question'): any {
        let where: any = {
            status: {
                [Op.ne]: ProjectService.STATUS_DELETED
            }
        }

        if (!isEmpty(filter.category) && filter.category != 'all') {
            where = {
                ...where, category: filter.category
            }
        }

        let searchFields = ['all', 'name', 'text'];

        if (type == 'question') {
            if (filter.field && inArray(filter.field, searchFields) && filter.q && filter.q.trim().length != 0) {
                if (filter.field == 'all') {
                    // let orWhere: any = ['$member.name$', 'text'].map((field: any) => {
                    //     return {
                    //         [field]: {
                    //             [Op.iLike]: '%' + filter.q.trim() + '%'
                    //         }
                    //     }
                    // })

                    return {
                        include: payload.include,
                        parent_id: 0,
                        operation: '=',
                        q: filter.q.trim(),
                        type: 'all',
                        forum_type: type
                    }
                } else {
                    if (filter.field == 'name') {
                        payload.include = payload.include.map((item: any) => {
                            if (!isEmpty(item.as) && item.as == RELATIONSHIP.member) {
                                return {
                                    ...item, where: {
                                        [filter.field]: {
                                            [Op.iLike]: '%' + filter.q + '%'
                                        }
                                    }
                                }
                            }
                            return item;
                        })
                    } else {
                        where = {
                            ...where,
                            [filter.field]: {
                                [Op.iLike]: '%' + filter.q + '%'
                            }
                        }
                    }
                }
            }
        }

        // 2020-12-12 00:00:00
        if (filter.start_date && filter.end_date) {
            where = {
                ...where, created_at: {
                    [Op.between]: [`${moment(filter.start_date).format("YYYY-MM-DD")} 00:00:00.000000`, `${moment(filter.end_date).add(1, "days").format().slice(0, 10)} 00:00:00.000000`]
                }
            }
        } else if (filter.start_date) {
            where = {
                ...where, created_at: {
                    [Op.gte]: `${moment(filter.start_date).format("YYYY-MM-DD")} 00:00:00.000000`
                }
            }
        } else if (filter.end_date) {
            where = {
                ...where, created_at: {
                    [Op.lte]: `${moment(filter.end_date).add(1, "days").format().slice(0, 10)} 00:00:00.000000`
                }
            }
        }
        payload = {
            ...payload, where: {
                ...payload.where,
                ...where
            }
        }

        if (filter.field == 'all' && filter.q && filter.q.trim().length != 0) {
            payload = { ...payload, subQuery: false }
        }
        return payload;
    }

    public formReportList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';

        let where = `where (
                 (forum_report.report_type = 'question' and exists(select * from forum where id = forum_report.source_id and status != 'deleted')) or
                (forum_report.report_type = 'response' and exists(select * from forum where id = forum_report.source_id and status != 'deleted')) or
                (forum_report.report_type = 'comment' and exists(select * from forum_comments where id = forum_report.source_id and status != 'deleted'))
            ) and `;

        if (!isEmpty(filter.report_type) && filter.report_type != 'all' && !isEmpty(filter.category) && filter.category != 'all') {
            where += ` report_type = '${filter.report_type}' and category = '${filter.category}'`
        } else {
            if (!isEmpty(filter.report_type) && filter.report_type != 'all') {
                where += ` report_type = '${filter.report_type}'`
            }

            if (!isEmpty(filter.category) && filter.category != 'all') {
                where += ` category = '${filter.category}'`
            }
        }

        if ((isEmpty(filter.report_type) || filter.report_type == 'all') && (isEmpty(filter.category) || filter.category == 'all')) {
            where = `where (
                 (forum_report.report_type = 'question' and exists(select * from forum where id = forum_report.source_id and status != 'deleted')) or
                (forum_report.report_type = 'response' and exists(select * from forum where id = forum_report.source_id and status != 'deleted')) or
                (forum_report.report_type = 'comment' and exists(select * from forum_comments where id = forum_report.source_id and status != 'deleted'))
            )`;
        }

        let list: any = await this.forumReportService.paginate(page, where, sortDirection);

        list.rows = await Promise.all(list.rows.map(async (report: any): Promise<any> => {

            // let profile: any = await _json(this.profileService.findProfile({
            //     where: { id: report.source_id }
            // }, (report.profile_type == MEMBER_TYPE.CLIENT) ? MEMBER.CLIENT : MEMBER.SIDE_CHARACTER));
            // report.source_name = profile.nick_name;

            let sourceObj: any;
            let payload: any;
            switch (report.report_type) {
                case 'question':
                case 'response':
                    let opreration: any = (report.report_type == 'question') ? Op.eq : Op.ne;
                    payload = {
                        where: {
                            id: report.source_id,
                            parent_id: {
                                [opreration]: 0
                            }
                        }
                    }

                    sourceObj = await this.forumService.findById(payload);
                    break;

                case 'comment':
                    payload = {
                        where: {
                            id: report.source_id,
                        }
                    }
                    sourceObj = await this.forumCommentService.findOne(payload);
                    break;

                default:
                    break;
            }

            report.content = (!isEmpty(sourceObj)) ? sourceObj.text : null;
            let member: any = await this.memberService.findById(sourceObj.member_id);
            report.name = member.name;
            return report
        }));
        res.api.create(list);
    }


    public deleteReportedMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { reported_types }: any = req.body;

        for (const reported_type of reported_types) {
            const [report_type, source_id] = reported_type.split('__');
            if (!report_type || !source_id) {
                res.api.validationErrors({
                    reported_type: "Invalid Type",
                });
            }
            await this.forumReportService.destroy({
                where: { report_type, source_id }
            });
        }

        res.api.create({
            message: "Report deleted successfully",
        });
    }

    public findReportedForum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { reported_type }: any = req.query;

        const [report_type, source_id] = reported_type.split('__');

        let forumReport: any = await _json(this.forumReportService.findAll({
            where: { report_type, source_id }
        }));

        let forum_report: any = forumReport[0];

        if (isEmpty(forumReport)) {
            return res.api.validationErrors({
                'Id': 'Invalid Id'
            })
        }

        // let forum_report = forumReport;
        forum_report.total_report = forumReport.length;

        // let profile: any = await _json(this.profileService.findProfile({
        //     where: { id: forum_report.source_id }
        // }, (forum_report.profile_type == MEMBER_TYPE.CLIENT) ? MEMBER.CLIENT : MEMBER.SIDE_CHARACTER));
        // forum_report.source_name = profile.nick_name;

        let payload: any;
        switch (forum_report.report_type) {
            case 'question':
                payload = {
                    where: {
                        id: forum_report.source_id,
                        parent_id: 0
                    },
                    // include: [RELATIONSHIP.child]
                }

                forum_report.source = await _json(this.forumService.findById(payload));
                break;

            case 'response':
                payload = {
                    where: {
                        id: forum_report.source_id,
                        parent_id: {
                            [Op.ne]: 0
                        }
                    },
                    include: [RELATIONSHIP.parent]
                }

                forum_report.source = await _json(this.forumService.findById(payload));
                forum_report.source.question = forum_report.source[RELATIONSHIP.parent];
                delete forum_report.source[RELATIONSHIP.parent]
                break;

            case 'comment':
                payload = {
                    where: {
                        id: forum_report.source_id,
                    },
                    include: [
                        {
                            model: Forum,
                            as: RELATIONSHIP.forum,
                        },
                        {
                            model: ForumComments,
                            as: RELATIONSHIP.parent_comment,
                        }
                    ]
                }
                forum_report.source = await _json(this.forumCommentService.findOne(payload));
                forum_report.source.response = forum_report.source[RELATIONSHIP.forum]
                delete forum_report.source[RELATIONSHIP.forum]
                break;

            default:
                break;
        }

        let member: any = await this.memberService.findById(forum_report.member_id);
        forum_report.name = member.name;

        res.api.create({
            forum_report
        });
    }

    public changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { status }: any = req.body;
        const Id = parseInt(req.params.Id);

        let payload: any = {
            where: {
                [Op.or]: {
                    id: Id,
                    parent_id: Id
                }
            }
        }

        let forum: any = await this.forumService.findById(payload);
        if (isEmpty(forum)) {
            return res.api.validationErrors({
                'Id': 'Invalid Id'
            })
        }

        await this.forumService.update({
            status: status,
        }, payload)

        res.api.create({
            'message': "forum status changed successfully"
        });

    }
}