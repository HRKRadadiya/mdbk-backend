import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { CoinsUseHistoryService, MemberService, PaymentHistoryService, ReportService, RequestService, SideCharacterProfileService } from '../../services'
import { inArray, isEmpty, _json } from '../../utils/helper';
import { MemberPagination } from '../../types';
import { Op } from 'sequelize';
import Member, { MemberInput, MemberOutput } from '../../models/member';
import { ClientProfile, ClientProfileCompany, SideCharacterProfile, SideCharacterProfileField, SideCharacterProfileLocation, SideCharacterProfilePortfolio, SideCharacterProfileWorkExperience } from '../../models';
import moment from 'moment';
import ProfileService from '../../services/profile.service';
import _ from 'lodash';
import { RELATIONSHIP } from '../../constants';

export default class MemberSettingController {

    public memberService = new MemberService()
    public profileService = new ProfileService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public paymentHistoryService = new PaymentHistoryService();
    public coinsUseHistoryService = new CoinsUseHistoryService();
    public reportService = new ReportService();
    public requestService = new RequestService();

    public getAllActiveMembers = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const filter = req.query;
        const page = parseInt(filter.page);
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';
        const where = this.__preparedWhere(filter, MemberService.STATUS_ENABLE);

        this.memberService.pagination(page, where, sortDirection)
            .then((queryResult: MemberPagination) => res.api.create(queryResult))
            .catch((error: Error) => next(error))
    }

    public getAllTerminationMembers = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const filter = req.query;
        const page = parseInt(filter.page);
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';
        const where = this.__preparedWhere(filter, MemberService.STATUS_DISABLE, 'termination_at');

        this.memberService.pagination(page, where, sortDirection)
            .then((queryResult: MemberPagination) => res.api.create(queryResult))
            .catch((error: Error) => next(error))
    }

    public createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const member = req.body

        let isEmailExists: any = await this.memberService.getMemberByEmail(member.email);
        if (!isEmpty(isEmailExists)) {
            return res.api.validationErrors({
                'email': 'email already exists'
            })
        }

        const hashedPassword: any = await bcrypt.hash(member.password, 8);
        const data: MemberInput = {
            name: member.name,
            email: member.email,
            password: hashedPassword,
            login_type: member.login_type || MemberService.LOGIN_TYPE_WEBSITE,
            status: member.status || MemberService.STATUS_ENABLE,
        }

        this.memberService.createMember(data)
            .then(async (member: MemberOutput) => {
                await this.sideCharacterProfileService.createSideCharacterProfile({ member_id: member.id })
                res.api.create({
                    "message": "Member created successfully!!",
                    member,
                })
            }).catch((error: Error) => next(error))

    }

    public updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const member = req.body
        const Id = parseInt(req.params.Id)

        const data: MemberInput = {
            id: Id,
            name: member.name,
            email: member.email,
        }

        this.memberService.updateMember(data)
            .then((member: MemberOutput) => {
                res.api.create({
                    "message": "Member created successfully!!",
                    member,
                })
            }).catch((error: Error) => next(error))
    }


    public fetchMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        return await this.memberService.findById(Id)
            .then((member: MemberOutput) => {
                return res.api.create({
                    member,
                })
            }).catch((error: Error) => next(error))
    }

    public changeMembersTerminationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { status, Ids } = req.body

        const data: { termination_at: Date, status: string } = {
            termination_at: moment().toDate(),
            status: status ? MemberService.STATUS_DISABLE : MemberService.STATUS_ENABLE
        }
        let filter: any = { where: { id: { [Op.in]: Ids } } }

        this.memberService.updateMembersByIds(data, filter)
            .then(() => {
                res.api.create({
                    "message": "Members termination status changed successfully!!",
                })
            }).catch((error: Error) => next(error))
    }

    public fetchMemberFullProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)

        let member = await Member.findOne({
            where: {
                id: Id
            },
            // include: {
            //     all: true,
            //     nested: true
            // }
            include: [
                {
                    model: SideCharacterProfile,
                    as: RELATIONSHIP.side_character_profile,
                    include: [RELATIONSHIP.fields, RELATIONSHIP.locations, RELATIONSHIP.profile_picture, RELATIONSHIP.portfolios, RELATIONSHIP.experiences]
                },
                {
                    model: ClientProfile,
                    as: RELATIONSHIP.client_profile,
                    include: [
                        RELATIONSHIP.fields, RELATIONSHIP.locations, RELATIONSHIP.profile_picture, RELATIONSHIP.client.introductories,
                        {
                            model: ClientProfileCompany,
                            as: RELATIONSHIP.client.company,
                            include: [RELATIONSHIP.fields, RELATIONSHIP.locations, RELATIONSHIP.client.hashtags]
                        }
                    ]
                }
            ]
        });

        let memberData: any;
        if (member) {
            memberData = member.toJSON();
            if (!isEmpty(memberData.side_character_profile)) {
                memberData.side_character_profile.locations = await this.profileService.getLocationWithNameById(memberData.side_character_profile.locations);
            }
            if (!isEmpty(memberData.client_profile)) {
                memberData.client_profile.locations = await this.profileService.getLocationWithNameById(memberData.client_profile.locations);
            }
            if (!isEmpty(memberData.client_profile)) {
                memberData.client_profile.locations = await this.profileService.getLocationWithNameById(memberData.client_profile.locations);
                if (!isEmpty(memberData.client_profile.company)) {
                    memberData.client_profile.company.locations = await this.profileService.getLocationWithNameById(memberData.client_profile.company.locations);
                }
            }
        }

        res.api.create({
            member: memberData,
        })
    }


    // for active & termination query builder
    private __preparedWhere(filter: any, status: string = '', date_column: string = 'created_at'): any {
        let where: any = {}

        if (!isEmpty(status)) {
            where = {
                ...where, 'status': {
                    [Op.eq]: status
                }
            }
        }

        if (filter.field && inArray(filter.field, ['all', 'name', 'email']) && filter.q && filter.q.trim().length != 0) {
            if (filter.field == 'all') {
                let orWhere: any = ['name', 'email'].map((field: any) => {
                    return {
                        [field]: {
                            [Op.iLike]: '%' + filter.q.trim() + '%'
                        }
                    }
                })

                where = {
                    ...where,
                    [Op.or]: orWhere
                }
            } else {
                where = {
                    ...where, [filter.field]: {
                        [Op.iLike]: '%' + filter.q.trim() + '%'
                    }
                }
            }
        }

        // 2020-12-12 00:00:00
        if (filter.start_date && filter.end_date) {
            where = {
                ...where, [date_column]: {
                    [Op.between]: [`${moment(filter.start_date).format("YYYY-MM-DD")} 00:00:00.000000`, `${moment(filter.end_date).add(1, "days").format().slice(0, 10)} 00:00:00.000000`]
                }
            }
        } else if (filter.start_date) {
            where = {
                ...where, [date_column]: {
                    [Op.gte]: `${moment(filter.start_date).format("YYYY-MM-DD")} 00:00:00.000000`
                }
            }
        } else if (filter.end_date) {
            where = {
                ...where, [date_column]: {
                    [Op.lte]: `${moment(filter.end_date).add(1, "days").format().slice(0, 10)} 00:00:00.000000`
                }
            }
        }
        return where;
    }

    public getCoinHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { hystery_type } = req.query;
        const memberId = parseInt(req.params.Id)
        let filter: any = {
            where: { member_id: memberId },
            order: [['created_at', 'desc']],
        }

        try {
            let coinHistory: any = [];
            if (hystery_type == 'coin_use_history') {
                coinHistory = await this.coinsUseHistoryService.findAll(filter);
            } else if (hystery_type == 'payment_history') {
                coinHistory = await this.paymentHistoryService.findAll(filter);
            }

            let member = await this.memberService.findById(memberId);

            res.api.create({
                'coin_history': coinHistory,
                'member_name': member.name
            })
        } catch (error) {
            next(error)
        }
    }

    public coinMemberList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let filter: any = req.query;
            const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
            const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';

            let where = '';
            let whereArr = [];

            if (!isEmpty(filter.q) && !isEmpty(filter.field)) {
                if (filter.field == 'all') {
                    let orWhere = 'where (';
                    ['name', 'email'].forEach((x: any) => {
                        orWhere += `${x} ILIKE '%${filter.q}%' ${x == 'name' ? 'OR ' : ')'}`
                    })
                    whereArr.push(` exists(select * from member ${orWhere} and member_id=id) `)
                } else {
                    filter.q.split(" ").map((x: any) => {
                        whereArr.push(` exists(select * from member where ${filter.field} ILIKE '%${x}%' and member_id=id) `)
                    });
                }
            }

            if (filter.start_date && filter.end_date) {
                whereArr.push(` date(created_at) between '${moment(filter.start_date).format("YYYY-MM-DD")}' and '${moment(filter.end_date).add(1, "days").format().slice(0, 10)} 00:00:00.000000' `)
            } else if (filter.start_date) {
                whereArr.push(` date(created_at) >= '${moment(filter.start_date).format("YYYY-MM-DD")}' `)
            } else if (filter.end_date) {
                whereArr.push(` date(created_at) <= '${moment(filter.end_date).format("YYYY-MM-DD")}' `)
            }

            if (!isEmpty(whereArr)) {
                where = ` where ${where} `
                whereArr.forEach((_condition: any, index: number) => {
                    where += ` ${_condition} `
                    if (whereArr.length !== index + 1) {
                        where += ` and `
                    }
                })
            }

            let list: any = await this.paymentHistoryService.pagination(page, where, sortDirection);
            list.rows = await Promise.all(list.rows.map(async (paymentHistory: any) => {
                return await this.memberService.findById(paymentHistory.member_id);
            }));
            res.api.create(list)
        } catch (error) {
            next(error)
        }
    }

    public reportedMemberList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
        let where = '';

        let isMemberDeleted = `and (
            (report.report_type = '${ReportService.LIKE_TYPE_SIDE_CHARACTER}' and exists (
                select * from side_character_profile where id = report.source_id and exists (select * from member where id = side_character_profile.member_id and status != 'disable')
            )) or
            (report.report_type = '${ReportService.LIKE_TYPE_CLIENT}' and exists (
                select * from client_profile where id = report.source_id and exists (select * from member where id = client_profile.member_id and status != 'disable')
            ))
        )`;

        if (!isEmpty(filter.report_type) && inArray(filter.report_type, [ReportService.LIKE_TYPE_SIDE_CHARACTER, ReportService.LIKE_TYPE_CLIENT])) {
            where = ` where report_type = '${filter.report_type}' ${isMemberDeleted}`
        } else {
            where = ` where report_type IN ('${ReportService.LIKE_TYPE_SIDE_CHARACTER}', '${ReportService.LIKE_TYPE_CLIENT}') ${isMemberDeleted}`
        }

        let list: any = await this.reportService.paginate(page, where);

        list.rows = await Promise.all(list.rows.map(async (report: any): Promise<any> => {

            let profileId = 0;
            if (report.report_type == ReportService.LIKE_TYPE_REQUEST_INTERVIEW || report.report_type == ReportService.LIKE_TYPE_REQUEST_CONTACT_INFORMATION) {
                let request: any = await _json(this.requestService.getRequestById({
                    where: { id: report.source_id }
                }));
                profileId = request.from_member_id;
            } else {
                profileId = report.source_id;
            }

            let registration_type: any;
            if (report.report_type == ReportService.LIKE_TYPE_SIDE_CHARACTER) {
                registration_type = 2;
            } else if (report.report_type == ReportService.LIKE_TYPE_CLIENT) {
                registration_type = 1;
            } else if (report.report_type == ReportService.LIKE_TYPE_REQUEST_INTERVIEW) {
                registration_type = 2;
            } else if (report.report_type == ReportService.LIKE_TYPE_REQUEST_CONTACT_INFORMATION) {
                registration_type = 1;
            }

            if (!isEmpty(registration_type)) {
                let profile: any = await _json(this.profileService.findProfile({
                    where: { id: profileId }
                }, registration_type));
                report.source_name = profile.nick_name;
                report.member_id = profile.member_id;
            }

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
            await this.reportService.destroy({
                where: { report_type, source_id }
            });
        }

        res.api.create({
            message: "Report deleted successfully",
        });
    }

}