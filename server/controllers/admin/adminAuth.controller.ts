import { NextFunction, Request, Response } from 'express'
import { isEmpty } from 'lodash';
import { UserOutput } from './../../models/user';
import { TokenService, UserService } from '../../services';
import { NewAccessToken } from '../../types';
import { FormErrorsHandler, NotExistHandler } from '../../errorHandler';

export default class AdminAuthController {

    public userService = new UserService()
    public tokenService = new TokenService()

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password }: { email: string, password: string } = req.body;

        this.userService.getUserByEmail(email)
            .then((user: UserOutput) => {
                if (!isEmpty(user)) {
                    this.userService
                        .checkPassword(password, user.password)
                        .then(() => {
                            this.tokenService.generateAdminAccessToken(user)
                                .then((tokenInfo: NewAccessToken) => {
                                    res.api.create({
                                        token: tokenInfo.token,
                                        user: user
                                    })
                                });
                        }).catch((error: any) =>{
                            if(error.message !=undefined){
                                next(new FormErrorsHandler({
                                    password: error.message
                                }));
                            }
                            next(error)
                        })
                } else {
                    next(new FormErrorsHandler({
                        email: 'incorrect email'
                    }));
                }
            }).catch((error: Error) => next(error))
    };
}