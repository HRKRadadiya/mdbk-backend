import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status';
import { ClientProfileService, MessageService, MyLikeService, ProfileService, ProjectApplicationService, ProjectService, ReportService, RequestService, SideCharacterProfileService } from '../services'
import * as CONSTANT from '../constants'
import { ClientProfileCompany, Member } from '../models';
import { isEmpty, saveNotification, _json } from '../utils/helper';
import { RequestOutput } from '../models/request';
import { stat } from 'fs';


export default class RequestController {
    public requestService = new RequestService()
    public profileService = new ProfileService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public clientProfileService = new ClientProfileService()
    public myLikeService = new MyLikeService()
    public reportService = new ReportService()
    public projectService = new ProjectService()
    public messageService = new MessageService()

    /**
     * @return Success : data
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public getAllRequest = async (req: Request, res: Response): Promise<void> => {
        this.requestService
            .getAllRequest()
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data
                });
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    };

    // /**
    //  * @param {Id} req.params.Id
    //  * @return Success : data
    //  * @return Error : error
    //  */
    // public getRequestById = async (req: Request, res: Response): Promise<void> => {
    //     const Id = parseInt(req.params.Id);
    //     this.requestService
    //         .getRequestById(Id)
    //         .then((data) => {
    //             res.status(httpStatus.OK).send({
    //                 "status": "success",
    //                 "data": data.length > 0 ? data[0] : data
    //             });
    //         }).catch((err) => {
    //             res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    //                 "error": {
    //                     "status": "failure",
    //                     "message": err.message
    //                 }
    //             });
    //         });
    // };

    /**
     * @input : Form( Object ) : req.body
     * @return Success : {departmentName: x,hodId:x,createdAt: x,createdBy: x,updatedAt:x,updatedBy:x}
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    // public createRequest = async (req: Request, res: Response): Promise<void> => {
    //     const request = req.body

    //     const createRequestData = {
    //         from_member_id: 3,
    //         // from_member_id: request.fromMemberId,
    //         to_member_id: request.toMemberId,
    //         request_type: request.requestType,
    //         wage_type: request.wageType,
    //         amount: request.requestAmount,
    //         is_negotiable: request.isNegotiable,
    //         message_id: request.messageId,
    //         status: request.requestStatus,
    //     }
    //     this.requestService
    //         .createRequest(createRequestData)
    //         .then((requestData) => {
    //             res.status(httpStatus.CREATED).send({
    //                 "status": "success",
    //                 "message": "Request created successfully!!",
    //             });
    //         }).catch((err) => {
    //             res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    //                 "error": {
    //                     "status": "failure",
    //                     "message": err.message
    //                 }
    //             });
    //         });

    // }

    /**
     * @input : Form( Object ) : 
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public updateRequest = async (req: Request, res: Response): Promise<void> => {
        const request = req.body
        const filter = { where: { id: parseInt(req.params.Id) } }
        const updateRequestData = {
            from_member_id: request.fromMemberId,
            to_member_id: request.toMemberId,
            request_type: request.requestType,
            wage_type: request.wageType,
            amount: request.requestAmount,
            is_negotiable: request.isNegotiable,
            message_id: request.messageId,
            status: RequestService.WAITING_STATUS,
        }
        this.requestService
            .updateRequest(updateRequestData, filter)
            .then((requestData) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "message": 'Request updated successfully!!'
                });
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    }


    /* New APis */
    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const request = req.body;
        let validRequest: any;
        if ((request.registration_type == CONSTANT.MEMBER.CLIENT && req.authMember.client_profile_progress < 80) || (request.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER && req.authMember.side_character_profile_progress < 80)) {
            return res.api.badResponse({
                'is_profile_complete': false,
                'message': `Please complete your profile as ${CONSTANT.MEMBER_PROFILE[request.registration_type]}`
            })
        }

        if (request.registration_type == CONSTANT.MEMBER.CLIENT) {
            validRequest = await this.requestService.checkRequestValidOrNot(req.authMember, request.registration_type);
            if (!validRequest.status) {
                return res.api.badResponse(validRequest)
            }
        }

        const toRequestedMemberType: number = (request.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER;
        let fromProfile: any = await this.profileService.findByMemberId(req.authMember.id, request.registration_type)
        let message: any;
        if (request.message_id == 0) {
            if (isEmpty(request.message)) {
                return res.api.validationErrors({
                    'message': 'Message field is required'
                })
            }
            message = await this.messageService.create({
                message: request.message,
                member_id: req.authMember.id
            });

            request.message_id = message.id
        }


        const createRequestData: any = {
            from_member_id: fromProfile.id,
            to_member_id: request.to_member_id,
            request_type: (toRequestedMemberType == CONSTANT.MEMBER.SIDE_CHARACTER) ? RequestService.REQUEST_TYPE_CONTACT_INFORMATION : RequestService.REQUEST_TYPE_INTERVIEW,
            wage_type: request.wage_type,
            amount: request.amount,
            is_negotiable: request.is_negotiable,
            message_id: request.message_id,
            status: ProjectApplicationService.WAITING_STATUS,
        }
        const newRequest = await this.requestService.create(createRequestData)

        let toMember: any = await this.profileService.findProfile({
            where: {
                id: request.to_member_id
            }
        }, toRequestedMemberType)

        await saveNotification({
            from_member_id: req.authMember.id,
            to_member_id: toMember.member_id,
            notification_type: (toRequestedMemberType == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.NOTIFICATION_EVENT_TYPE.received_contact_information_request : CONSTANT.NOTIFICATION_EVENT_TYPE.received_interview_request,
            meta: JSON.stringify({
                request_id: newRequest.id,
            })
        });

        res.api.create({
            "message": "Request created Successfully!!",
            ...validRequest
        })
    }

    public getRequestprofilById = async (req: Request, res: Response): Promise<void> => {
        const body: any = req.query;
        const RequestId = parseInt(req.params.Id);

        let requestDataType: any = (body.request_type == 'sent') ? 'to_member_id' : 'from_member_id';
        let payload = {
            where: {
                id: RequestId
            },
            include: [CONSTANT.RELATIONSHIP.message]
        }

        var requestData: any = await _json(this.requestService.getRequestById(payload))
        if (isEmpty(requestData)) {
            res.api.badResponse({
                'message': "Invalid Id"
            })
        }

        let toRequestedMemberType = (body.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER;

        let filterData;
        let profileData: any;
        let likeType: any;
        let reportType: any;
        switch (toRequestedMemberType) {
            case CONSTANT.MEMBER.SIDE_CHARACTER:
                filterData = {
                    where: { id: requestData[requestDataType] },
                    include: [CONSTANT.RELATIONSHIP.fields, CONSTANT.RELATIONSHIP.locations, CONSTANT.RELATIONSHIP.profile_picture, CONSTANT.RELATIONSHIP.experiences]
                };
                profileData = await _json(this.sideCharacterProfileService.findProfile(filterData))
                likeType = MyLikeService.LIKE_TYPE_SIDE_CHARACTER;
                reportType = ReportService.LIKE_TYPE_REQUEST_INTERVIEW;
                break;

            case CONSTANT.MEMBER.CLIENT:
                filterData = {
                    where: { id: requestData[requestDataType] },
                    include: [CONSTANT.RELATIONSHIP.fields, CONSTANT.RELATIONSHIP.locations, CONSTANT.RELATIONSHIP.profile_picture, { model: ClientProfileCompany, as: 'company', include: ['fields', 'locations', CONSTANT.RELATIONSHIP.client.hashtags] }]
                };
                profileData = await _json(this.clientProfileService.findProfile(filterData))
                likeType = MyLikeService.LIKE_TYPE_CLIENT;
                reportType = ReportService.LIKE_TYPE_REQUEST_CONTACT_INFORMATION;
                break;

            default:
                break;
        }

        profileData.like_flag = await this.myLikeService.likeFlag(profileData.id, likeType, req.authMember.id);
        profileData.total_likes = await this.myLikeService.totalLikes(profileData.id, likeType);

        if (body.request_type != 'sent') {
            profileData.report_count = await this.reportService.myReportCount(RequestId, reportType);
        }

        profileData.projects = [];
        if (toRequestedMemberType == CONSTANT.MEMBER.CLIENT) {
            if (profileData.is_company == 'yes') {
                profileData.projects = await this.projectService.findAll({
                    where: {
                        member_id: profileData.member_id,
                    },
                    attributes: ['field', 'id']
                });
            }
        }

        let filterArr = (toRequestedMemberType == CONSTANT.MEMBER.SIDE_CHARACTER) ? [CONSTANT.MEMBER.SIDE_CHARACTER] : [CONSTANT.MEMBER.CLIENT, 'company']
        for (const type of filterArr) {
            let data: any = (type == toRequestedMemberType) ? profileData : profileData.company
            // modify locations structure
            if (!isEmpty(data)) {
                data.fields = data.fields.map((item: any) => item.name)
            }

            if (type != 'company') {
                data.profile_picture = isEmpty(data.profile_picture) ? null : data.profile_picture.file_path;
                profileData = data;
            } else {
                if (data) {
                    data.hashtags = data.hashtags.map((item: any) => item.name)
                }
                profileData.company = data
            }
        }

        let profile = profileData;
        profile.request = requestData;

        res.api.create({
            "profile": profile,
        })
    };

    public findRequestedMemberProfile = async (req: Request, res: Response): Promise<void> => {
        const body: any = req.query;
        const profileId = parseInt(req.params.Id);

        let filterData;
        let profileData: any;
        let likeType: any;
        let toRequestedMemberType = (body.registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER;
        switch (toRequestedMemberType) {
            case CONSTANT.MEMBER.SIDE_CHARACTER:
                filterData = {
                    where: { id: profileId },
                    include: [CONSTANT.RELATIONSHIP.profile_picture]
                };
                profileData = await _json(this.sideCharacterProfileService.findProfile(filterData))
                let request: any = {
                    is_free_request: false,
                    total_free_request: 0,
                    coin_per_request: CONSTANT.COINS.request_coins
                };

                let totalRequest: any = await this.requestService.totalRequestPerDay(req.authMember.id);
                if (totalRequest != -1) {
                    request.total_free_request = totalRequest
                    request.is_free_request = true
                }

                profileData.request = request;
                likeType = MyLikeService.LIKE_TYPE_SIDE_CHARACTER;
                break;

            case CONSTANT.MEMBER.CLIENT:
                filterData = {
                    where: { id: profileId },
                    include: [CONSTANT.RELATIONSHIP.profile_picture]
                };
                profileData = await _json(this.clientProfileService.findProfile(filterData))

                likeType = MyLikeService.LIKE_TYPE_CLIENT;
                break;

            default:
                break;
        }

        if (isEmpty(profileData)) {
            res.api.badResponse({
                'message': 'Profile Not Found'
            })
        }

        profileData.profile_picture = isEmpty(profileData.profile_picture) ? null : profileData.profile_picture.file_path;

        profileData.like_flag = await this.myLikeService.likeFlag(profileData.id, likeType, req.authMember.id);
        profileData.total_likes = await this.myLikeService.totalLikes(profileData.id, likeType);
        res.api.create({
            'profile': profileData
        })
    }

    public changeStatus = async (req: Request, res: Response): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        const { status, registration_type }: any = req.body;

        let requestedProfile = await this.profileService.findProfile({
            where: { member_id: req.authMember.id }
        }, registration_type);

        let payload = {
            where: { id: Id }
        }

        return await this.requestService.getRequestById(payload)
            .then(async (request: RequestOutput) => {
                if (!isEmpty(request)) {
                    if (isEmpty(requestedProfile) || requestedProfile.id != request.to_member_id) {
                        res.api.badResponse({
                            message: `Invalid Request`
                        });
                    }

                    let validRequest: any;
                    if (registration_type == CONSTANT.MEMBER.CLIENT && status == RequestService.ACCEPTED_STATUS) {
                        validRequest = await this.requestService.checkRequestValidOrNot(req.authMember, registration_type, false);
                        if (!validRequest.status) {
                            return res.api.badResponse(validRequest)
                        }
                    }

                    await this.requestService.update({ status }, payload)

                    let notificationInfo: any = {
                        from_member_id: req.authMember.id,
                        meta: JSON.stringify({
                            request_id: Id,
                        })
                    };
                    let toMember: any = await this.profileService.findProfile({
                        where: {
                            id: request.from_member_id
                        }
                    }, request.request_type == RequestService.REQUEST_TYPE_CONTACT_INFORMATION ? CONSTANT.MEMBER.CLIENT : CONSTANT.MEMBER.SIDE_CHARACTER)
                    notificationInfo.to_member_id = toMember.member_id;
                    if (status == RequestService.ACCEPTED_STATUS) {
                        if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {   // RequestService.REQUEST_TYPE_CONTACT_INFORMATION
                            notificationInfo.notification_type = CONSTANT.NOTIFICATION_EVENT_TYPE.contact_information_request_accepted;
                        } else {  //RequestService.REQUEST_TYPE_INTERVIEW
                            notificationInfo.notification_type = CONSTANT.NOTIFICATION_EVENT_TYPE.interview_request_accepted;
                        }
                    } else if (status == RequestService.REJECTED_STATUS) {
                        if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {  // RequestService.REQUEST_TYPE_CONTACT_INFORMATION
                            notificationInfo.notification_type = CONSTANT.NOTIFICATION_EVENT_TYPE.contact_information_request_rejected;
                        } else {  //RequestService.REQUEST_TYPE_INTERVIEW
                            notificationInfo.notification_type = CONSTANT.NOTIFICATION_EVENT_TYPE.interview_request_rejected;
                        }
                    }
                    await saveNotification(notificationInfo);

                    res.api.create({
                        message: `request status changed successfully`,
                        ...validRequest
                    });
                } else {
                    res.api.validationErrors({
                        'Id': `Invalid Id`
                    });
                }
            })
    }
}
