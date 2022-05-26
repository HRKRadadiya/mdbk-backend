
import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { NextFunction, Request, Response } from 'express'
import { isEmpty } from '../utils/helper';
import { ClientProfileCompanyService, ClientProfileService, ProfileService, ProjectService, SearchOptionService } from '../services';
import { MEMBER_PROFILE } from '../constants';
import ForumService from '../services/forum.service';
import { isEqualWith } from 'lodash';

export default class TestController {

    public profileService = new ProfileService();
    public searchOptionService = new SearchOptionService();
    public forumService = new ForumService();
    public projectService = new ProjectService();
    public clientProfileService = new ClientProfileService();
    public clientProfileCompanyService = new ClientProfileCompanyService();

    public test = async (req: Request, res: Response, next: NextFunction) => {
        const filter: any = req.query;
        let data: any = {};
        if (!isEmpty(filter.select) && filter.select.toLowerCase().includes('select') && filter.select.toLowerCase().includes('from')) {
            data = await sequelize
                .query(filter.select,
                    { type: QueryTypes.SELECT }
                );

            res.api.create({ total: data.length, data });
        } else {
            res.api.validationErrors({
                'message': 'only select query allowed'
            });
        }
    }

    public deleteDuplicateProfile = async (req: Request, res: Response, next: NextFunction) => {
        const filter: any = req.body;
        const { profile_id, registration_type }: any = filter;


        let tableName = (registration_type == 1) ? 'client_profile' : 'side_character_profile';

        let profile: any = await this.profileService.findProfile({
            where: { id: profile_id }
        }, registration_type)

        if (isEmpty(profile)) {
            return res.api.badResponse({
                'message': 'Profile not found'
            });
        }

        let memberId = profile.member_id;

        let data: any = await sequelize
            .query(
                `SELECT COUNT(*) from ${tableName} WHERE member_id = '${memberId}'`,
                { type: QueryTypes.SELECT }
            )


        if (data[0].count < 2) {
            return res.api.badResponse({
                'message': 'Duplicate record not found'
            });
        }

        const profileId = profile.id

        // search record
        let searchOption: any = await this.searchOptionService.find({
            where: { member_id: memberId, search_type: MEMBER_PROFILE[registration_type] }
        });

        if (!isEmpty(searchOption)) {
            let searchTable: any = ['search_option_field', 'search_option_location', 'search_option_profession'];
            searchTable.forEach(async (table: any) => {
                await sequelize
                    .query(
                        `DELETE from ${table} WHERE search_option_id = '${searchOption.id}'`,
                        { type: QueryTypes.DELETE }
                    )
            });
            await this.searchOptionService.destroy({ where: { id: searchOption.id } })
        }


        // request
        await sequelize
            .query(
                `DELETE from request WHERE from_member_id = '${profileId}' OR to_member_id = '${profileId}'`,
                { type: QueryTypes.DELETE }
            )

        // report
        await sequelize
            .query(
                `DELETE from report WHERE source_id = '${profileId}' and report_type = '${MEMBER_PROFILE[registration_type]}'`,
                { type: QueryTypes.DELETE }
            )

        // My Like
        await sequelize
            .query(
                `DELETE from my_like WHERE source_id = '${profileId}' and like_type = '${MEMBER_PROFILE[registration_type]}'`,
                { type: QueryTypes.DELETE }
            )

        // coin use history and payment_history and forum_report
        let commonTable = ['coins_use_history', 'payment_history', 'forum_report'];
        commonTable.forEach(async (table: any) => {
            await sequelize
                .query(
                    `DELETE from ${table} WHERE profile_id = '${profileId}' and profile_type = '${MEMBER_PROFILE[registration_type]}'`,
                    { type: QueryTypes.DELETE }
                )
        });

        // forum record
        let forum: any = await this.forumService.findById({
            where: { source_id: profileId, source_type: MEMBER_PROFILE[registration_type] }
        });

        if (!isEmpty(forum)) {
            let forumTable: any = ['forum_comments', 'forum_hashtag', 'forum_image', 'forum_link', 'forum_updown_votes'];
            for await (const table of forumTable) {
                await sequelize
                    .query(
                        `DELETE from ${table} WHERE forum_id = '${forum.id}'`,
                        { type: QueryTypes.DELETE }
                    )
            }
            await this.forumService.destroy({ where: { id: forum.id } })
        }

        if (registration_type == 1) {
            //project
            let project: any = await this.projectService.findById({
                where: { member_id: memberId }
            });

            if (!isEmpty(project)) {
                let projectTable: any = ['project_image', 'project_application'];
                for await (const table of projectTable) {
                    await sequelize
                        .query(
                            `DELETE from ${table} WHERE project_id = '${project.id}'`,
                            { type: QueryTypes.DELETE }
                        )
                }
                await this.projectService.destroy({ where: { id: project.id } })
            }

            // company
            let company: any = await this.clientProfileCompanyService.findByClientProfileId({
                where: { client_profile_id: profileId }
            });

            if (!isEmpty(company)) {
                let companyTable: any = ['client_profile_company_field', 'client_profile_company_hastag', 'client_profile_company_location'];
                for await (const table of companyTable) {
                    await sequelize
                        .query(
                            `DELETE from ${table} WHERE client_profile_company_id = '${company.id}'`,
                            { type: QueryTypes.DELETE }
                        )
                }
                await this.clientProfileCompanyService.deleteClientProfileCompany({ where: { id: company.id } })
            }
        }

        if (registration_type == 2) {
            // project application
            await sequelize
                .query(
                    `DELETE from project_application WHERE application_id = '${profileId}'`,
                    { type: QueryTypes.DELETE }
                )
        }

        let tables = [
            'client_profile_field', 'client_profile_image', 'client_profile_introductory_image', 'client_profile_location',
            'side_character_profile_field', 'side_character_profile_image', 'side_character_profile_location', 'side_character_profile_portfolio',
            'side_character_profile_work_experience',
        ];

        for await (const table of tables) {
            let field: any = (table.includes('client')) ? 'client_profile_id' : 'side_character_profile_id'
            await sequelize
                .query(
                    `DELETE from ${table} WHERE ${field} = '${profileId}'`,
                    { type: QueryTypes.DELETE }
                )
        }
        switch (registration_type) {
            case '1':
                await sequelize
                    .query(
                        `DELETE from client_profile WHERE id = '${profileId}'`,
                        { type: QueryTypes.DELETE }
                    )
                break;

            case '2':
                await sequelize
                    .query(
                        `DELETE from side_character_profile WHERE id = '${profileId}'`,
                        { type: QueryTypes.DELETE }
                    )
                break;

            default:
                break;
        }

        res.api.create({
            'message': "Recorde Deleted"
        })
    }
}