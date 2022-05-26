import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { RELATIONSHIP } from "../../constants";
import { Member, ProjectApplication } from "../../models";
import { MemberService, ProfileService, ProjectService } from "../../services";
import { getImagePath, inArray, isEmpty, _json } from "../../utils/helper";

export default class ProjectSettingController {

    public projectService = new ProjectService();
    public profileService = new ProfileService();

    public getProjectList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = parseInt(filter.page);
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';

        let payload: any = {
            include: [
                {
                    model: ProjectApplication,
                    as: RELATIONSHIP.project_applications,
                },
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                },
            ]
        }
        payload = this.__preparedWhere(filter, payload);

        let list: any = await this.projectService.pagination(page, payload, true, sortDirection)

        list.rows = await Promise.all(list.rows.map(async (project: any): Promise<any> => {
            var project = JSON.parse(JSON.stringify(project));
            project.count_project_applications = !isEmpty(project.project_applications) ? project.project_applications.length : 0
            delete project.project_applications;
            return project;
        }));

        res.api.create(list)
    }

    // for active & termination query builder
    private __preparedWhere(filter: any, payload: any): any {
        let where: any = {}

        if (filter.field && inArray(filter.field, ['all', 'name', 'field']) && filter.q && filter.q.trim().length != 0) {
            if (filter.field == 'all') {
                let orWhere: any = ['$member.name$', 'field'].map((field: any) => {
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
                        field: {
                            [Op.iLike]: '%' + filter.q + '%'
                        }
                    }
                }
            }
        }

        if (!isEmpty(filter.profession)) {
            where = {
                ...where, profession: filter.profession
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

        if (filter.field == 'all') {
            payload = { ...payload, subQuery: false }
        }
        return payload;
    }

    public findProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);
        let payload = {
            where: { id: Id },
            include: [RELATIONSHIP.project_images, RELATIONSHIP.project_applications, RELATIONSHIP.member]
        }
        let project: any = await _json(this.projectService.findById(payload))
        if (!isEmpty(project)) {
            project.project_images = project.project_images.map((images: any) => {
                return { ...images, file_path: getImagePath(images.file_path) }
            })

            if (!isEmpty(project.city) && !isEmpty(project.district)) {
                project.location = await this.profileService.getLocationWithNameById([{
                    city: project.city,
                    district: project.district
                }]);
                project.location = project.location[0];
            }
            res.api.create({ project });
        } else {
            res.api.validationErrors({
                'project': "invalid Id"
            });
        }
    }

    public deleteProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Ids = req.body.ids
        let payload = {
            where: {
                id: {
                    [Op.in]: Ids
                }
            },
        }
        await this.projectService.update({
            status: ProjectService.STATUS_DISABLE
        }, payload)
        res.api.create({
            'message': 'project deleted successfully'
        });
    }
}