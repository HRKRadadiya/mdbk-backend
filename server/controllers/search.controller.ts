import { NextFunction, Request, Response } from 'express'
import _, { isString } from 'lodash';
import { Op, where } from 'sequelize';
import { RELATIONSHIP, MEMBER } from '../constants';
import { ClientProfileCompany, SideCharacterProfileField, SideCharacterProfileLocation, ClientProfileField, ClientProfileLocation, ClientProfileCompanyField, ClientProfileCompanyLocation, Member, SideCharacterProfile, ClientProfile, ProjectApplication } from '../models';
import { MemberOutput } from '../models/member';
import { SideCharacterProfileFieldOutput } from '../models/sideCharacterProfileField';
import { ClientProfileService, MyLikeService, ProfileService, ProjectApplicationService, ProjectService, RequestService, SearchOptionFieldService, SearchOptionLocationService, SearchOptionProfessionService, SearchOptionService, SideCharacterProfileService } from '../services';
import { isEmpty, _json } from '../utils/helper';
import * as CONSTANT from '../constants'

export default class SearchController {


    public profileService = new ProfileService()
    public projectService = new ProjectService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public clientProfileService = new ClientProfileService()
    public myLikeService = new MyLikeService()
    public searchOptionService = new SearchOptionService()
    public searchOptionFieldService = new SearchOptionFieldService()
    public searchOptionLocationService = new SearchOptionLocationService()
    public searchOptionProfessionService = new SearchOptionProfessionService()
    public requestService = new RequestService()
    public projectApplicationService = new ProjectApplicationService()

    public sideCharacter = async (req: Request, res: Response): Promise<void> => {
        const filter: any = req.query;
        await this.__saveSearchDetail(filter, 'side-character', req.authMember);
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
        let profile: any;

        if (!isEmpty(req.authMember)) {
            profile = await this.profileService.findProfile({
                where: { member_id: req.authMember.id }
            }, MEMBER.CLIENT);
        }

        let payload: any = {
            include: [
                {
                    model: SideCharacterProfileField,
                    as: RELATIONSHIP.fields,
                },
                {
                    model: SideCharacterProfileLocation,
                    as: RELATIONSHIP.locations
                },
                RELATIONSHIP.experiences,
            ]
        };

        if (!isEmpty(req.authMember)) {
            payload.include.push(RELATIONSHIP.profile_picture);
        }

        payload = await this.__preparedWhere(filter, payload, req.authMember);
        let list: any = await this.sideCharacterProfileService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (sideCharacter: any): Promise<any> => {
            var sideCharacter = JSON.parse(JSON.stringify(sideCharacter));
            sideCharacter.is_already_requested = false;
            // modify locations structure
            if (!isEmpty(sideCharacter.locations)) {
                sideCharacter.locations = await this.profileService.getLocationWithNameById(sideCharacter.locations);
                sideCharacter.locations = sideCharacter.locations.map((location: any) => {
                    return location.city_name + " " + location.district_name;
                })
            }

            if (!isEmpty(sideCharacter.fields)) {
                // modify field structure
                sideCharacter.fields = sideCharacter.fields.map((field: SideCharacterProfileFieldOutput) => {
                    return field.name;
                }).join(", ")
            }

            if (!isEmpty(req.authMember)) {
                sideCharacter.like_flag = await this.myLikeService.likeFlag(sideCharacter.id, MyLikeService.LIKE_TYPE_SIDE_CHARACTER, req.authMember.id);
                sideCharacter.profile_picture = isEmpty(sideCharacter.profile_picture) ? null : sideCharacter.profile_picture.file_path;
                if (!isEmpty(profile)) {
                    sideCharacter.is_already_requested = await this.requestService.isAlreadyRequested(profile.id, sideCharacter.id, RequestService.REQUEST_TYPE_CONTACT_INFORMATION);
                }

            } else {
                sideCharacter.like_flag = false;
            }
            return sideCharacter;
        }));

        list.search_option = [];
        if (!isEmpty(req.authMember)) {
            list.search_option = await this.searchOptionService.findByMemberId(req.authMember.id, true);
        }

        res.api.create(list);
    }

    public client = async (req: Request, res: Response): Promise<void> => {
        const filter: any = req.query;
        await this.__saveSearchDetail(filter, 'client', req.authMember);
        let profile: any;

        if (!isEmpty(req.authMember)) {
            profile = await this.profileService.findProfile({
                where: { member_id: req.authMember.id }
            }, MEMBER.SIDE_CHARACTER);
        }

        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
        let payload: any = {
            where: {
            },
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    include: [RELATIONSHIP.project]
                },
                {
                    model: ClientProfileField,
                    as: RELATIONSHIP.fields
                },
                {
                    model: ClientProfileLocation,
                    as: RELATIONSHIP.locations
                },
                {
                    model: ClientProfileCompany, as: RELATIONSHIP.client.company,
                    include: [
                        {
                            model: ClientProfileCompanyField,
                            as: RELATIONSHIP.fields
                        },
                        {
                            model: ClientProfileCompanyLocation,
                            as: RELATIONSHIP.locations
                        },
                    ]
                },
            ]
        };

        if (!isEmpty(req.authMember)) {
            payload.include.push(RELATIONSHIP.profile_picture);
        }

        if (!isEmpty(filter.is_company)) {
            payload.where = {
                ...payload.where,
                is_company: filter.is_company,
            }
        }

        payload = await this.__preparedWhere(filter, payload, req.authMember);

        let list: any = await this.clientProfileService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (client: any): Promise<any> => {
            var client = JSON.parse(JSON.stringify(client));

            for (const type of ['client', 'company']) {
                if (type == 'company' && payload.where.is_company == 'no') {
                    break;
                }

                let data = (type == 'client') ? client : client.company
                // modify locations structure
                if (!isEmpty(data)) {
                    if (!isEmpty(data.locations)) {
                        data.locations = await this.profileService.getLocationWithNameById(data.locations);
                        data.locations = data.locations.map((location: any) => {
                            return location.city_name + ", " + location.district_name
                        })
                    }

                    if (!isEmpty(data.fields)) {
                        // modify field structure
                        data.fields = data.fields.map((field: any) => {
                            return field.name;
                        }).join(", ")
                    }
                }

                if (!isEmpty(req.authMember)) {
                    client.like_flag = await this.myLikeService.likeFlag(client.id, MyLikeService.LIKE_TYPE_CLIENT, req.authMember.id);
                } else {
                    client.like_flag = false;
                }


                if (type == 'client') {
                    data.is_already_requested = false;
                    if (!isEmpty(req.authMember)) {
                        data.profile_picture = isEmpty(data.profile_picture) ? null : data.profile_picture.file_path;
                        if (!isEmpty(profile)) {
                            data.is_already_requested = await this.requestService.isAlreadyRequested(profile.id, data.id, RequestService.REQUEST_TYPE_INTERVIEW);
                        }
                    }
                    data.project = data.member.project;
                    delete data.member;
                    client = data;
                } else {
                    client.company = data
                }
            }
            return client;
        }));

        list.search_option = [];
        if (!isEmpty(req.authMember)) {
            list.search_option = await this.searchOptionService.findByMemberId(req.authMember.id, true);
        }

        res.api.create(list);
    }

    public project = async (req: Request, res: Response): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let profile: any = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, MEMBER.SIDE_CHARACTER);

        let payload: any = {
            include: [
                {
                    model: Member,
                    as: RELATIONSHIP.member,
                    where: {
                        id: {
                            [Op.not]: req.authMember.id
                        }
                    },
                    include: {
                        model: ClientProfile,
                        as: RELATIONSHIP.client_profile,
                        include: [RELATIONSHIP.profile_picture]
                    }
                }
            ],
            order: [['created_at', 'desc']],
        };

        if (!isEmpty(filter.profession)) {
            payload = {
                ...payload, where: {
                    profession: filter.profession
                }
            }
        }

        let list: any = await this.projectService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (project: any): Promise<any> => {
            project = await _json(project);
            project.location = await this.profileService.getLocationWithNameById([{
                city: project.city,
                district: project.district,
            }]);

            project.location = project.location.map((location: any) => {
                return location.city_name + ", " + location.district_name
            })

            project.client_profile = project.member.client_profile;
            delete project.member;

            project.client_profile.profile_picture = (!isEmpty(project.client_profile.profile_picture) ? project.client_profile.profile_picture.file_path : '');

            project.like_flag = await this.myLikeService.likeFlag(project.id, MyLikeService.LIKE_TYPE_PROJECT, req.authMember.id);

            project.project_application = await this.projectApplicationService.findById({
                where: {
                    applicant_id: profile.id,
                    project_id: project.id
                }
            });

            return project;
        }));

        res.api.create(list);
    }

    public myLike = async (req: Request, res: Response): Promise<void> => {
        const filter: any = req.query;
        if (filter.profile == 'project') {
            res.api.validationErrors({
                "profile": "Project functionality not available"
            });
        }
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;
        let payload: any = {
            where: { member_id: req.authMember.id, like_type: filter.profile }
        }

        let requestType = (filter.registration_type == MEMBER.CLIENT) ? RequestService.REQUEST_TYPE_CONTACT_INFORMATION : RequestService.REQUEST_TYPE_INTERVIEW
        let toRegistrationType = (filter.registration_type == MEMBER.CLIENT) ? MEMBER.SIDE_CHARACTER : MEMBER.CLIENT
        let requestedProfile = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, filter.registration_type);

        let list: any = await this.myLikeService.pagination(page, payload)
        list.rows = await Promise.all(list.rows.map(async (profile: any): Promise<any> => {

            let filterData: any;
            switch (filter.profile) {
                case 'side-character':
                    filterData = {
                        where: { id: profile.source_id },
                        include: ['fields', 'locations', 'profile_picture', 'experiences']
                    };
                    profile = await this.sideCharacterProfileService.findProfile(filterData)
                    break;

                case 'client':
                    filterData = {
                        where: { id: profile.source_id },
                        include: [
                            {
                                model: Member,
                                as: RELATIONSHIP.member,
                                include: [RELATIONSHIP.project]
                            }, 'fields', 'locations', 'profile_picture', { model: ClientProfileCompany, as: 'company', include: ['fields', 'locations'] }]
                    };
                    profile = await this.clientProfileService.findProfile(filterData)
                    break;

                default:
                    break;
            }

            profile = JSON.parse(JSON.stringify(profile))
            profile.is_already_requested = false;

            if (!isEmpty(requestedProfile)) {
                profile.is_already_requested = await this.requestService.isAlreadyRequested(requestedProfile.id, profile.id, requestType);
            }

            let filterArr = (filter.profile != 'side-character') ? [filter.profile, 'company'] : [filter.profile]
            for (const type of filterArr) {
                let data = (type == filter.profile) ? profile : profile.company
                // modify locations structure
                if (!isEmpty(data)) {
                    data.locations = await this.profileService.getLocationWithNameById(data.locations);
                    data.locations = data.locations.map((location: any) => {
                        return location.city_name + ", " + location.district_name
                    })
                }

                if (!isEmpty(data)) {
                    // modify field structure
                    data.fields = data.fields.map((field: any) => {
                        return field.name;
                    }).join(", ")
                }

                if (type != 'company') {
                    data.profile_picture = isEmpty(data.profile_picture) ? null : data.profile_picture.file_path;
                    data.like_flag = true;
                    if (type == 'client') {
                        data.project = data.member.project;
                        delete data.member;
                    }
                    profile = data;
                } else {
                    profile.company = data
                }
            }

            return profile;
        }));

        res.api.create(list);
    }

    // for active & termination query builder
    private __preparedWhere(filter: any, payload: any, authMember: any): any {
        let where: any = {}

        where = {
            ...where, nick_name: {
                [Op.not]: null
            }
        }

        if (!isEmpty(authMember)) {
            where = { ...where, member_id: { [Op.ne]: authMember.id } }
        }

        if (!isEmpty(filter.profession)) {
            let professionQry = filter.profession.map((profession: any) => {
                return {
                    [Op.like]: '%' + profession.toLowerCase().trim() + '%'
                }
            });
            where = {
                ...where, profession: {
                    [Op.or]: professionQry
                }
            }
        }

        let relationShipInclude = payload.include;
        if (!isEmpty(filter.is_company) && filter.is_company == 'yes') {
            relationShipInclude = payload.include.find((item: any) => !isEmpty(item.as) && item.as == 'company');
            relationShipInclude = relationShipInclude ? relationShipInclude.include : payload.include;
        }

        if (!isEmpty(filter.fields)) {
            relationShipInclude = relationShipInclude.map((item: any) => {
                if (!isEmpty(item.as) && item.as == 'fields') {
                    return {
                        ...item, where: {
                            name: {
                                [Op.in]: filter.fields
                            }
                        }
                    }
                }
                return item;
            })
        }


        if (!isEmpty(filter.locations)) {
            relationShipInclude = relationShipInclude.map((item: any) => {
                if (!isEmpty(item.as) && item.as == 'locations') {

                    let locations = filter.locations.map((location: any) => {
                        if (!(location instanceof Object)) {
                            location = JSON.parse(location);
                        }
                        let data: any = {};
                        if (!isEmpty(location.province_id)) {
                            data = { ...data, city: String(location.province_id) }
                        }

                        if (!isEmpty(location.district_id)) {
                            data = { ...data, district: String(location.district_id) }
                        }
                        return data
                    });

                    return {
                        ...item, where: locations
                    }
                }
                return item;
            })
        }

        for (const field of ['desired_date', 'desired_time', 'desired_project_type', 'insurance_status', 'desired_work_type']) {
            if (!isEmpty(filter[field])) {
                where = {
                    ...where, [field]: filter[field].toLowerCase().trim()
                }
            }
        }

        if (!isEmpty(filter.is_company) && filter.is_company == 'yes') {
            payload.include = payload.include.map((item: any) => {
                if (!isEmpty(item.as) && item.as == RELATIONSHIP.client.company) {
                    return { ...item, include: relationShipInclude }
                }
                return item;
            })
        } else {
            payload.include = relationShipInclude;
        }

        payload = {
            ...payload, where: {
                ...payload.where,
                ...where
            }
        }
        return payload;
    }


    public __saveSearchDetail = async (filter: any, search_type: string, authMember: MemberOutput) => {
        if (isEmpty(authMember)) {
            return false;
        }

        filter.registration_type = (MEMBER.SIDE_CHARACTER == filter.registration_type) ? 'side_character' : 'client'

        if (!isEmpty(filter.is_reset) && (filter.is_reset == true || filter.is_reset == "true")) {
            await this.searchOptionService.destroy({
                where: {
                    search_type: search_type,
                    member_id: authMember.id,
                    registration_type: filter.registration_type
                }
            })
            return;
        }

        let searchOptionObj: any = {
            member_id: authMember.id,
            search_type: search_type,
            desired_profession: null,
            desired_date: null,
            desired_time: null,
            desired_project_type: null,
            insurance_status: null,
            desired_work_type: null,
            registration_type: filter.registration_type,
            is_company: null,
            locations: [],
            fields: [],
        }

        for (const field of ['desired_date', 'desired_time', 'desired_project_type', 'insurance_status', 'desired_work_type']) {
            if (!isEmpty(filter[field])) {
                searchOptionObj[field] = filter[field];
            }
        }

        if (!isEmpty(filter.is_company)) {
            searchOptionObj.is_company = filter.is_company;
        }

        const { fields, locations, ...searchOption } = searchOptionObj
        let searchOptionData = await this.searchOptionService.createOrUpdate(searchOption)

        if (!isEmpty(filter.profession)) {
            searchOptionObj.profession = filter.profession.map((profession: any) => {
                return {
                    search_option_id: searchOptionData.id,
                    name: profession
                }
            });

            await this.searchOptionProfessionService.create(searchOptionObj.profession);
        } else {
            await this.searchOptionProfessionService.destroy({
                where: { search_option_id: searchOptionData.id }
            });
        }

        if (!isEmpty(filter.fields)) {
            searchOptionObj.fields = filter.fields.map((field: any) => {
                return {
                    search_option_id: searchOptionData.id,
                    name: field
                }
            });

            await this.searchOptionFieldService.create(searchOptionObj.fields);
        } else {
            await this.searchOptionFieldService.destroy({
                where: { search_option_id: searchOptionData.id }
            });
        }

        if (!isEmpty(filter.locations)) {
            searchOptionObj.locations = filter.locations.map((location: any) => {
                location = (isString(location)) ? JSON.parse(location) : location;
                let data: any = {}
                if (!isEmpty(location.province_id)) {
                    data = { ...data, city: location.province_id }
                }

                if (!isEmpty(location.district_id)) {
                    data = { ...data, district: location.district_id }
                }

                return {
                    search_option_id: searchOptionData.id,
                    ...data
                }
            });
            await this.searchOptionLocationService.create(searchOptionObj.locations)
        } else {
            await this.searchOptionLocationService.destroy({
                where: { search_option_id: searchOptionData.id }
            });
        }
    }

    public findProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let payload: any = {
            where: { status: ProjectService.STATUS_ENABLE },
            include: [
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

        if (!isEmpty(filter.profession)) {
            payload.where = {
                ...payload.where,
                profession: filter.profession,
            }
        }

        let list: any = await this.projectService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (project: any): Promise<any> => {
            project = await _json(project);
            project.location = await this.profileService.getLocationWithNameById([{
                city: project.city,
                district: project.district,
            }]);

            project.location = project.location.map((location: any) => {
                return location.city_name + ", " + location.district_name
            })
            project.client_profile = project.member.client_profile;
            delete project.member;
            return project;
        }));

        res.api.create(list);
    }


    public sentAndReceiveRequests = async (req: Request, res: Response): Promise<void> => {
        const filter: any = req.query;
        const page = !isEmpty(filter.page) ? parseInt(filter.page) : 1;

        let requestDataType1: any = (filter.request_type == 'sent') ? 'from_member_id' : 'to_member_id';
        let requestDataType2: any = (filter.request_type == 'sent') ? 'to_member_id' : 'from_member_id';
        let toRequestedMemberType: number

        if (filter.request_type == 'sent') {
            toRequestedMemberType = (filter.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER;
            requestDataType1 = 'from_member_id';
            requestDataType2 = 'to_member_id'
        } else {
            toRequestedMemberType = filter.registration_type
            requestDataType1 = 'to_member_id';
            requestDataType2 = 'from_member_id'
        }

        let profile = await this.profileService.findByMemberId(req.authMember.id, filter.registration_type)
        let payload: any;
        let requestType = (toRequestedMemberType == CONSTANT.MEMBER.SIDE_CHARACTER) ? RequestService.REQUEST_TYPE_CONTACT_INFORMATION : RequestService.REQUEST_TYPE_INTERVIEW

        if (filter.request_type == 'sent') {
            requestDataType1 = 'from_member_id';
            requestDataType2 = 'to_member_id'
        }

        payload = {
            where: {
                [requestDataType1]: profile.id,
                'request_type': requestType
            }
        }

        let list: any = await this.requestService.pagination(page, payload)

        list.rows = await Promise.all(list.rows.map(async (request: any): Promise<any> => {
            let filterData: any;
            let profileData: any;
            let likeType: any;
            toRequestedMemberType = (filter.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER;

            switch (toRequestedMemberType) {
                case CONSTANT.MEMBER.SIDE_CHARACTER:
                    filterData = {
                        where: { id: request[requestDataType2], profession: filter.profession },
                        include: [RELATIONSHIP.fields, RELATIONSHIP.locations, RELATIONSHIP.profile_picture, RELATIONSHIP.experiences]
                    };

                    if (isEmpty(filter.profession)) {
                        delete filterData.where.profession
                    }
                    profileData = await this.sideCharacterProfileService.findProfile(filterData)
                    likeType = MyLikeService.LIKE_TYPE_SIDE_CHARACTER;
                    break;

                case CONSTANT.MEMBER.CLIENT:
                    filterData = {
                        where: { id: request[requestDataType2], profession: filter.profession },
                        include: [
                            {
                                model: Member,
                                as: RELATIONSHIP.member,
                                include: [RELATIONSHIP.project]
                            }, RELATIONSHIP.fields, RELATIONSHIP.locations, RELATIONSHIP.profile_picture, { model: ClientProfileCompany, as: 'company', include: ['fields', 'locations'] }]
                    };

                    if (isEmpty(filter.profession)) {
                        delete filterData.where.profession
                    }

                    profileData = await this.clientProfileService.findProfile(filterData)
                    likeType = MyLikeService.LIKE_TYPE_CLIENT;
                    break;

                default:
                    break;
            }

            profileData = JSON.parse(JSON.stringify(profileData))

            profileData.request = request;
            profileData.like_flag = await this.myLikeService.likeFlag(profileData.id, likeType, req.authMember.id);

            let filterArr = (toRequestedMemberType != CONSTANT.MEMBER.SIDE_CHARACTER) ? [CONSTANT.MEMBER.CLIENT, 'company'] : [CONSTANT.MEMBER.SIDE_CHARACTER]
            for (const type of filterArr) {
                let data = (type == toRequestedMemberType) ? profileData : profileData.company
                // modify locations structure
                if (!isEmpty(data)) {
                    data.locations = await this.profileService.getLocationWithNameById(data.locations);
                    data.locations = data.locations.map((location: any) => {
                        return location.city_name + ", " + location.district_name
                    })
                }

                if (!isEmpty(data)) {
                    // modify field structure
                    data.fields = data.fields.map((field: any) => {
                        return field.name;
                    }).join(", ")
                }

                if (type != 'company') {
                    if (!isEmpty(req.authMember)) {
                        data.profile_picture = isEmpty(data.profile_picture) ? null : data.profile_picture.file_path;
                    }
                    if (type == CONSTANT.MEMBER.CLIENT) {
                        let projects = data.member.project;
                        data.project = (!isEmpty(projects)) ? projects[0] : null;
                        delete data.member;
                    }
                    profileData = data;
                } else {
                    profileData.company = data
                }
            }

            return profileData;
        }))
        res.api.create(list);
    }
}