import { Request, Response, NextFunction } from 'express'
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { MemberService, TokenService, EmailService, SideCharacterProfileService, ClientProfileService, SearchOptionService, ProfileService } from '../services/'
import * as CONSTANT from '../constants'
import { getNotificationTypesByRegistrationType, getTotalUnReadNotifications, isEmpty, profileInfo, _json } from '../utils/helper';
import { MemberOutput } from './../models/member';
import { NewAccessToken } from '../types';
import { BadResponseHandler } from '../errorHandler';
import { Notification, SearchOption } from '../models';
import PaymentService from '../services/payment.service';
import { Op } from 'sequelize';

export default class MemberController {

    public memberService = new MemberService()
    public tokenService = new TokenService()
    public paymentService = new PaymentService()
    public emailService = new EmailService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public clientProfileService = new ClientProfileService()
    public searchOptionService = new SearchOptionService()
    public profileService = new ProfileService()

    public isEmailRegistered = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email }: { email: string } = req.body;

        this.memberService
            .getMemberByEmail(email)
            .then((data) => {
                if (!isEmpty(data)) {
                    let status = 'login';
                    if (data.email_verified == "no") {
                        status = "un_verify";
                    } else if (data.password == null || data.password == "") {
                        status = "verified";
                    }
                    res.api.create({
                        "is_email_registered": true,
                        status,
                    });
                } else {
                    res.api.create({
                        "is_email_registered": false
                    });
                }
            })
            .catch((err: Error) => next(err))
    }

    public generateVerificationCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email }: { email: string } = req.body;
        let code: number = Math.floor(1000 + Math.random() * 9000);

        let payload: { email: string, verification_code: number } = {
            email: email,
            verification_code: code
        }

        this.memberService
            .getMemberByEmail(email)
            .then((member) => {
                if (isEmpty(member)) {
                    this.memberService
                        .createMember(payload)
                        .then(() => {
                            this.emailService.sendEmailVerification(payload).then((data) => {
                                res.api.create({
                                    "message": "Email Send Successfully",
                                    email,
                                    code
                                });
                            }).catch((err: Error) => next(err));
                        })
                        .catch((err: Error) => next(err))
                } else {
                    let updatePayload = { ...payload, id: member.id }
                    this.memberService
                        .updateMember(updatePayload)
                        .then(() => {
                            this.emailService.sendEmailVerification(payload).then((data) => {
                                res.api.create({
                                    "message": "Email Send Successfully",
                                    email
                                });
                            }).catch((err: Error) => next(err));
                        })
                        .catch((err: Error) => next(err))
                }

            })
            .catch((err: Error) => next(err))
    }

    public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, verification_code }: { email: string, verification_code: number } = req.body;

        this.memberService.getMemberByEmail(email)
            .then(async (member) => {
                if (!isEmpty(member)) {
                    let date = (isEmpty(member.updated_at)) ? member.created_at : member.updated_at
                    let isExpired = moment().isBefore(moment(date).add(24, 'hours'));
                    if (!isExpired) {
                        res.api.badResponse({
                            "message": "Your code has been expired!",
                            "member": member,
                            "is_verify": false,
                        });
                    }
                    if (member.verification_code == verification_code) {
                        await this.memberService.updateMember({
                            id: member.id,
                            email_verified: 'yes'
                        });

                        res.api.create({
                            "message": "your email is verified",
                            "is_verify": true
                        });
                    } else {
                        res.api.badResponse({
                            "message": "verification code doesn't match",
                            "is_verify": false
                        });
                    }
                } else {
                    res.api.validationErrors({
                        "email": "Email Not Found",
                    });
                }

            })
            .catch((err: Error) => next(err))
    }

    public registerMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, password, registration_type }: { name: string, email: string, password: string, registration_type: number } = req.body;

        this.memberService.getMemberByEmail(email)
            .then(async (member: MemberOutput) => {
                if (!isEmpty(member)) {
                    // check already called this api or not
                    if (!isEmpty(member.password)) {
                        res.api.validationErrors({
                            "email": ["Email already registered"],
                        });
                    }

                    const hashedPassword: string = await bcrypt.hash(password, 8);
                    const memberData: any = {
                        name: name,
                        password: hashedPassword,
                        id: member.id
                    }
                    let profileService: any;
                    this.memberService.updateMember(memberData).then(async () => {
                        try {
                            if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {
                                profileService = await this.sideCharacterProfileService.createSideCharacterProfile({ member_id: member.id })
                            } else {
                                profileService = await this.clientProfileService.createClient({ member_id: member.id })
                            }
                        } catch (error: any) {
                            next(profileService)
                        }

                        member.name = name;

                        this.tokenService.generateMemberAccessToken(member)
                            .then(async (tokenInfo: NewAccessToken) => {
                                res.api.create({
                                    "message": "Member registration successfull",
                                    member,
                                    registration_type,
                                    "token": tokenInfo.token,
                                    profile_info: await profileInfo(member.id)
                                });
                            });

                    }).catch((err: Error) => next(err));
                } else {
                    res.api.validationErrors({
                        "email": "Email Not Found",
                    });
                }
            }).catch((err: Error) => next(err));
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password }: { email: string, password: string } = req.body;

        this.memberService.getMemberByEmail(email)
            .then((member: any) => {
                if (!isEmpty(member)) {
                    if (member.status == MemberService.STATUS_DISABLE) {
                        next(new BadResponseHandler("Your Account is deleted Please contact admin"));
                    }
                    this.memberService.checkPassword(password, member.password)
                        .then(() => {
                            this.tokenService.generateMemberAccessToken(member)
                                .then(async (tokenInfo: NewAccessToken) => {
                                    await this.paymentService.setExpiredCoins(member.id)
                                    // member = await this.searchOptionService.findByMemberId(member.id);
                                    member = await this.memberService.findByMemberId({
                                        where: member.id,
                                        include: [
                                            {
                                                model: SearchOption,
                                                as: CONSTANT.RELATIONSHIP.search_option,
                                                include: [CONSTANT.RELATIONSHIP.fields, CONSTANT.RELATIONSHIP.profession, CONSTANT.RELATIONSHIP.locations]
                                            }
                                        ]
                                    });
                                    member = member.toJSON();
                                    member.search_option = await this.searchOptionService._filterSearchOption(member.search_option);

                                    let sideCharacter: any = await _json(this.sideCharacterProfileService.findProfile({
                                        where: { member_id: member.id },
                                        include: [CONSTANT.RELATIONSHIP.profile_picture]
                                    }));

                                    let client: any = await _json(this.clientProfileService.findProfile({
                                        where: { member_id: member.id },
                                        include: [CONSTANT.RELATIONSHIP.profile_picture]
                                    }));

                                    if (!isEmpty(sideCharacter)) {
                                        sideCharacter.profile_picture = isEmpty(sideCharacter.profile_picture) ? null : sideCharacter.profile_picture.file_path;
                                    }

                                    if (!isEmpty(client)) {
                                        client.profile_picture = isEmpty(client.profile_picture) ? null : client.profile_picture.file_path;
                                    }

                                    let registration_type = (!isEmpty(sideCharacter)) ? CONSTANT.MEMBER.SIDE_CHARACTER : CONSTANT.MEMBER.CLIENT;
                                    let notificationTypes = getNotificationTypesByRegistrationType(registration_type)
                                    let total_un_read_notifications = await getTotalUnReadNotifications(notificationTypes, member.id)

                                    res.api.create({
                                        "message": "Member login successfull",
                                        token: tokenInfo.token,
                                        member,
                                        registration_type,
                                        total_un_read_notifications,
                                        profile: registration_type == CONSTANT.MEMBER.SIDE_CHARACTER ? sideCharacter : client,
                                        profile_info: await profileInfo(member.id)
                                    })
                                });
                        }).catch((err: Error) => res.api.serverError({ "message": err.message }));
                } else {
                    res.api.validationErrors({
                        "email": "Email Not Registred",
                    });
                }
            }).catch((err: Error) => res.api.serverError({ "message": err.message }));
    }

    // socialAuth || socialAuth || socialAuth || socialAuth || socialAuth || socialAuth || socialAuth

    public socialAuth = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        let memberForm: any = { name: body.name, email: body.email, login_type: body.login_type };
        switch (body.login_type) {
            case MemberService.LOGIN_TYPE_GOOGLE:
                memberForm = { ...memberForm, google_id: body.social_id };
                break;
            case MemberService.LOGIN_TYPE_FACEBOOK:
                memberForm = { ...memberForm, facebook_id: body.social_id };
                break;
            case MemberService.LOGIN_TYPE_NAVER:
                memberForm = { ...memberForm, naver_id: body.social_id };
                break;
            case MemberService.LOGIN_TYPE_KAKAOTALK:
                memberForm = { ...memberForm, kakaotalk_id: body.social_id };
                break;
            case MemberService.LOGIN_TYPE_APPLE:
                memberForm = { ...memberForm, apple_id: body.social_id };
                break;
            default:
                res.api.badResponse({
                    message: req.body.login_type + ' is invalid type'
                })
                break;
        }

        await this.memberService.getMemberByEmail(body.email)
            .then(async (member: any) => {
                if (!isEmpty(member)) {
                    if (member.status == MemberService.STATUS_DISABLE) {
                        next(new BadResponseHandler("Your Account is deleted Please contact admin"));
                    }

                    member.email_verified = "yes";
                    await this.memberService.updateMember({
                        id: member.id,
                        email_verified: member.email_verified
                    });

                    let status = 'login';
                    if (member.email_verified == "no") {
                        status = "un_verify";
                    } else if (member.password == null || member.password == "") {
                        status = "verified";
                    }

                    memberForm = { ...memberForm, id: member.id }
                    this.memberService.updateMember(memberForm).then(async () => {
                        this.tokenService.generateMemberAccessToken(member)
                            .then(async (tokenInfo: NewAccessToken) => {
                                await this.paymentService.setExpiredCoins(member.id)
                                member = await this.memberService.findByMemberId({
                                    where: member.id,
                                    include: [
                                        {
                                            model: SearchOption,
                                            as: CONSTANT.RELATIONSHIP.search_option,
                                            include: [CONSTANT.RELATIONSHIP.fields, CONSTANT.RELATIONSHIP.profession, CONSTANT.RELATIONSHIP.locations]
                                        }
                                    ]
                                });
                                member = member.toJSON();
                                member.search_option = await this.searchOptionService._filterSearchOption(member.search_option);

                                let sideCharacter: any = await _json(this.sideCharacterProfileService.findProfile({
                                    where: { member_id: member.id },
                                    include: [CONSTANT.RELATIONSHIP.profile_picture]
                                }));

                                let client: any = await _json(this.clientProfileService.findProfile({
                                    where: { member_id: member.id },
                                    include: [CONSTANT.RELATIONSHIP.profile_picture]
                                }));

                                if (!isEmpty(sideCharacter)) {
                                    sideCharacter.profile_picture = isEmpty(sideCharacter.profile_picture) ? null : sideCharacter.profile_picture.file_path;
                                }

                                if (!isEmpty(client)) {
                                    client.profile_picture = isEmpty(client.profile_picture) ? null : client.profile_picture.file_path;
                                }
                                let registration_type = (!isEmpty(sideCharacter)) ? CONSTANT.MEMBER.SIDE_CHARACTER : CONSTANT.MEMBER.CLIENT;
                                let notificationTypes = getNotificationTypesByRegistrationType(registration_type)
                                let total_un_read_notifications = await getTotalUnReadNotifications(notificationTypes, member.id)

                                res.api.create({
                                    registration_type,
                                    "message": "Member login successfull",
                                    new_member: false,
                                    token: tokenInfo.token,
                                    member,
                                    status,
                                    total_un_read_notifications,
                                    profile: registration_type == CONSTANT.MEMBER.SIDE_CHARACTER ? sideCharacter : client,
                                    profile_info: await profileInfo(member.id)
                                });
                            });
                    }).catch((err: Error) => next(err));
                } else {
                    this.memberService
                        .createMember(memberForm)
                        .then(() => {
                            res.api.create({
                                new_member: true,
                                "email": body.email,
                                "name": body.name
                            });
                        })
                        .catch((err: Error) => next(err))
                }
            }).catch((err: Error) => next(err));
    }

    // ResetPassword || ResetPassword || ResetPassword || ResetPassword || ResetPassword || ResetPassword

    public sendResetPasswordLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, locale = "kr" }: { email: string, locale: string } = req.body;

        this.memberService
            .getMemberByEmail(email)
            .then(async (memberData: MemberOutput) => {
                if (!isEmpty(memberData)) {
                    let tokenPayload: { member_id: number, expiry_at: number } = {
                        member_id: memberData.id,
                        expiry_at: moment().add('15', 'minutes').unix()
                    }
                    let token = await this.tokenService.encode(tokenPayload)

                    let emailData: { email: string, token: string, locale: string } = {
                        email,
                        token,
                        locale
                    }
                    this.emailService.passwordResetLink(emailData)
                        .then(() => {
                            res.api.create({
                                "message": "Your password reset link has been send successfully",
                            });
                        }).catch((err: Error) => next(err));

                } else {
                    res.api.validationErrors({
                        "email": "Email Not Found",
                    });
                }
            })
            .catch((err: Error) => next(err));
    }

    public confirmResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { password, token }: { password: string, token: string } = req.body;

        this.tokenService.decode(token)
            .then(async (payloadData: { member_id: number, expiry_at: number }) => {
                if (moment().unix() <= payloadData.expiry_at) {
                    const hashedPassword: string = await bcrypt.hash(password, 8);
                    this.memberService.updateMember({ password: hashedPassword, id: payloadData.member_id })
                        .then(async () => {
                            res.api.create({
                                "message": "Your Password has been changed",
                            });
                        })
                        .catch((err: Error) => next(err));
                } else {
                    res.api.badResponse({
                        "message": "Your token has been expired! Please create new one",
                    });
                }
            })
            .catch((err: Error) => next(err));

    }


    public switchAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let { registration_type } = req.body;
        registration_type = parseInt(registration_type) == 1 ? 2 : 1;
        res.api.create({
            ...await this.profileService.switchAccount(req.authMember.id, registration_type)
        });
    }


    public notificationList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let { registration_type, page }: any = req.query;
        const pageNo: number = !isEmpty(page) ? parseInt(page) : 1
        let notificationTypes = getNotificationTypesByRegistrationType(parseInt(registration_type))
        const offset: number = (pageNo - 1) * 10;
        let where = {
            to_member_id: req.authMember.id,
            notification_type: {
                [Op.in]: notificationTypes
            }
        };

        let result = await Notification.findAndCountAll({
            where,
            offset: offset,
            limit: 10,
            distinct: true,
            order: [['id', 'desc']],
        })

        await Notification.update({
            is_read: "yes"
        }, { where })

        return res.api.create(result);
    }
}