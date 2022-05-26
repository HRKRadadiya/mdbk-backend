import { NextFunction, Request, Response } from 'express'
import { isEmpty, _json } from '../utils/helper';
import ProfileService, { ProfileOutput, RelatedImageOutput } from '../services/profile.service';
import { ClientProfileCompanyFieldService, ClientProfileCompanyHastagService, ClientProfileCompanyLocationService, ClientProfileCompanyService, ClientProfileFieldService, ClientProfileImageService, ClientProfileIntroductoryImageService, ClientProfileLocationService, ClientProfileService, MemberService, MyLikeService, ProjectService, ReportService, RequestService, SideCharacterProfileFieldService, SideCharacterProfileImageService, SideCharacterProfileLocationService, SideCharacterProfilePortfolioService, SideCharacterProfileService, SideCharacterProfileWorkExperienceService } from '../services';
import { SideCharacterProfileInput, SideCharacterProfileOutput } from '../models/sideCharacterProfile';
import { MemberOutput } from '../models/member';
import * as CONSTANTS from '../constants';
import { SideCharacterProfile, SideCharacterProfileImage, ClientProfile, ClientProfileCompany, ClientProfileImage, SideCharacterProfileWorkExperience } from '../models';
import { BadResponseHandler } from '../errorHandler';
import { SideCharacterProfileWorkExperienceInput, SideCharacterProfileWorkExperienceOutput } from '../models/sideCharacterProfileWorkExperience';
import { ClientProfileInput, ClientProfileOutput } from '../models/clientProfile';
import { ClientProfileCompanyInput } from '../models/clientProfileCompany';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

export default class ProfileController {
    public profileService = new ProfileService()
    public memberService = new MemberService()
    public myLikeService = new MyLikeService()
    public reportService = new ReportService()
    public projectService = new ProjectService()
    public requestService = new RequestService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public sideCharacterProfileFieldService = new SideCharacterProfileFieldService()
    public sideCharacterProfileLocationService = new SideCharacterProfileLocationService()
    public sideCharacterProfileImgService = new SideCharacterProfileImageService()
    public sideCharacterProfilePortfolioService = new SideCharacterProfilePortfolioService()
    public sideCharacterProfileWorkExperienceService = new SideCharacterProfileWorkExperienceService()

    /* client */
    public clientProfileService = new ClientProfileService()
    public clientProfileFieldService = new ClientProfileFieldService()
    public clientProfileCompanyLocationService = new ClientProfileCompanyLocationService()
    public clientProfileIntroductoryImageService = new ClientProfileIntroductoryImageService()
    public clientProfileCompanyService = new ClientProfileCompanyService()
    public clientProfileCompanyHastagService = new ClientProfileCompanyHastagService()
    public clientProfileCompanyFieldService = new ClientProfileCompanyFieldService()
    public clientProfileLocationService = new ClientProfileLocationService()
    public clientProfileImageService = new ClientProfileImageService()

    public sendPhoneVerifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { phone, registration_type } = req.body;
        const payload: { phone: number, registration_type: number, member_id: number } = {
            phone, registration_type,
            member_id: req.authMember.id
        }

        this.profileService.sendPhoneVerificationCode(payload)
            .then(() => {
                res.api.create({
                    message: "Verification code send successfully"
                })
            }).catch((err: Error) => next(err));
    }

    public confirmPhoneVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { phone, phone_verification_code, registration_type } = req.body;
        this.profileService.findByMemberId(req.authMember.id, registration_type)
            .then(async (profileData: ProfileOutput) => {
                let isVerify = phone_verification_code == profileData.phone_verification_code;
                const profilePayload = {
                    is_phone_verified: isVerify,
                    member_id: req.authMember.id,
                    phone
                }
                const filter = { where: { member_id: req.authMember.id } }
                try {
                    await this.profileService.update(profilePayload, filter, registration_type)
                } catch (error) {
                    next(error)
                }

                res.api.create({
                    is_verify: isVerify,
                })
            })
            .catch((err: Error) => next(err));
    }

    public uploadRelatedImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const file: any = req.files;
        const { registration_type }: any = req.body;
        if (isEmpty(file)) {
            res.api.badResponse({
                "message": "Images must be required"
            })
        }

        this.profileService.findByMemberId(req.authMember.id, registration_type)
            .then(async (profile: ProfileOutput) => {
                this.profileService.uploadRelatedImages(file.related_images, registration_type, profile)
                    .then((data: any) => {
                        res.api.create(data)
                    }).catch((err: Error) => next(err));
            }).catch((err: Error) => next(err));
    }

    public removeRelatedImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        const { registration_type }: any = req.query;
        this.profileService.findRelatedImagesById(Id, registration_type)
            .then(async (relatedImages: RelatedImageOutput) => {
                if (!isEmpty(relatedImages)) {
                    let filter: any = { where: { id: Id } }
                    this.profileService.destroyRelatedImages(filter, relatedImages, registration_type)
                        .then(() => {
                            res.api.create({
                                'message': 'Your file deleted successfully'
                            })
                        }).catch((err: Error) => next(err));
                } else {
                    res.api.create({
                        'message': 'Your file not found',
                    })

                    res.api.validationErrors({
                        "Id": "Invalid Id",
                    });
                }
            }).catch((err: Error) => next(err));
    }

    public uploadProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const file: any = req.files;
        if (isEmpty(file)) {
            res.api.badResponse({
                "message": "Images must be required"
            })
        }
        const { registration_type } = req.body;
        this.profileService.findByMemberId(req.authMember.id, registration_type)
            .then(async (profile: any) => {
                this.profileService.uploadProfilePicture(file.profile_image, registration_type, profile)
                    .then(async (profileImage: any) => {
                        profileImage = await _json(profileImage);
                        res.api.create({
                            "message": "Profile Image Upload Successfully",
                            "profile_image": (isEmpty(profileImage)) ? null : profileImage.file_path
                        })
                    }).catch((err: Error) => next(err));

            }).catch((err: Error) => next(err));
    }

    //side character

    public sideCharProfileStep1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const sideCharacter = req.body
        let sideCharacterProfileData: SideCharacterProfileInput = {
            nick_name: sideCharacter.nick_name,
            introduction: sideCharacter.introduction,
            // phone: sideCharacter.phone,
            profession: sideCharacter.profession.toString(),
            homepage_link: sideCharacter.homepage_link,
            facebook_link: sideCharacter.facebook_link,
            instagram_link: sideCharacter.instagram_link,
            other_link: sideCharacter.other_link,
            member_id: req.authMember.id
        };
        const filter = { where: { member_id: req.authMember.id } }

        return await this.sideCharacterProfileService.getSideCharacterByNickName(sideCharacter.nick_name)
            .then(async (sideCharData) => {
                if (isEmpty(sideCharData) || (!isEmpty(sideCharData) && sideCharData?.member_id == req.authMember.id)) {
                    // find side character
                    return await this.sideCharacterProfileService.getSideCharacterByMemberId(req.authMember.id)
                        .then(async (sideCharData: SideCharacterProfileOutput) => {
                            return await this.sideCharacterProfileService.update(sideCharacterProfileData, filter)
                                .then(async (profile: any) => {
                                    try {
                                        if (!isEmpty(sideCharacter.fields)) {
                                            const profileFieldData: any = sideCharacter.fields.map((field: any) => {
                                                return {
                                                    side_character_profile_id: profile.id,
                                                    name: field
                                                }
                                            })
                                            await this.sideCharacterProfileFieldService.create(profileFieldData);
                                        }

                                        /* create sideCharacter Profile location */
                                        if (!isEmpty(sideCharacter.locations)) {
                                            const profileLocationData: any = sideCharacter.locations.map((location: any) => {
                                                return {
                                                    side_character_profile_id: profile.id,
                                                    city: location.province_id,
                                                    district: location.district_id,
                                                    id: location.id
                                                }
                                            })
                                            await this.sideCharacterProfileLocationService.createOrUpdateLocation(profileLocationData);
                                        }
                                        // update progress
                                        await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.SIDE_CHARACTER, 1);

                                        return await this.memberService.findById(req.authMember.id)
                                            .then(async (member: MemberOutput) => {
                                                let filter: any = {
                                                    where: { member_id: member.id },
                                                    include: ['fields', 'locations', 'portfolios', 'profile_picture']
                                                };

                                                return await this.sideCharacterProfileService.findProfile(filter)
                                                    .then(async (profile: any) => {
                                                        profile = profile.toJSON()
                                                        profile.fields = profile.fields.map((item: any) => item.name)
                                                        if (!isEmpty(profile.profile_picture)) {
                                                            profile.profile_picture = profile.profile_picture.file_path;
                                                        }
                                                        return res.api.create({
                                                            "progress": member.side_character_profile_progress,
                                                            "side_character": profile
                                                        });
                                                    })
                                                    .catch((err: Error) => next(err));
                                            }).catch(() => next(new BadResponseHandler('User Not Found')));

                                    } catch (error) {
                                        next(error)
                                    }
                                }).catch((err: Error) => next(err));
                        })
                        .catch((err: Error) => next(err));

                } else {
                    res.api.validationErrors({
                        "nick_name": "Nickname already exists"
                    });
                }
            }).catch((err: Error) => next(err));
    }

    public sideCharProfileStep2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { experience }: { experience: SideCharacterProfileWorkExperienceInput[] } = req.body

        let experianceValidation: any = {};

        let workExperience: SideCharacterProfileWorkExperienceInput[]
            = experience.map((experience: SideCharacterProfileWorkExperienceInput) => {
                if (isEmpty(experience.employment_end_date) && isEmpty(experience.is_employed_currently)) {
                    experianceValidation = {
                        'is_employed_currently': 'is_employed_currently field is required'
                    }
                }

                if (isEmpty(experience.employment_end_date) && experience.is_employed_currently == false) {
                    experianceValidation = {
                        'employment_end_date': 'employment_end_date field id required'
                    }
                }

                if (!isEmpty(experience.employment_end_date) && !isEmpty(experience.is_employed_currently)) {
                    experianceValidation = {
                        'is_employed_currently': 'only one field required instead of (is_employed_currently, employment_end_date) both field'
                    }
                }

                let data: any = {
                    id: experience.id,
                    company_name: experience.company_name,
                    position: experience.position,
                    profession: experience.profession,
                    employment_start_date: experience.employment_start_date,
                    employment_end_date: experience.is_employed_currently ? null : experience.employment_end_date,
                    is_employed_currently: experience.is_employed_currently
                }
                return data;
            })

        if (!isEmpty(experianceValidation)) {
            return res.api.validationErrors(experianceValidation);
        }

        const filter: any = { where: { member_id: req.authMember.id } }

        const updateProfilePayload: any = {
            member_id: req.authMember.id,
            is_experienced: (!isEmpty(experience)) ? "yes" : "no"
        }

        return await this.sideCharacterProfileService.getSideCharacterByMemberId(req.authMember.id)
            .then((sideChar: SideCharacterProfileOutput) => {
                if (!isEmpty(sideChar)) {
                    this.sideCharacterProfileService.update(updateProfilePayload, filter)
                        .then(async () => {
                            workExperience = workExperience.map((experience: any) => {
                                return {
                                    ...experience,
                                    side_character_profile_id: sideChar.id
                                }
                            });

                            return await this.sideCharacterProfileWorkExperienceService.createOrUpdate(workExperience)
                                .then(async () => {
                                    // update progress
                                    await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.SIDE_CHARACTER, 2);

                                    // return response
                                    return await this.memberService.findById(req.authMember.id)
                                        .then(async (member: MemberOutput) => {
                                            let filter: any = {
                                                where: { member_id: member.id },
                                                include: ['experiences']
                                            };
                                            return await this.sideCharacterProfileService.findProfile(filter)
                                                .then(async (profile: any) => {
                                                    return res.api.create({
                                                        "progress": member.side_character_profile_progress,
                                                        "side_character": profile
                                                    });
                                                })
                                                .catch((err: Error) => next(err));
                                        }).catch(() => next(new BadResponseHandler('User Not Found')));
                                }).catch((err: Error) => next(err));
                        }).catch((err: Error) => next(err));
                } else {
                    res.api.badResponse({
                        "message": "Side Character Not Found",
                    });
                }
            })
    }

    public sideCharProfileStep3 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const sideCharacter = req.body
        const filter = { where: { member_id: req.authMember.id } }

        const updateProfilePayload = {
            desired_date: sideCharacter.desired_date,
            desired_time: sideCharacter.desired_time,
            desired_project_type: sideCharacter.desired_project_type,
            insurance_status: sideCharacter.insurance_status,
            desired_work_type: sideCharacter.desired_work_type,
            member_id: req.authMember.id
        }

        return await this.sideCharacterProfileService.update(updateProfilePayload, filter)
            .then(async (sideCharacterProdile: any) => {

                // update progress
                await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.SIDE_CHARACTER, 3);

                // return response
                return await this.memberService.findById(req.authMember.id)
                    .then(async (member: MemberOutput) => {
                        return res.api.create({
                            "progress": member.side_character_profile_progress,
                            "side_character": sideCharacterProdile
                        });
                    }).catch(() => next(new BadResponseHandler('User Not Found')));
            }).catch((err: Error) => next(err));
    }

    public sideCharFindProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        return await this.memberService.findById(Id)
            .then(async (member: MemberOutput) => {
                let filter: any = {
                    where: { member_id: member.id },
                    include: ['fields', 'locations', 'portfolios', 'profile_picture', 'experiences']
                };

                let fromProfileData: any;

                if (!isEmpty(req.authMember)) {
                    fromProfileData = await this.profileService.findProfile({
                        where: { member_id: req.authMember.id }
                    }, CONSTANTS.MEMBER.CLIENT);
                }

                return await this.sideCharacterProfileService.findProfile(filter)
                    .then(async (profile: any) => {
                        if (isEmpty(profile)) {
                            res.api.validationErrors({
                                "profile": "Profile Not Found"
                            })
                        }

                        profile = profile.toJSON()
                        profile.like_flag = false;
                        profile.is_already_requested = false;

                        profile.fields = profile.fields.map((item: any) => item.name)
                        if (!isEmpty(profile.profile_picture)) {
                            profile.profile_picture = profile.profile_picture.file_path;
                        }
                        if (!isEmpty(req.authMember)) {
                            profile.like_flag = await this.myLikeService.likeFlag(profile.id, MyLikeService.LIKE_TYPE_SIDE_CHARACTER, req.authMember.id);
                            if (!isEmpty(fromProfileData)) {
                                profile.is_already_requested = await this.requestService.isAlreadyRequested(fromProfileData.id, profile.id, RequestService.REQUEST_TYPE_CONTACT_INFORMATION);
                                profile.request = await this.requestService.findByMemberProfile(fromProfileData.id, profile.id, RequestService.REQUEST_TYPE_CONTACT_INFORMATION);
                            }
                        }
                        profile.report_count = await this.reportService.myReportCount(profile.id, ReportService.LIKE_TYPE_SIDE_CHARACTER);
                        profile.total_likes = await this.myLikeService.totalLikes(profile.id, MyLikeService.LIKE_TYPE_SIDE_CHARACTER);

                        profile.experiences = _.orderBy(profile.experiences, ['id'], ['asc']);

                        return res.api.create({
                            "name": member.name,
                            "progress": member.side_character_profile_progress,
                            "side_character": profile
                        });
                    })
                    .catch((err: Error) => next(err));
            }).catch(() => next(new BadResponseHandler('User Not Found')));
    }

    public sideCharDeleteExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        this.sideCharacterProfileWorkExperienceService.findById(Id)
            .then((experience: any) => {
                if (!isEmpty(experience)) {
                    this.sideCharacterProfileWorkExperienceService.destroy({ where: { id: Id } })
                        .then(() => {
                            res.api.create({
                                "message": "Work Experience deleted successfully",
                            });
                        }).catch((err: Error) => next(err));
                } else {
                    res.api.badResponse({
                        "message": "Experience Not Found",
                    });
                }
            }).catch((err: Error) => next(err));
    }

    // client

    public clientProfileStep1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const client = req.body
        let clientProfileData: ClientProfileInput = {
            nick_name: client.nick_name,
            introduction: client.introduction,
            // phone: client.phone,
            profession: client.profession.toString(),
            homepage_link: client.homepage_link,
            facebook_link: client.facebook_link,
            instagram_link: client.instagram_link,
            other_link: client.other_link,
            member_id: req.authMember.id
        };
        const filter = { where: { member_id: req.authMember.id } }

        this.clientProfileService.getClientByNickName(client.nick_name)
            .then(async (clientProfile) => {
                if (isEmpty(clientProfile) || (!isEmpty(clientProfile) && clientProfile?.member_id == req.authMember.id)) {
                    this.clientProfileService.getClientProfileByMemberId(req.authMember.id)
                        .then((clientData: ClientProfileOutput) => {
                            // clientProfileData = { ...clientProfileData, phone: (clientData.is_phone_verified) ? clientProfileData.phone : '' }
                            this.clientProfileService.update(clientProfileData, filter)
                                .then(async (profile: any) => {
                                    try {
                                        if (!isEmpty(client.fields)) {
                                            const profileFieldData: any = client.fields.map((field: any) => {
                                                return {
                                                    client_profile_id: profile.id,
                                                    name: field
                                                }
                                            })
                                            await this.clientProfileFieldService.create(profileFieldData);
                                        }

                                        /*
                                        create client Profile location
                                       */
                                        if (!isEmpty(client.locations)) {
                                            const locationData: any = client.locations.map((location: any) => {
                                                return {
                                                    client_profile_id: profile.id,
                                                    city: location.province_id,
                                                    district: location.district_id,
                                                    id: location.id
                                                }
                                            })

                                            await this.clientProfileLocationService.createOrUpdate(locationData);
                                        }

                                        // update progress
                                        await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.CLIENT, 1);

                                        let member: MemberOutput = await this.memberService.findById(req.authMember.id);

                                        let filter: any = {
                                            where: { member_id: member.id },
                                            include: ['fields', 'locations', 'introductories', 'profile_picture']
                                        };

                                        await this.clientProfileService.findProfile(filter)
                                            .then(async (profile: any) => {
                                                profile = profile.toJSON()
                                                profile.fields = profile.fields.map((item: any) => item.name)
                                                if (!isEmpty(profile.profile_picture)) {
                                                    profile.profile_picture = profile.profile_picture.file_path;
                                                }
                                                res.api.create({
                                                    "progress": member.client_profile_progress,
                                                    "client_profile": profile
                                                });
                                            }).catch((err: Error) => next(err));
                                    } catch (error) {
                                        next(error)
                                    }
                                }).catch((err: Error) => next(err));
                        }).catch((err: Error) => next(err));;
                } else {
                    res.api.validationErrors({
                        "nick_name": "Nickname already exists"
                    });
                }
            }).catch((err: Error) => next(err));
    }

    public clientProfileStep2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { company, is_company }: { company: any, is_company: string } = req.body

        let companyProfile: ClientProfileCompanyInput;
        if (is_company == 'yes') {
            companyProfile = {
                client_profile_id: 0,
                name: company.name,
                introduction: company.introduction,
                contact_information: company.contact_information,
                profession: company.profession.toString(),
                registation_number: company.registation_number,
                foundation_year: company.foundation_year,
                representative_name: company.representative_name,
                total_employees: company.total_employees,
            }
        }

        const filter = { where: { member_id: req.authMember.id } }

        const updateProfilePayload = {
            member_id: req.authMember.id,
            is_company: (is_company == 'yes') ? "yes" : "no"
        }

        this.clientProfileService.update(updateProfilePayload, filter)
            .then(async (clientProfileData: ClientProfileOutput) => {
                if (is_company == 'yes') {
                    companyProfile = { ...companyProfile, client_profile_id: clientProfileData.id }
                    await this.clientProfileCompanyService.createOrUpdate(companyProfile)
                        .then(async (companyProfile: ClientProfileCompany) => {
                            try {
                                if (!isEmpty(company.hashtags)) {
                                    const hashtagsData: any = company.hashtags.map((hashtag: any) => {
                                        return {
                                            client_profile_company_id: companyProfile.id,
                                            name: hashtag
                                        }
                                    })
                                    await this.clientProfileCompanyHastagService.create(hashtagsData);
                                }

                                if (!isEmpty(company.fields)) {
                                    const fieldsData: any = company.fields.map((field: any) => {
                                        return {
                                            client_profile_company_id: companyProfile.id,
                                            name: field
                                        }
                                    })
                                    await this.clientProfileCompanyFieldService.create(fieldsData);
                                }

                                if (!isEmpty(company.locations)) {
                                    const locationData: any = company.locations.map((location: any) => {
                                        return {
                                            client_profile_company_id: companyProfile.id,
                                            city: location.province_id,
                                            district: location.district_id,
                                            id: location.id
                                        }
                                    })

                                    await this.clientProfileCompanyLocationService.createOrUpdate(locationData);
                                }
                            } catch (error) {
                                next(error)
                            }
                        }).catch((err: Error) => next(err));
                }


                // update progress
                await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.CLIENT, 2);
                // create res with updated progress
                let member: MemberOutput = await this.memberService.findById(req.authMember.id);

                let filter: any = {
                    where: { member_id: member.id },
                    include: [
                        {
                            model: ClientProfileCompany,
                            as: 'company',
                            include: ['fields', 'locations', 'hashtags']
                        }
                    ]
                };

                await this.clientProfileService.findProfile(filter)
                    .then(async (profile: any) => {
                        profile = profile.toJSON()
                        if (is_company == 'yes') {
                            profile.company.fields = profile.company.fields.map((item: any) => item.name)
                            profile.company.hashtags = profile.company.hashtags.map((item: any) => item.name)
                        } else {
                            profile.company = null;
                        }
                        res.api.create({
                            "progress": member.client_profile_progress,
                            "client_profile": profile
                        });
                    }).catch((err: Error) => next(err));
            }).catch((err: Error) => next(err));
    }

    public clientProfileStep3 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const client = req.body
        const filter = { where: { member_id: req.authMember.id } }

        const updateProfilePayload: any = {
            desired_date: client.desired_date,
            desired_time: client.desired_time,
            desired_project_type: client.desired_project_type,
            insurance_status: client.insurance_status,
            desired_work_type: client.desired_work_type,
            member_id: req.authMember.id
        }

        this.clientProfileService.update(updateProfilePayload, filter)
            .then(async (clientProfile: any) => {
                // update progress
                await this.memberService.updateProfileProgress(req.authMember.id, CONSTANTS.MEMBER.CLIENT, 3);
                // create res with updated progress
                let member: MemberOutput = await this.memberService.findById(req.authMember.id);

                res.api.create({
                    "progress": member.client_profile_progress,
                    "client_profile": clientProfile,
                });
            }).catch((err: Error) => next(err));
    }

    public findClientProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        return await this.memberService.findById(Id)
            .then(async (member: MemberOutput) => {
                if (isEmpty(member)) {
                    res.api.validationErrors({
                        "email": "User Not Found"
                    })
                }
                let filter: any = {
                    where: { member_id: member.id },
                    include: ['fields', 'locations', 'profile_picture', { model: ClientProfileCompany, as: 'company', include: ['fields', 'locations', 'hashtags'] }, 'introductories']
                };

                let fromProfileData: any;
                if (!isEmpty(req.authMember)) {
                    fromProfileData = await this.profileService.findProfile({
                        where: { member_id: req.authMember.id }
                    }, CONSTANTS.MEMBER.SIDE_CHARACTER);
                }

                await this.clientProfileService.findProfile(filter)
                    .then(async (profile: any) => {
                        if (isEmpty(profile)) {
                            res.api.validationErrors({
                                "profile": "Profile Not Found"
                            })
                        }
                        profile = profile.toJSON()
                        profile.like_flag = false;
                        profile.is_already_requested = false;
                        profile.fields = profile.fields.map((item: any) => item.name)
                        if (!isEmpty(profile.company) && profile.is_company == 'yes') {
                            profile.company.fields = profile.company.fields.map((item: any) => item.name)
                            profile.company.hashtags = profile.company.hashtags.map((item: any) => item.name)
                        } else {
                            profile.company = null;
                        }
                        profile.report_count = await this.reportService.myReportCount(profile.id, ReportService.LIKE_TYPE_CLIENT);
                        if (!isEmpty(profile.profile_picture)) {
                            profile.profile_picture = profile.profile_picture.file_path;
                        }

                        if (!isEmpty(req.authMember)) {
                            profile.like_flag = await this.myLikeService.likeFlag(profile.id, MyLikeService.LIKE_TYPE_CLIENT, req.authMember.id);
                            if (!isEmpty(fromProfileData)) {
                                profile.is_already_requested = await this.requestService.isAlreadyRequested(fromProfileData.id, profile.id, RequestService.REQUEST_TYPE_INTERVIEW);
                                profile.request = await this.requestService.findByMemberProfile(fromProfileData.id, profile.id, RequestService.REQUEST_TYPE_INTERVIEW);
                            }
                        }

                        profile.projects = [];
                        if (profile.is_company == 'yes') {
                            profile.projects = await this.projectService.findAll({
                                where: {
                                    member_id: profile.member_id,
                                },
                                attributes: ['field', 'id']
                            });
                        }

                        profile.total_likes = await this.myLikeService.totalLikes(profile.id, MyLikeService.LIKE_TYPE_CLIENT);
                        return res.api.create({
                            "name": member.name,
                            "progress": member.client_profile_progress,
                            "client_profile": profile
                        });
                    }).catch((err: Error) => next(err));
            })
    };

    /* change notification settigs */
    public changeNotificationSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { status }: { status: boolean } = req.body;
        let payload: any = {
            id: req.authMember.id,
            is_notification: status
        }
        return await this.memberService.updateMember(payload)
            .then(async () => {
                res.api.create({
                    "message": "Notification status changed successfully"
                });
            })
            .catch((err: Error) => next(err));
    }

    /* edir information settigs */
    public editInformationSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        return await this.memberService
            .getMemberByEmail(email)
            .then(async (member: MemberOutput) => {
                if (isEmpty(member) || (!isEmpty(member) && member.id == req.authMember.id)) {
                    const hashedPassword: string = await bcrypt.hash(password, 8);
                    let payload: any = {
                        id: req.authMember.id,
                        name,
                        email,
                        password: hashedPassword,
                    }
                    return await this.memberService.updateMember(payload)
                        .then(async () => {
                            try {
                                let memberData: MemberOutput = await this.memberService.findById(req.authMember.id);
                                res.api.create({
                                    "message": "information setting update successfully",
                                    "member": memberData
                                });
                            } catch (error) {
                                next(error)
                            }
                        }).catch((err: Error) => next(err));
                } else {
                    next(new BadResponseHandler("Email already exists"))
                }
            }).catch((err: Error) => next(err));
    }

    /* delete member account */
    public deleteMamberAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        const payload: { id: number, status: string, termination_at: Date } = {
            id: Id,
            status: MemberService.STATUS_DISABLE,
            termination_at: new Date(),
        }
        return await this.memberService.updateMember(payload)
            .then(async () => {
                res.api.create({
                    "message": "Your account deleted successfully"
                });
            }).catch((err: Error) => next(err));
    }

    public isValidToken = (req: Request, res: Response, next: NextFunction): any => {
        return res.api.create({
            status: true
        });
    }

    public findMyPageSettigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const request: any = req.query;
        let filter: any
        let type: any;

        if (request.registration_type == CONSTANTS.MEMBER.SIDE_CHARACTER) {
            filter = {
                where: { id: req.authMember.id },
                include: {
                    model: SideCharacterProfile,
                    as: "side_character_profile",
                    include: ['profile_picture']
                }
            }
            type = "side_character_profile";
        } else {
            filter = {
                where: { id: req.authMember.id },
                include: {
                    model: ClientProfile,
                    as: "client_profile",
                    include: ['profile_picture']
                }
            }
            type = "client_profile";
        }

        return await this.memberService.findByMemberId(filter)
            .then(async (member: any) => {
                let memberData: any = member.toJSON();
                memberData.nick_name = null;
                memberData.profile_picture = null;
                if (!isEmpty(memberData[type])) {
                    memberData.nick_name = memberData[type].nick_name;
                    memberData.available_coin = (request.registration_type == CONSTANTS.MEMBER.SIDE_CHARACTER) ? parseFloat(memberData.side_character_available_coin) : parseFloat(memberData.client_available_coin)
                    if (!isEmpty(memberData[type].profile_picture)) {
                        memberData.profile_picture = memberData[type].profile_picture.file_path;
                        delete memberData[type].profile_picture;
                    }
                    delete memberData[type];
                }
                res.api.create({
                    'member': memberData
                });
            }).catch((err: Error) => next(err));
    }

    public likeUnlike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const payload: any = {
            like_type: req.body.like_type,
            source_id: req.body.source_id,
            member_id: parseInt(req.authMember.id + ""),
        };
        const like_flag = await this.myLikeService.likeUnlike(payload);
        res.api.create({
            like_flag
        });
    }

    public reportUnreport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const payload: any = {
            report_type: req.body.report_type,
            source_id: req.body.source_id,
            member_id: parseInt(req.authMember.id + ""),
        };
        const report_flag = await this.reportService.likeUnlike(payload);
        res.api.create({
            report_flag
        });
    }

}