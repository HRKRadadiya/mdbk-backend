import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express'
import {
    ClientProfileService, ClientProfileFieldService, ClientProfileCompanyLocationService, ClientProfileIntroductoryImageService,
    ClientProfileCompanyService, ClientProfileCompanyHastagService, ClientProfileCompanyFieldService, ClientProfileLocationService,
    SmsService, ClientProfileImageService, MemberService
} from '../services'
import { ClientProfileInput, ClientProfileOutput } from '../models/clientProfile';
import { isEmpty } from '../utils/helper';
import { ClientProfileCompany, ClientProfileImage } from '../models';
import { ClientProfileCompanyInput } from '../models/clientProfileCompany';
import { BadResponseHandler } from '../errorHandler';
import { MemberOutput } from '../models/member';
import * as CONSTANTS from '../constants';
import { ClientProfile } from '../models'

export default class ClientProfileController {

    public memberService = new MemberService()
    public clientProfileService = new ClientProfileService()
    public clientProfileFieldService = new ClientProfileFieldService()
    public clientProfileCompanyLocationService = new ClientProfileCompanyLocationService()
    public clientProfileIntroductoryImageService = new ClientProfileIntroductoryImageService()
    public clientProfileCompanyService = new ClientProfileCompanyService()
    public clientProfileCompanyHastagService = new ClientProfileCompanyHastagService()
    public clientProfileCompanyFieldService = new ClientProfileCompanyFieldService()
    public clientProfileLocationService = new ClientProfileLocationService()
    public smsService = new SmsService()
    public clientProfileImageService = new ClientProfileImageService()

    /**
     * @return Success : data
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public getAllClients = async (req: Request, res: Response): Promise<void> => {
        this.clientProfileService
            .getAllClients()
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data
                });
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

    /**
     * @param {Id} req.params.Id
     * @return Success : data
     * @return Error : error
     */

    public getClientProfile = async (req: Request, res: Response): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        this.clientProfileService
            .getClientProfile(Id)
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

    public getClientProfileByMemberId = async (req: Request, res: Response): Promise<void> => {
        //  const Id = req.memberId;
        const Id: number = 1;
        this.clientProfileService
            .getClientProfileByMemberId(Id)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data.length > 0 ? data[0] : data
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

    public getClientByProfession = async (req: Request, res: Response): Promise<void> => {
        const profession: string = req.params.profession;
        this.clientProfileService
            .getClientByProfession(profession)
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
     * Generate SMS Verification Code
     * @return Success : number
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public generateSmsVerificationCode = async (req: Request, res: Response): Promise<void> => {
        const { phoneNumber }: { phoneNumber: string } = req.body;
        let code: number = Math.floor(1000 + Math.random() * 9000);
        // send phoneNumber code 
        this.smsService.sendSms(phoneNumber, code).then((data) => {
            // Store in session
            /*  req.session.phoneNumberVerification = {
                  phoneNumber: phoneNumber,
                  code: code
              }; */
            res.status(httpStatus.OK).send({ "status": "success", 'code': code });
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
     * verify phoneNumber
     * @return Success : verified message
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public verifyPhone = async (req: Request, res: Response): Promise<void> => {
        const { phoneNumber, code, prevCode, previousPhoneNumber }: { phoneNumber: string, code: number, prevCode: number, previousPhoneNumber: string } = req.body;
        if (
            previousPhoneNumber && previousPhoneNumber == phoneNumber &&
            prevCode && prevCode == code) {
            res.status(httpStatus.OK).send({
                "status": "success",
                "data": "Phone number verified"
            });
        } else {
            res.status(httpStatus.BAD_REQUEST).send({
                "status": "failure",
                "data": "Invalid code"
            });
        }
    };


    /**
     * @input : Form( Object ) : req.body
     * @return Success : {nick_name: x,introduction:x,profession:x,homepage_link:x,facebook_link:x,instagram_link:x,other_link:x,is_company: x,desired_date:x, desired_time:x,
                           desired_project_type: x,insurance_status:x,member_id:x}
      * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public createClientProfile = async (req: Request, res: Response): Promise<void> => {
        // const clientData = req.body
        const client = req.body
        const clientProfileData = {
            nick_name: client.nickName,
            introduction: client.introduction,
            phone: client.phoneNumber,
            profession: client.profession.toString(),
            homepage_link: client.homepageLink,
            facebook_link: client.facebookLink,
            instagram_link: client.instagramLink,
            other_link: client.otherLink,
            is_company: client.isCompany,
            desired_date: client.desiredDate,
            desired_time: client.desiredTime,
            desired_project_type: client.desiredProjectType,
            insurance_status: client.insuranceStatus,
            desired_work_type: client.desiredWorkType,
            member_id: client.memberId
        };

        this.clientProfileService
            .getClientByNickName(client.nickName)
            .then(async (data) => {
                if (!data) {
                    this.clientProfileService
                        .createClient(clientProfileData)
                        .then((data) => {

                            if (req.files) {
                                const Document: any = req.files.introductryImg;
                                Document.mv(`$../../uploads/Files/${Document.name}`);
                                console.log("success", req.files)
                            } else {
                                console.log("else part %%%%%%%%%%%%%%")
                            }


                            /*
                             create client Profile field
                            */
                            if (client.fieldName && client.fieldName != '') {
                                const clientProfileFieldData: any = [];
                                for (let i = 0; i < client.fieldName.length; i++) {
                                    clientProfileFieldData.push({
                                        client_profile_id: data.id,
                                        name: client.fieldName[i]
                                    })
                                }
                                if (clientProfileFieldData.length > 0) {
                                    this.clientProfileFieldService.create(clientProfileFieldData);
                                }
                            }
                            /*
                            create client Profile location
                           */
                            if (client.location && client.location != '') {
                                const clientProfileLocationData: any = [];
                                if (client.location.length > 0) {
                                    for (let i = 0; i < client.location.length; i++) {
                                        clientProfileLocationData.push({
                                            client_profile_id: data.id,
                                            city: client.location[i].city,
                                            district: client.location[i].district,
                                            country: 'test'
                                        })
                                    }
                                    this.clientProfileLocationService.create(clientProfileLocationData);
                                }
                            }
                            /*
                            create client Profile Introductry image
                           */
                            if (client.introductryImg && client.introductryImg != '') {
                                const clientImgData: any = [];
                                for (let i = 0; i < client.introductryImg.length; i++) {
                                    clientImgData.push({
                                        client_profile_id: data.id,
                                        file_name: client.introductryImg[i].name,
                                        original_file_name: client.introductryImg[i].name,
                                        file_type: client.introductryImg[i].type,
                                        file_path: client.introductryImg[i].filePath,
                                    })
                                }
                                if (clientImgData.length > 0) {
                                    this.clientProfileIntroductoryImageService.createClientProfileIntroductoryImg(clientImgData);
                                }
                            }

                            /*
                           create client Profile image
                          */
                            if (client.img && client.img != '') {
                                const clientImgData: any = [];
                                for (let i = 0; i < client.img.length; i++) {
                                    clientImgData.push({
                                        client_profile_id: data.id,
                                        file_name: client.img[i].name,
                                        original_file_name: client.img[i].name,
                                        file_type: client.img[i].fileType.type,
                                        file_path: client.img[i].filePath,
                                    })
                                }
                                if (clientImgData.length > 0) {
                                    this.clientProfileImageService.createClientProfileImg(clientImgData);
                                }
                            }
                            /*
                           create client Profile company
                           */
                            if (client.company && client.company != '') {
                                const clientCompany = client.company
                                const clientCompanyData = {
                                    client_profile_id: data.id,
                                    name: clientCompany.companyName,
                                    introduction: clientCompany.companyIntroduction,
                                    contact_information: clientCompany.contactInfo,
                                    profession: clientCompany.companyProfession.toString(),
                                    registation_number: clientCompany.registerationNumber,
                                    foundation_year: clientCompany.foundation,
                                    total_employees: clientCompany.numberOfEmployee,
                                    representative_name: clientCompany.representativeName
                                };

                                this.clientProfileCompanyService.createClientProfileCompany(clientCompanyData).then((companyData) => {
                                    /*
                                     create client Profile company hashtag
                                     */
                                    if (clientCompany.companyHashtag && clientCompany.companyHashtag.length > 0) {
                                        clientCompany.companyHashtag.map((hashtag: string) => {
                                            const companyHashtagData: any = [];
                                            companyHashtagData.push({
                                                client_profile_company_id: companyData.id,
                                                name: hashtag
                                            })
                                            if (companyHashtagData.length > 0) {
                                                this.clientProfileCompanyHastagService.create(companyHashtagData);
                                            }
                                        })
                                        /*
                                        create client Profile company field
                                       */
                                        if (clientCompany.fieldName && clientCompany.fieldName.length > 0) {
                                            clientCompany.fieldName.map((field: string) => {
                                                const companyFieldNameData: any = [];
                                                companyFieldNameData.push({
                                                    client_profile_company_id: companyData.id,
                                                    name: field
                                                })
                                                if (companyFieldNameData.length > 0) {
                                                    this.clientProfileCompanyFieldService.create(companyFieldNameData);
                                                }
                                            })
                                        }
                                        /*
                                             create client Profile company location
                                        */

                                        if (clientCompany.location && clientCompany.location.length > 0) {
                                            clientCompany.location.map((locations: any) => {
                                                const companyLocationData: any = [];
                                                companyLocationData.push({
                                                    client_profile_company_id: companyData.id,
                                                    city: locations.city,
                                                    district: locations.district,
                                                    country: locations.country
                                                })
                                                if (companyLocationData.length > 0) {
                                                    this.clientProfileCompanyLocationService.create(companyLocationData);
                                                }
                                            })
                                        }

                                    }
                                })

                            }
                            res.status(httpStatus.OK).send({
                                "status": "success",
                                "data": "Client Profile Created successfully"
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
     * @input : Form( Object ) : clientData
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public updateClientProfile = async (req: Request, res: Response): Promise<void> => {
        const Id = parseInt(req.params.Id);
        const filter = { where: { id: Id } }
        const client = req.body
        const ClientProfileFieldFilter = { where: { client_profile_id: Id } }
        const clientProfileData: any = {
            nick_name: client.nickName,
            introduction: client.introduction,
            phone: client.phoneNumber,
            profession: client.profession,
            homepage_link: client.homepageLink,
            facebook_link: client.facebookLink,
            instagram_link: client.instagramLink,
            other_link: client.otherLink,
            is_company: client.isCompnay,
            desired_date: client.desiredDate,
            desired_time: client.desiredTime,
            desired_project_type: client.desiredProjectType,
            insurance_status: client.insuranceStatus,
            desired_work_type: client.desiredWorkType
        };

        this.clientProfileService.getClientProfile(Id)
            .then((userData) => {
                if (userData.length > 0) {
                    this.clientProfileService
                        .update(clientProfileData, filter)

                    //update client Profile field

                    if (client.fieldName && client.fieldName.length > 0) {
                        client.fieldName.map((field: string) => {
                            const clientProfileFieldData: any = [];
                            clientProfileFieldData.push({
                                client_profile_id: Id,
                                name: field
                            })
                            if (clientProfileFieldData.length > 0) {
                                this.clientProfileFieldService.deleteClientProfileField(ClientProfileFieldFilter).then(() => {
                                    this.clientProfileFieldService.create(clientProfileFieldData);
                                })

                            }
                        })

                    }

                    //update client Profile location

                    if (client.location && client.location.length > 0) {
                        client.location.map((locations: any) => {
                            const clientProfileLocationData: any = [];
                            clientProfileLocationData.push({
                                client_profile_id: Id,
                                city: locations.city,
                                district: locations.district,
                                country: locations.country
                            })
                            if (clientProfileLocationData.length > 0) {
                                this.clientProfileLocationService.deleteClientProfileLocation(ClientProfileFieldFilter).then(() => {
                                    this.clientProfileLocationService.create(clientProfileLocationData);
                                })

                            }
                        })
                    }

                    //update client Profile introductryImg

                    if (client.introductryImg && client.introductryImg.length > 0) {
                        client.introductryImg.map((imgs: any) => {
                            const clientImgData: any = [];
                            clientImgData.push({
                                client_profile_id: Id,
                                file_name: imgs.fileName,
                                original_file_name: imgs.originalName,
                                file_type: imgs.fileType,
                                file_path: imgs.filePath
                            })
                            if (clientImgData.length > 0) {
                                // this.clientProfileIntroductoryImageService.destroy(ClientProfileFieldFilter).then(() => {
                                //     this.clientProfileIntroductoryImageService.createClientProfileIntroductoryImg(clientImgData);
                                // })

                            }
                        })
                    }

                    //update client Profile Image

                    if (client.img && client.img.length > 0) {
                        client.img.map((img: any) => {
                            const clientImgData: any = [];
                            clientImgData.push({
                                client_profile_id: Id,
                                file_name: img.fileName,
                                original_file_name: img.originalName,
                                file_type: img.fileType,
                                file_path: img.filePath
                            })
                            if (clientImgData.length > 0) {
                                this.clientProfileImageService.deleteClientProfileImg(ClientProfileFieldFilter).then(() => {
                                    this.clientProfileImageService.createClientProfileImg(clientImgData);
                                })
                            }
                        })
                    }

                    //update client Profile company

                    if (client.company && client.company != '') {
                        const clientCompany = client.company
                        const clientCompanyData: any = {
                            name: clientCompany.companyName,
                            introduction: clientCompany.companyIntoduction,
                            contact_information: clientCompany.contactInfo,
                            profession: clientCompany.companyProfession,
                            registation_number: clientCompany.registerationNumber,
                            foundation_year: clientCompany.foundation,
                            total_employees: clientCompany.numberOfEmployee,
                            representative_name: clientCompany.representativeName
                        };

                        this.clientProfileCompanyService.updateClientProfileCompany(clientCompanyData, ClientProfileFieldFilter).then((company) => {
                            this.clientProfileCompanyService.getClientProfileCompany(Id).then((companyData) => {
                                if (companyData.length > 0) {

                                    const companyIdFilter = { where: { client_profile_company_id: companyData[0].id } }
                                    /*
                                      update client Profile company hashtag
                                   */
                                    if (clientCompany.companyHashtag && clientCompany.companyHashtag.length > 0) {
                                        clientCompany.companyHashtag.map((hashtag: string) => {
                                            const companyHashtagData: any = [];
                                            companyHashtagData.push({
                                                client_profile_company_id: companyData[0].id,
                                                name: hashtag
                                            })
                                            if (companyHashtagData.length > 0) {
                                                this.clientProfileCompanyHastagService.deleteClientProfileCompanyHashtag(companyIdFilter).then(() => {
                                                    this.clientProfileCompanyHastagService.create(companyHashtagData);
                                                })

                                            }
                                        })
                                        /*
                                         update client Profile company field
                                       */
                                        if (clientCompany.fieldName && clientCompany.fieldName.length > 0) {
                                            clientCompany.fieldName.map((field: string) => {
                                                const companyFieldNameData: any = [];
                                                companyFieldNameData.push({
                                                    client_profile_company_id: companyData[0].id,
                                                    name: field
                                                })
                                                if (companyFieldNameData.length > 0) {
                                                    this.clientProfileCompanyFieldService.deleteClientProfileCompanyField(companyIdFilter).then(() => {
                                                        this.clientProfileCompanyFieldService.create(companyFieldNameData);
                                                    })

                                                }
                                            })
                                        }
                                        /*
                                           update client Profile company location
                                        */
                                        if (clientCompany.location && clientCompany.location.length > 0) {
                                            clientCompany.location.map((locations: any) => {
                                                const companyLocationData: any = [];
                                                companyLocationData.push({
                                                    client_profile_company_id: companyData[0].id,
                                                    city: locations.city,
                                                    district: locations.district,
                                                    country: locations.country
                                                })
                                                if (companyLocationData.length > 0) {
                                                    this.clientProfileCompanyLocationService.deleteClientProfileCompanyLocation(companyIdFilter).then(() => {
                                                        this.clientProfileCompanyLocationService.create(companyLocationData);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        })
                    }
                    res.status(httpStatus.OK).send({
                        "status": "success",
                        "message": 'Client updated successfully'
                    });
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
}