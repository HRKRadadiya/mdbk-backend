import { MemberTokenPayload, UserTokenPayload } from './../types/index';
import { Request, NextFunction, Response } from 'express';
import { BadResponseHandler, TokenExpiredUserHandler, UnauthorizedUserHandler } from '../errorHandler';
import { MemberService, ProfileService, TokenService, UserService } from '../services';
import moment from 'moment';
import { isEmpty, _json } from '../utils/helper';
import { MEMBER } from '../constants';

const tokenService = new TokenService();
const memberService = new MemberService();
const userService = new UserService();
const profileService = new ProfileService();

const AuthMiddleware = {
    user(isRequired: boolean = true) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (isRequired) {
                let authorization = req.header('Authorization');
                if (authorization) {
                    authorization = authorization.replace('Bearer ', '');
                    return tokenService.decode(authorization).then(async (payload: UserTokenPayload) => {
                        const isExpire = !(payload.expires >= moment().unix());
                        if (isExpire) {
                            return next(new TokenExpiredUserHandler());
                        }
                        const _user = await userService.getUserById(payload.user.id);
                        if (isEmpty(_user)) {
                            return next(new UnauthorizedUserHandler());
                        }
                        req.authUser = payload.user;
                        return next();
                    }).catch(err => next(err));
                }
                return next(new UnauthorizedUserHandler());
            }
            return next();
        }
    },

    member(isRequired: boolean = true) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (isRequired || req.header('Authorization')) {
                let authorization = req.header('Authorization');
                if (authorization) {
                    authorization = authorization.replace('Bearer ', '');
                    return tokenService.decode(authorization).then(async (payload: MemberTokenPayload) => {
                        const isExpire = !(payload.expires >= moment().unix());
                        if (isExpire || isEmpty(payload.member)) {
                            return next(new TokenExpiredUserHandler());
                        }
                        const _member = await memberService.getUserById(payload.member.id);
                        if (isEmpty(_member)) {
                            return next(new UnauthorizedUserHandler());
                        }

                        if (!isEmpty(_member) && _member.status == MemberService.STATUS_DISABLE) {
                            return next(new BadResponseHandler("Your Account is deleted Please contact admin"));
                        }
                        req.authMember = _member;
                        req.profile = await getSideCharacterAndClient(_member.id);
                        return next();
                    }).catch(err => next(new TokenExpiredUserHandler()));
                }
                return next(new UnauthorizedUserHandler());
            }
            return next();
        }
    }
}

const getSideCharacterAndClient = async (memberId: any) => {
    let side_character_profile: any = await _json(profileService.findProfile({
        where: { member_id: memberId }
    }, MEMBER.SIDE_CHARACTER));

    let client_profile: any = await _json(profileService.findProfile({
        where: { member_id: memberId }
    }, MEMBER.CLIENT));

    return { side_character_profile, client_profile }
}

export default AuthMiddleware;