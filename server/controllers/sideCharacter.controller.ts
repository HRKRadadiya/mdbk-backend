import { MemberOutput } from './../models/member';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express'
import {
    SideCharacterProfileService, SideCharacterProfileFieldService, SideCharacterProfileLocationService, SideCharacterProfileImageService,
    SideCharacterProfilePortfolioService, SideCharacterProfileWorkExperienceService, MemberService
} from '../services'
import { SideCharacterProfileInput, SideCharacterProfileOutput } from '../models/sideCharacterProfile';
import { isEmpty, saveFile } from '../utils/helper';
import { SideCharacterProfileWorkExperienceInput, SideCharacterProfileWorkExperienceOutput } from '../models/sideCharacterProfileWorkExperience';
import config from '../config/config';
import { UploadedFile } from 'express-fileupload';
import * as CONSTANTS from '../constants';
import { sideCharacterProfilePortfolioOutput } from '../models/sideCharacterProfilePortfolio';
import { BadResponseHandler } from '../errorHandler';
import ProfileService from '../services/profile.service';
import { SideCharacterProfile, SideCharacterProfileImage } from '../models'

export default class SideCharacterProfileController {

    public memberService = new MemberService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public sideCharacterProfileFieldService = new SideCharacterProfileFieldService()
    public sideCharacterProfileLocationService = new SideCharacterProfileLocationService()
    public sideCharacterProfileImgService = new SideCharacterProfileImageService()
    public sideCharacterProfilePortfolioService = new SideCharacterProfilePortfolioService()
    public sideCharacterProfileWorkExperienceService = new SideCharacterProfileWorkExperienceService()
    public profileService = new ProfileService()

    /**
    * @param {Id} req.params.Id
    * @return Success : data
    * @return Error : error
    */

    public getSideCharacterByMemberId = async (req: Request, res: Response): Promise<void> => {
        //  const Id = req.memberId;
        const Id: number = 1;
        this.sideCharacterProfileService
            .getSideCharacterByMemberId(Id)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data[0]
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

    /**
      * @param {Id} req.params.Id
      * @return Success : data
      * @return Error : error
      */

    public getSideCharacterByProfession = async (req: Request, res: Response): Promise<void> => {
        const profession: string = req.params.profession;
        this.sideCharacterProfileService
            .getSideCharacterByProfession(profession)
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

    /**
     * @input : Form( Object ) : req.body
     * @return Success : {nick_name: x,introduction:x,profession:x,homepage_link:x,facebook_link:x,instagram_link:x,other_link:x,is_experienced: x,desired_date:x, desired_time:x,
                           desired_project_type: x,insurance_status:x,member_id:x}
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public createSideCharacterProfile = async (req: Request, res: Response): Promise<void> => {
        const sideCharacter = req.body
        const sideCharacterProfileData = {
            nick_name: sideCharacter.nickName,
            introduction: sideCharacter.introduction,
            phone: sideCharacter.phoneNumber,
            profession: sideCharacter.profession.toString(),
            homepage_link: sideCharacter.homepageLink,
            facebook_link: sideCharacter.facebookLink,
            instagram_link: sideCharacter.instagramLink,
            other_link: sideCharacter.otherLink,
            is_experienced: sideCharacter.isExperienced,
            desired_date: sideCharacter.desiredDate,
            desired_time: sideCharacter.desiredTime,
            desired_project_type: sideCharacter.desiredProjectType,
            insurance_status: sideCharacter.insuranceStatus,
            desired_work_type: sideCharacter.desiredWorkType,
            member_id: sideCharacter.memberId
        };

        this.sideCharacterProfileService.getSideCharacterByNickName(sideCharacterProfileData.nick_name)
            .then(async (nickNameExist) => {
                if (!nickNameExist) {
                    this.sideCharacterProfileService
                        .createSideCharacterProfile(sideCharacterProfileData)
                        .then((data) => {
                            /*
                            create sideCharacter Profile field
                            */
                            if (sideCharacter.fieldName && sideCharacter.fieldName != '') {
                                const sideCharacProfileFieldData: any = [];
                                for (let i = 0; i < sideCharacter.fieldName.length; i++) {
                                    sideCharacProfileFieldData.push({
                                        side_character_profile_id: data.id,
                                        name: sideCharacter.fieldName[i]
                                    })
                                }
                                if (sideCharacProfileFieldData.length > 0) {
                                    this.sideCharacterProfileFieldService.create(sideCharacProfileFieldData);
                                }
                            }
                            /*
                            create sideCharacter Profile location
                           */
                            if (sideCharacter.location && sideCharacter.location != '') {
                                const sideCharacProfileLocationData: any = [];
                                if (sideCharacter.location.length > 0) {
                                    for (let i = 0; i < sideCharacter.location.length; i++) {
                                        sideCharacProfileLocationData.push({
                                            side_character_profile_id: data.id,
                                            city: sideCharacter.location[i].city,
                                            district: sideCharacter.location[i].district,
                                            country: 'test'
                                        })
                                    }
                                    this.sideCharacterProfileLocationService.create(sideCharacProfileLocationData);
                                }
                            }
                            /*
                            create sideCharacter Profile Portfolio
                           */
                            if (sideCharacter.portfolio && sideCharacter.portfolio != '') {
                                const sideCharacterImgData: any = [];
                                for (let i = 0; i < sideCharacter.portfolio.length; i++) {
                                    sideCharacterImgData.push({
                                        side_character_profile_id: data.id,
                                        file_name: sideCharacter.portfolio[i].fileName,
                                        original_file_name: sideCharacter.portfolio[i].originalName,
                                        file_type: sideCharacter.portfolio[i].fileType,
                                        file_path: sideCharacter.portfolio[i].filePath,
                                    })
                                }
                                if (sideCharacterImgData.length > 0) {
                                    // this.sideCharacterProfilePortfolioService.create(sideCharacterImgData);
                                }
                            }
                            /*
                           create sideCharacter Profile image
                          */
                            if (sideCharacter.img && sideCharacter.img != '') {
                                const sideCharacterImgData: any = [];
                                for (let i = 0; i < sideCharacter.img.length; i++) {
                                    sideCharacterImgData.push({
                                        side_character_profile_id: data.id,
                                        file_name: sideCharacter.img[i].fileName,
                                        original_file_name: sideCharacter.img[i].originalName,
                                        file_type: sideCharacter.img[i].fileType,
                                        file_path: sideCharacter.img[i].filePath,
                                    })
                                }
                                if (sideCharacterImgData.length > 0) {
                                    this.sideCharacterProfileImgService.createSideCharacProfileImg(sideCharacterImgData);
                                }
                            }
                            /*
                            create sideCharacter Profile Work experience
                          */
                            if (sideCharacter.experience && sideCharacter.experience.length > 0) {
                                sideCharacter.experience.map((exp: any) => {
                                    const experienceData: any = [];
                                    experienceData.push({
                                        side_character_profile_id: data.id,
                                        company_name: exp.companyName,
                                        position: exp.position,
                                        profession: exp.profession,
                                        employment_start_date: exp.empStartDate,
                                        employment_end_date: exp.empEndDate,

                                    })
                                    if (experienceData.length > 0) {
                                        // this.sideCharacterProfileWorkExperienceService.createSideCharacProfileWorkExp(experienceData)
                                    }
                                })
                            }
                            res.status(httpStatus.OK).send({
                                "status": "success",
                                "data": "Side Character Profile Created successfully"
                            });

                        }).catch((err) => {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                "error": {
                                    "status": "failure",
                                    "message": err.message
                                }
                            });
                        });
                } else {
                    res.status(httpStatus.BAD_REQUEST).send({
                        "error": {
                            "status": "failure",
                            "message": "Nickname already exists"
                        }
                    });
                }
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    }

    /**
     * @input : Form( Object ) : SideCharacterData
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public updateSideCharacterProfile = async (req: Request, res: Response): Promise<void> => {
        const Id = parseInt(req.params.Id);
        const filter = { where: { id: Id } }
        const sideCharacter = req.body
        const sideCharacterFilter = { where: { side_character_profile_id: Id } }
        const sideCharacterProfileData = {
            nick_name: sideCharacter.nickName,
            introduction: sideCharacter.introduction,
            phone: sideCharacter.phoneNumber,
            profession: sideCharacter.profession,
            homepage_link: sideCharacter.homepageLink,
            facebook_link: sideCharacter.facebookLink,
            instagram_link: sideCharacter.instagramLink,
            other_link: sideCharacter.otherLink,
            is_experienced: sideCharacter.isExperienced,
            desired_date: sideCharacter.desiredDate,
            desired_time: sideCharacter.desiredTime,
            desired_project_type: sideCharacter.desiredProjectType,
            insurance_status: sideCharacter.insuranceStatus,
            desired_work_type: sideCharacter.desiredWorkType,
            member_id: sideCharacter.memberId
        };

        this.sideCharacterProfileService.getSideCharacterProfile(Id)
            .then((sideCharacData) => {
                if (sideCharacData.length > 0) {
                    this.sideCharacterProfileService
                        .update(sideCharacterProfileData, filter)

                    // update sideCharacter Profile field

                    if (sideCharacter.fieldName && sideCharacter.fieldName.length > 0) {
                        sideCharacter.fieldName.map((field: string) => {
                            const sideCharacterProfileFieldData: any = [];
                            sideCharacterProfileFieldData.push({
                                side_character_profile_id: Id,
                                name: field
                            })
                            if (sideCharacterProfileFieldData.length > 0) {
                                this.sideCharacterProfileFieldService.deleteSideCharacProfileField(sideCharacterFilter).then(() => {
                                    this.sideCharacterProfileFieldService.create(sideCharacterProfileFieldData);
                                })

                            }
                        })
                    }

                    // update sideCharacter Profile location

                    if (sideCharacter.location && sideCharacter.location.length > 0) {
                        sideCharacter.location.map((locations: any) => {
                            const sideCharacProfileLocationData: any = [];
                            sideCharacProfileLocationData.push({
                                side_character_profile_id: Id,
                                city: locations.city,
                                district: locations.district,
                                country: locations.country
                            })
                            if (sideCharacProfileLocationData.length > 0) {
                                this.sideCharacterProfileLocationService.deleteSideCharacProfileLocation(sideCharacterFilter).then(() => {
                                    this.sideCharacterProfileLocationService.create(sideCharacProfileLocationData);
                                })

                            }
                        })
                    }

                    // update sideCharacter Profile portfolio

                    if (sideCharacter.portfolio && sideCharacter.portfolio.length > 0) {
                        sideCharacter.portfolio.map((imgs: any) => {
                            const sideCharacPortfolioData: any = [];
                            sideCharacPortfolioData.push({
                                side_character_profile_id: Id,
                                file_name: imgs.fileName,
                                original_file_name: imgs.originalName,
                                file_type: imgs.fileType,
                                file_path: imgs.filePath
                            })
                            if (sideCharacPortfolioData.length > 0) {
                                // this.sideCharacterProfilePortfolioService.destroy(sideCharacterFilter).then(() => {
                                //     // this.sideCharacterProfilePortfolioService.create(sideCharacPortfolioData);
                                // })

                            }
                        })
                    }

                    // update sideCharacter Profile Image

                    if (sideCharacter.img && sideCharacter.img.length > 0) {
                        sideCharacter.img.map((img: any) => {
                            const sideCharacImgData: any = [];
                            sideCharacImgData.push({
                                side_character_profile_id: Id,
                                file_name: img.fileName,
                                original_file_name: img.originalName,
                                file_type: img.fileType,
                                file_path: img.filePath
                            })
                            if (sideCharacImgData.length > 0) {
                                // this.sideCharacterProfileImgService.deleteSideCharacProfileImg(sideCharacterFilter).then(() => {
                                //     this.sideCharacterProfileImgService.createSideCharacProfileImg(sideCharacImgData);
                                // })
                            }
                        })
                    }

                    // update sideCharacter Profile experience

                    if (sideCharacter.experience && sideCharacter.experience.length > 0) {
                        sideCharacter.experience.map((exp: any) => {
                            const experienceData: any = [];
                            experienceData.push({
                                side_character_profile_id: Id,
                                company_name: exp.companyName,
                                position: exp.position,
                                profession: exp.profession,
                                employment_start_date: exp.empStartDate,
                                employment_end_date: exp.empEndDate,

                            })
                            if (experienceData.length > 0) {
                                this.sideCharacterProfileWorkExperienceService.destroy(sideCharacterFilter).then(() => {
                                    // this.sideCharacterProfileWorkExperienceService.createSideCharacProfileWorkExp(experienceData)
                                })
                            }
                        })
                    }
                    res.status(httpStatus.OK).send({
                        "status": "success",
                        "data": 'Side Character updated successfully'
                    });
                } else {
                    res.send({
                        "error": {
                            "status": "failure",
                            "message": "No user found"
                        }
                    })
                }
            })
            .catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    };


    // ************************************** New *************************************************
    // --------------------------------------------------------------------------------------------

    public getSideCharacterAllProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.sideCharacterProfileService
            .getSideCharacterAllProject()
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
}