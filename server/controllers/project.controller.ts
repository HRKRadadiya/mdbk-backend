import { NextFunction, Request, Response } from "express";
import _, { isArray } from "lodash";
import { authenticate } from "passport";
import { BASIC_VALIDATION, MEMBER, NOTIFICATION_EVENT_TYPE, RELATIONSHIP } from "../constants";
import { where } from "sequelize";
import { ClientProfile, Member, Project, ProjectApplication, SideCharacterProfile, SideCharacterProfileImage } from "../models";
import { ProfileService, ProjectApplicationService, ProjectImageService, ProjectService, SideCharacterProfileService, MessageService, ReportService, MyLikeService } from "../services";
import { getImagePath, isEmpty, removeFile, saveFile, saveNotification, _json } from "../utils/helper";
import { BadResponseHandler } from "../errorHandler";
import { Op } from "sequelize";

export default class ProjectController {
    public projectService = new ProjectService()
    public profileService = new ProfileService()
    public projectImageService = new ProjectImageService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public projectApplicationService = new ProjectApplicationService()
    public messageService = new MessageService()
    public reportService = new ReportService()
    public myLikeService = new MyLikeService()

    public createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // must need 80% or 80% up client profile
        if (req.authMember.client_profile_progress >= BASIC_VALIDATION.profile_needed_progress) {
            const file: any = req.files;
            if (isEmpty(file)) {
                return res.api.validationErrors({
                    "project_images": "Images must be required"
                })
            }
            let projectImages: any = []

            if (!isArray(file.project_images)) {
                projectImages.push(file.project_images)
            } else {
                projectImages = file.project_images
            }
            const project = req.body
            const createProjectData: any = {
                member_id: req.authMember.id,
                profession: project.profession,
                field: project.field,
                current_planning_stage: project.current_planning_stage,
                suggested_amount: project.suggested_amount,
                is_negotiable: project.is_negotiable,
                schedule: project.schedule,
                schedule_direct_start_date: project.schedule_direct_start_date,
                schedule_direct_end_date: project.schedule_direct_end_date,
                city: project.city,
                district: project.district,
                work_related_details: project.work_related_details,
                status: ProjectService.STATUS_ENABLE,
                direct_input: project.direct_input
            }
            const projectRes: any = await this.projectService.create(createProjectData)

            for (const image of projectImages) {
                const projectFiles: any = await saveFile(image, 'project')
                let imgData: any = {
                    project_id: projectRes.id,
                    file_name: projectFiles.file_name,
                    original_file_name: image.name,
                    file_type: image.mimetype,
                    file_path: projectFiles.upload_path,
                }
                await this.projectImageService.create(imgData);
            }
            return res.api.create({
                message: "Project created Successfully",
                // project:projectRes
            })
        } else {
            return res.api.badResponse({
                message: "Please make a profile",
                is_profile_complete: false
            })
        }
    }

    public updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const file: any = req.files;
        const project = req.body;

        const deleteProjectImageId: any = req.body.delete_project_image_id;
        const filter = { where: { id: parseInt(req.params.Id) } }
        let findProject = await this.projectService.findById(filter)

        if (isEmpty(findProject)) {
            return res.api.validationErrors({
                "project": 'Project not found!!'
            })
        }

        //delete image
        if (deleteProjectImageId) {
            let images: any = []

            if (!isArray(deleteProjectImageId)) {
                images.push(deleteProjectImageId)
            } else {
                images = deleteProjectImageId
            }

            for (let id of images) {
                let imageData = await this.projectImageService.findById({ where: { id: parseInt(id) } })
                await removeFile(imageData.file_path)
                await this.projectImageService.destory({ where: { id: parseInt(imageData.id) } })
            }
        }

        if (file) {
            let projectImages: any = []

            if (!isArray(file.project_images)) {
                projectImages.push(file.project_images)
            } else {
                projectImages = file.project_images
            }

            for (const image of projectImages) {
                const projectFiles: any = await saveFile(image, 'project')
                let imgData: any = {
                    project_id: parseInt(req.params.Id),
                    file_name: projectFiles.file_name,
                    original_file_name: image.name,
                    file_type: image.mimetype,
                    file_path: projectFiles.upload_path,
                }
                await this.projectImageService.create(imgData);
            }
        }
        const createProjectData: any = {
            profession: project.profession,
            field: project.field,
            current_planning_stage: project.current_planning_stage,
            suggested_amount: project.suggested_amount,
            is_negotiable: project.is_negotiable,
            schedule: project.schedule,
            schedule_direct_start_date: project.schedule_direct_start_date,
            schedule_direct_end_date: project.schedule_direct_end_date,
            city: project.city,
            district: project.district,
            work_related_details: project.work_related_details,
            direct_input: project.direct_input
        }
        await this.projectService.update(createProjectData, filter)
        return res.api.create({
            "message": 'Project updated successfully!!'
        })
    }

    public findProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);
        const registration_type: any = req.query.registration_type

        let payload = {
            where: { id: Id },
            include: [RELATIONSHIP.project_images, RELATIONSHIP.project_applications,
            {
                model: Member,
                as: RELATIONSHIP.member,
                include: {
                    model: ClientProfile,
                    as: RELATIONSHIP.client_profile,
                    include: [RELATIONSHIP.profile_picture]
                }
            }
            ]
        }

        let project: any = await _json(this.projectService.findById(payload))
        if (!isEmpty(project)) {

            // project.project_applications_images = await Promise.all(project.project_applications.map(async (applicant: any): Promise<any> => {
            //     let filter: any = {
            //         where: { id: applicant.applicant_id },
            //         include: [RELATIONSHIP.profile_picture]
            //     }
            //     let sideChar: any = await _json(this.sideCharacterProfileService.findProfile(filter));
            //     return !isEmpty(sideChar) ? sideChar.file_path : null
            // }))
            project.client_profile = project.member.client_profile;
            project.client_profile.profile_picture = (!isEmpty(project.member.client_profile.profile_picture)) ? project.member.client_profile.profile_picture.file_path : null

            project.like_flag = await this.myLikeService.likeFlag(project.id, MyLikeService.LIKE_TYPE_PROJECT, project.member_id);
            project.total_likes = await this.myLikeService.totalLikes(project.id, MyLikeService.LIKE_TYPE_PROJECT);

            delete project.member;
            // project.count_project_applications = (!isEmpty(project.project_applications)) ? project.project_applications.length : 0;
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

            if (registration_type == MEMBER.SIDE_CHARACTER) {
                let availableRequest: any = await this.projectApplicationService.findById({
                    where: {
                        applicant_id: req.profile.side_character_profile.id,
                        project_id: project.id
                    }
                });
                project.available_request = availableRequest;
            }

            res.api.create({ project });
        } else {
            res.api.validationErrors({
                'project': "invalid Id"
            });
        }
    }

    public getProjectsByMeberId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let payload: any = {
            where: { member_id: req.authMember.id, status: ProjectService.STATUS_ENABLE },
            include: [RELATIONSHIP.project_applications]
        }

        if (!isEmpty(filter.profession)) {
            payload = {
                ...payload, where: {
                    ...payload.where,
                    profession: filter.profession
                }
            }
        }


        let list: any = await this.projectService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (project: any): Promise<any> => {
            project = await _json(project)
            project.project_applications_profile_images = await Promise.all(_.take(project.project_applications, 4).map(async (applicant: any): Promise<any> => {
                let filter: any = {
                    where: { id: applicant.applicant_id },
                    include: [RELATIONSHIP.profile_picture]
                }
                let sideChar: any = await _json(this.sideCharacterProfileService.findProfile(filter));
                return !isEmpty(sideChar.profile_picture) ? sideChar.profile_picture.file_path : null
            }))

            project.count_project_applications = (!isEmpty(project.project_applications)) ? project.project_applications.length : 0;

            if (!isEmpty(project.city) && !isEmpty(project.district)) {
                project.location = await this.profileService.getLocationWithNameById([{
                    city: project.city,
                    district: project.district
                }]);
                project.location = project.location.map((location: any) => {
                    return location.city_name + ", " + location.district_name
                })
            }
            return project;
        }));

        res.api.create(list);
    }

    public getProjectApplicantsById = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const limit: number = 10;
        const Id: number = parseInt(req.params.Id);
        const page = !isEmpty(req.query.page) ? parseInt(req.query.page) : 1;
        const offset: number = (page - 1) * limit;

        let payload: any = {
            offset: offset,
            limit: limit,
            distinct: true,
            where: { project_id: Id },
            include: [
                {
                    model: SideCharacterProfile,
                    as: RELATIONSHIP.project_application_profile,
                    include: [RELATIONSHIP.profile_picture, RELATIONSHIP.experiences]
                },
                RELATIONSHIP.message
            ]
        }

        let project: any = await this.projectService.findById({
            where: {
                id: Id
            }
        })
        if (isEmpty(project)) {
            return res.api.validationErrors({
                "project_id": 'Invalid Id'
            })
        }

        let projectApplicants: any = await ProjectApplication.findAndCountAll(payload)
        projectApplicants.rows = projectApplicants.rows.map(function (userApplication: any) {
            var userApplication = JSON.parse(JSON.stringify(userApplication));
            if (!isEmpty(userApplication.project_application_profile.profile_picture)) {
                userApplication.project_application_profile.profile_picture = userApplication.project_application_profile.profile_picture.file_path;
            }
            // userApplication.project_application_profile.phone = (userApplication.status == ProjectApplicationService.ACCEPTED_STATUS) ? userApplication.project_application_profile.phone : ''
            return userApplication;
        })
        projectApplicants.project = project;
        res.api.create(projectApplicants);
    }

    public changeProjectApplicantStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { status, applicant_id, project_id }: any = req.body;

        let payload = {
            where: { applicant_id, project_id }
        }

        let project: any = await this.projectService.findById({
            where: { id: project_id }
        })

        if (isEmpty(project)) {
            return res.api.validationErrors({
                "project_id": 'Invalid Id'
            })
        }

        let projectApplicant: any = await this.projectApplicationService.findById(payload)

        if (isEmpty(projectApplicant)) {
            return res.api.validationErrors({
                "project_applicant_id": 'Invalid Id'
            })
        }

        await this.projectApplicationService.update({ status }, payload)

        if (status == ProjectApplicationService.ACCEPTED_STATUS) {
            const sideCharacterProfile = await this.profileService.findProfile({
                where: {
                    id: projectApplicant.applicant_id
                }
            }, MEMBER.SIDE_CHARACTER);
            await saveNotification({
                from_member_id: req.authMember.id,
                to_member_id: sideCharacterProfile.member_id,
                notification_type: NOTIFICATION_EVENT_TYPE.your_project_application_accepted,
                meta: JSON.stringify({
                    project_id: project.id,
                })
            });
        }


        res.api.create({
            message: `project applicant request ${status}`
        });
    }

    public applyForProjectApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.authMember.side_character_profile_progress > BASIC_VALIDATION.profile_needed_progress) {
            const projectApplication = req.body
            let sideCharcter: any = await this.sideCharacterProfileService.getSideCharacterByMemberId(req.authMember.id);
            let messageId: any = projectApplication.message_id;
            if (isEmpty(projectApplication.message) && isEmpty(messageId)) {
                return res.api.validationErrors({
                    "message": 'select or write a message'
                })
            }

            let project: any = await this.projectService.findById({
                where: { id: projectApplication.project_id }
            })

            if (isEmpty(project)) {
                return res.api.validationErrors({
                    "project_id": 'Invalid Id'
                })
            }
            if (isEmpty(messageId) || messageId == 0) {
                if (isEmpty(projectApplication.message)) {
                    return res.api.validationErrors({
                        'message': 'Message field is required'
                    })
                }
                const message: any = {
                    member_id: req.authMember.id,
                    message: projectApplication.message
                }
                let messageResponse: any = await this.messageService.create(message);
                messageId = messageResponse.id;
            }
            const applyProject: any = {
                project_id: projectApplication.project_id,
                applicant_id: sideCharcter.id,
                wage_type: projectApplication.wage_type || null,
                suggested_amount: projectApplication.suggested_amount || 0,
                is_negotiable: projectApplication.is_negotiable ? 'yes' : 'no',
                message_id: messageId,
                status: ProjectApplicationService.WAITING_STATUS
            }
            const applyProjectApplication = await this.projectApplicationService.create(applyProject);

            await saveNotification({
                from_member_id: req.authMember.id,
                to_member_id: project.member_id,
                notification_type: NOTIFICATION_EVENT_TYPE.user_applied_for_project,
                meta: JSON.stringify({
                    project_id: project.id,
                    project_application_id: applyProjectApplication.id,
                })
            });

            res.api.create({
                "message": "Project application apply Successfully!!",
            })
        } else {
            return res.api.validationErrors({
                "is_profile_complete": false,
                "message": 'Please complete your profile'
            })
        }
    }

    public getProjectApplicationDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);
        let payload: any = {
            where: { id: Id },
            include: [
                {
                    model: SideCharacterProfile,
                    as: RELATIONSHIP.project_application_profile,
                    include: [RELATIONSHIP.profile_picture, RELATIONSHIP.experiences, RELATIONSHIP.locations, RELATIONSHIP.fields]
                },
                RELATIONSHIP.message,
                {
                    model: Project,
                    as: RELATIONSHIP.project,
                    where: {
                        status: {
                            [Op.ne]: ProjectService.STATUS_DISABLE
                        }
                    },
                    // required: false,
                }
            ]
        }
        let projectApplicants: any = await _json(this.projectApplicationService.findById(payload))
        if (isEmpty(projectApplicants)) {
            return res.api.validationErrors({
                "project_applicant_id": 'Invalid Id'
            })
        }
        projectApplicants.like_flag = await this.myLikeService.likeFlag(projectApplicants.project_application_profile.id, MyLikeService.LIKE_TYPE_SIDE_CHARACTER, projectApplicants.project_application_profile.member_id);
        projectApplicants.total_likes = await this.myLikeService.totalLikes(projectApplicants.project_application_profile.id, MyLikeService.LIKE_TYPE_SIDE_CHARACTER);
        projectApplicants.report_count = await this.reportService.myReportCount(projectApplicants.project_application_profile.id, ReportService.LIKE_TYPE_SIDE_CHARACTER);
        if (!isEmpty(projectApplicants.project_application_profile.profile_picture)) {
            projectApplicants.project_application_profile.profile_picture = projectApplicants.project_application_profile.profile_picture.file_path;
        }

        if (!isEmpty(projectApplicants.project_application_profile.fields)) {
            // modify field structure
            let fields = projectApplicants.project_application_profile.fields;
            projectApplicants.project_application_profile.fields = fields.map((field: any) => {
                return field.name;
            }).join(", ")
        }

        if (!isEmpty(projectApplicants.project_application_profile.locations)) {
            let locations = projectApplicants.project_application_profile.locations;
            locations = await this.profileService.getLocationWithNameById(locations);
            projectApplicants.project_application_profile.locations = locations.map((location: any) => {
                return location.city_name + ", " + location.district_name
            })
        }
        res.api.create(projectApplicants);
    }

    public deleteProposal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);
        let filter: any = {
            where: { id: Id }
        }

        let project: any = await this.projectService.findById({
            where: { id: Id }
        })

        if (isEmpty(project)) {
            return res.api.validationErrors({
                "project_id": 'Invalid Id'
            })
        }

        let payload = {
            status: ProjectService.STATUS_DISABLE
        }

        await this.projectService.update(payload, filter)
        res.api.create({
            'message': 'Your Project Deleted Successfully'
        });
    }

    public getSideCharacterSentProposals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let sideCharacter: any = await this.sideCharacterProfileService.findProfile({ where: { member_id: req.authMember.id } });

        let payload: any = {
            where: { applicant_id: sideCharacter.id },
            include: {
                model: Project,
                as: RELATIONSHIP.project,
                where: {
                    status: ProjectService.STATUS_ENABLE,
                    profession: filter.profession,
                },
                include: {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: {
                        model: ClientProfile,
                        as: RELATIONSHIP.client_profile,
                        include: [RELATIONSHIP.profile_picture]
                    }
                },
            }
        }

        if (isEmpty(filter.profession)) {
            delete payload.include.where.profession;
        }

        let list: any = await this.projectApplicationService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (projectApplication: any): Promise<any> => {
            projectApplication = await _json(projectApplication)
            let project = projectApplication.project;

            delete projectApplication.project
            project.client_profile = project.member.client_profile;
            delete project.member;
            project.client_profile.profile_picture = (!isEmpty(project.client_profile.profile_picture) ? project.client_profile.profile_picture.file_path : '');
            project.like_flag = await this.myLikeService.likeFlag(project.client_profile.id, MyLikeService.LIKE_TYPE_PROJECT, req.authMember.id);
            project.project_application = projectApplication;
            // project.client_profile.phone = (project.project_application.status == ProjectApplicationService.ACCEPTED_STATUS) ? project.client_profile.phone : '';
            if (!isEmpty(project.city) && !isEmpty(project.district)) {
                project.location = await this.profileService.getLocationWithNameById([{
                    city: project.city,
                    district: project.district
                }]);
                project.location = project.location.map((location: any) => {
                    return location.city_name + ", " + location.district_name
                })
            }
            return project;
        }));

        res.api.create(list);
    }
}